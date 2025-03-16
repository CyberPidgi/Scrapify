import 'server-only'
import prisma from '../prisma'
import { revalidatePath } from 'next/cache';
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from '@/types/workflow';
import { waitFor } from '../helper/waitFor';
import { ExecutionPhase } from '@prisma/client';
import { AppNode } from '@/types/appNode';
import { TaskRegistry } from './task/registry';
import { ExecutorRegistry } from './executor/registry';
import { Environment, ExecutionEnvironment } from '@/types/Executor';
import { TaskInputValue } from '@/types/task';
import { Browser, Page } from 'puppeteer';
import { Edge } from '@xyflow/react';
import { LogCollector } from '@/types/log';
import { createLogCollector } from '../log';

export async function executeWorkflow (executionId: string, nextRunAt?: Date) {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: { workflow: true, phases: true }
  })
  
  if (!execution) {
    throw new Error('Execution not found')
  }

  const edges = JSON.parse(execution.definition).edges as Edge[]

  // setup execution environment
  const environment = {
    phases: {}
  }

  // initialize workflow execution
  await initializeWorkflowExecution(executionId, execution.workflowId, nextRunAt)

  // initialize phases status
  await initializePhaseStatuses(execution)
  
  let creditsConsumed = 0;
  let executionFailed = false;
  for (const phase of execution.phases){
    const phaseExecution = await executeWorkflowPhase(phase, environment, edges, execution.userId);

    creditsConsumed += phaseExecution.creditsConsumed;
    if (!phaseExecution.success){
      executionFailed = true;
      break;
    }

  }


  // finalize execution
  await finalizeWorkflowExecution(executionId, execution.workflowId, executionFailed, creditsConsumed)

  // clean up environment
  await cleanupEnvironment(environment)

  revalidatePath('/workflows/runs')
}

async function initializeWorkflowExecution(executionId: string, workflowId: string, nextRunAt?: Date) {
  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING
    }
  })

  await prisma.workflow.update({
    where: { id: workflowId },
    data: {
      lastRunAt: new Date(),
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
      lastRunId: executionId,
      ...(nextRunAt && { nextRunAt }) // only update nextRunAt if it is provided
    }
  })
}

async function initializePhaseStatuses(execution: any){
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase: any) => phase.id)
      },
    },
    data: {
      status: ExecutionPhaseStatus.PENDING
    },
  })
}

async function finalizeWorkflowExecution(executionId: string, workflowId: string, executionFailed: boolean, creditsConsumed: number) {
  const finalStatus = executionFailed ? WorkflowExecutionStatus.FAILED : WorkflowExecutionStatus.COMPLETED;


  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      completedAt: new Date(),
      status: finalStatus,
      creditsConsumed
    }
  })

  await prisma.workflow.update({
    where: { 
      id: workflowId,
      lastRunId: executionId // ensure only the latest execution updates the workflow
    },
    data: {
      lastRunStatus: finalStatus,
    }
  }).catch((err) => {
    // ignore the error
    // as we have triggered other runs for this workflow
    // while an execution was running
    console.log(err)
  })


}

async function executeWorkflowPhase(phase: ExecutionPhase, environment: Environment, edges: Edge[], userId: string){
  const startedAt = new Date();
  const logCollector = createLogCollector();

  const node = JSON.parse(phase.node) as AppNode;
  setupEnvironmentForPhase(environment, node, edges);

  await prisma.executionPhase.update({
    where: { id: phase.id },
    data: {
      startedAt,
      status: ExecutionPhaseStatus.RUNNING,
      inputs: JSON.stringify(environment.phases[node.id].inputs)
    }
  });

  const creditsRequired = TaskRegistry[node.data.type].credits

  // await waitFor(1000)
  // const success = Math.random() < 0.7

  let success = await decrementCredits({ userId, amount: creditsRequired, logCollector });
  const creditsConsumed = success ? creditsRequired : 0;
  if (success){
    success = await executePhase(phase, node, environment, logCollector);
  }
  
  const outputs = environment.phases[node.id].outputs;
  await finalizePhase(phase.id, success, outputs, logCollector, creditsConsumed);

  return { success, creditsConsumed };
}

async function finalizePhase(phaseId: string, success: boolean, outputs: any, logCollector: LogCollector, creditsConsumed: number){

  const finalStatus = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED;
  const completedAt = new Date();

  await prisma.executionPhase.update({
    where: { id: phaseId },
    data: {
      completedAt,
      status: finalStatus,
      outputs: JSON.stringify(outputs),
      creditsConsumed: creditsConsumed,
      logs: {
        createMany: {
          data: logCollector.getAll().map((log) => ({
            message: log.message,
            logLevel: log.level,
            timestamp: log.timestamp,

          }))
        }
      }
    }
  })
}

async function executePhase(phase: ExecutionPhase, node: AppNode, environment: Environment, logCollector: LogCollector): Promise<boolean> {

  const runFunction = ExecutorRegistry[node.data.type];

  if (!runFunction){
    logCollector.error(`Executor not found for task type: ${node.data.type}`);
    return false;
  }

  const executionEnvironment: ExecutionEnvironment<any> = createExecutionEnvironment(node, environment, logCollector);

  return await runFunction(executionEnvironment);
}

function setupEnvironmentForPhase(environment: Environment, node: AppNode, edges: Edge[]) {
  environment.phases[node.id] = {
    inputs: {},
    outputs: {},
  }

  const inputsDefinition = TaskRegistry[node.data.type].inputs;
  for (const input of inputsDefinition) {
    if (input.type === TaskInputValue.BROWSER_INSTANCE) continue
    const inputValue = node.data.inputs[input.name];
    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue;
    } else {
      const connectedEdge = edges.find((edge) => edge.target === node.id && edge.targetHandle === input.name);

      if (!connectedEdge) {
        console.error(`Missing edge for input: ${input.name} in node: ${node.id}`);
        continue;
      }

      const outputValue = environment.phases[connectedEdge.source]?.outputs[connectedEdge.sourceHandle!];

      environment.phases[node.id].inputs[input.name] = outputValue;
    }
  }
}

function createExecutionEnvironment(node: AppNode, environment: Environment, logCollector: LogCollector): ExecutionEnvironment<any> {
  return {
    getInput(name: string): string {
      return environment.phases[node.id]?.inputs[name];
    },
    getBrowser(): Browser | undefined {
      return environment.browser;
    },

    setBrowser(browser: Browser): void {
      environment.browser = browser;
    },

    getPage(): Page | undefined {
      return environment.page;
    },

    setPage(page: Page): void {
      environment.page = page;
    },

    setOutput(name: string, value: string): void {
      environment.phases[node.id].outputs[name] = value;
    },

    log: logCollector
  }
}

async function cleanupEnvironment(environment: Environment){
  if (environment.browser){
    await environment.browser.close().catch((err) => {
      console.log("Error closing browser: ", err);
    })
  }
}

async function decrementCredits({ userId, amount, logCollector }: { userId: string, amount: number, logCollector: LogCollector }) {
  try {
    await prisma.userBalance.update({
      where: {
        userId,
        credits: { gte: amount }
      },
      data: {
        credits: {
          decrement: amount
        }
      }
    })

    return true;
  } catch (error: any) {
    logCollector.error(`Error decrementing credits: ${error.message}`)

    return false;
  }
}
