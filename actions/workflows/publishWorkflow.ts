'use server'

import prisma from '@/lib/prisma'
import { FlowToExecutionPlan } from '@/lib/workflow/ExecutionPlan'
import { CalculateWorkflowCost } from '@/lib/workflow/helpers'
import { WorkflowStatus } from '@/types/workflow'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function publishWorkflow ({
  workflowId,
  flowDefinition
}: {
  workflowId: string
  flowDefinition: string
}) {
  const { userId } = auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId
    }
  })

  if (!workflow) {
    console.log(workflow)
    throw new Error(`Workflow ${workflowId} not found`)
  }

  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error('Workflow is not in draft state')
  }

  const flow = JSON.parse(flowDefinition)
  const result = FlowToExecutionPlan(flow.nodes, flow.edges)

  if (!result) {
    throw new Error('Invalid Flow Definition')
  }

  if (!result.executionPlan) {
    throw new Error('No Execution Plan Generated')
  }

  const creditsCost = CalculateWorkflowCost(flow.nodes)

  await prisma.workflow.update({
    where: {
      id: workflowId,
      userId
    },
    data: {
      status: WorkflowStatus.PUBLISHED,
      definition: flowDefinition,
      executionPlan: JSON.stringify(result.executionPlan),
      creditsCost
    }
  })

  revalidatePath(`/workflow/editor/${workflowId}`)
}
