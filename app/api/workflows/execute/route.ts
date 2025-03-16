import prisma from '@/lib/prisma'
import { executeWorkflow } from '@/lib/workflow/executeWorkflow'
import { TaskRegistry } from '@/lib/workflow/task/registry'
import {
  ExecutionPhaseStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger
} from '@/types/workflow'
import { timingSafeEqual } from 'crypto'
import parser from 'cron-parser'

function isValidSecret (secret: string) {
  // we will avoid using === to prevent timing attacks

  const API_SECRET = process.env.API_SECRET
  if (!API_SECRET) {
    return false
  }

  try {
    return timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET))
  } catch (error) {
    return false
  }
}

export async function GET (request: Request) {
  const authHeader = request.headers.get('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }

  const secret = authHeader.split(' ')[1]
  if (!isValidSecret(secret)) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const workflowId = searchParams.get('workflowId') as string

  if (!workflowId) {
    return Response.json({ error: 'missing workflowId' }, { status: 400 })
  }

  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId }
  })

  if (!workflow) {
    return Response.json({ error: 'workflow not found' }, { status: 404 })
  }

  const executionPlan = JSON.parse(
    workflow.executionPlan!
  ) as WorkflowExecutionPlan

  if (!executionPlan) {
    return Response.json(
      { error: 'workflow has no execution plan' },
      { status: 400 }
    )
  }

  let nextRunAt;
  try {
    const cron = parser.parse(workflow.cron!);

    nextRunAt = cron.next().toDate();
  } catch {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }


  // why cant we just run the runWorkflow.ts function here ????
  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId: workflowId,
      userId: workflow.userId,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
      definition: workflow.definition,
      phases: {
        create: executionPlan.flatMap(phase => {
          return phase.nodes.flatMap(node => {
            return {
              userId: workflow.userId,
              status: ExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label
            }
          })
        })
      }
    }
  })

  await executeWorkflow(execution.id, nextRunAt);

  return Response.json(null, { status: 200 })
}
