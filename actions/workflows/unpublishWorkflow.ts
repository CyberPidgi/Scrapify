"use server"

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function unpublishWorkflow(workflowId: string){
  const { userId } = auth();

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
    throw new Error(`Workflow ${workflowId} not found`)
  }

  if (workflow.status !== WorkflowStatus.PUBLISHED) {
    throw new Error('Workflow is not in published state')
  }

  await prisma.workflow.update({
    where: {
      id: workflowId,
      userId
    },
    data: {
      status: WorkflowStatus.DRAFT,
      executionPlan: null,
      creditsCost: 0,
    }
  })

  revalidatePath(`/workflow/editor/${workflowId}`)
}