'use server'

import prisma from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/ExecutionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { ExecutionPhaseStatus, WorkflowExecutionPlan, WorkflowExecutionTrigger, WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server"

import { WorkflowExecutionStatus } from "@/types/workflow";
import { redirect } from "next/navigation";
import { executeWorkflow } from "@/lib/workflow/executeWorkflow";

export async function runWorkflow (form: {
  workflowId: string
  flowDefinition?: string
}) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized')
  }

  const { workflowId, flowDefinition } = form
  if (!workflowId) {
    throw new Error('Workflow ID is required')
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      userId, 
      id: workflowId
    }
  })

  if (!workflow) {
    throw new Error('Workflow not found')
  }
  
  let executionPlan: WorkflowExecutionPlan | undefined;
  let workflowDefintion = flowDefinition
  let error: any | null = null;

  if (workflow.status === WorkflowStatus.PUBLISHED) {
    executionPlan = JSON.parse(workflow.executionPlan!)
    workflowDefintion = workflow.definition
  } else {
    const flow = JSON.parse(flowDefinition!)
    if (!flowDefinition) {
      throw new Error('Flow definition is required')
    }
    
    const result = FlowToExecutionPlan(flow.nodes, flow.edges);
    executionPlan = result!.executionPlan;
    error = result.error;
  }

  if (error) {
    throw new Error('Invalid flow definition')
  }

  if (!executionPlan) {
    throw new Error('Execution plan not generated')
  }

  // console.log("Execution Plan", executionPlan);

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId: workflowId,
      userId: userId,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
      definition: workflowDefintion,
      phases: {
        create: executionPlan.flatMap(phase =>  {
          return phase.nodes.flatMap((node) => {
            return {
              userId,
              status: ExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,

            }
          })
        })
      },
    },
    select: {
      id: true,
      phases: true
    }
  })

  if (!execution) {
    throw new Error('Execution not created')
  }

  executeWorkflow(execution.id);

  redirect(`/workflow/runs/${workflowId}/${execution.id}`)
}
