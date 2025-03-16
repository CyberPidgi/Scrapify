"use server"

import prisma from "@/lib/prisma";
import { duplicateWorkflowSchema, duplicateWorkflowSchemaType } from "@/schema/workflow";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function duplicateWorkflow(form: duplicateWorkflowSchemaType) {
  const { success, data } = duplicateWorkflowSchema.safeParse(form);

  if (!success) {
    throw new Error('Invalid form data');
  }

  const { userId } = auth();
  if (!userId) {
    throw new Error('User not authenticated');
  }

  const source = await prisma.workflow.findUnique({
    where: {
      id: data.workflowId,
      userId
    }
  })

  if (!source) {
    throw new Error('Workflow not found');
  }

  const result = await prisma.workflow.create({
    data: {
      name: data.name,
      description: data.description,
      userId,
      status: WorkflowStatus.DRAFT,
      definition: source.definition,
    }
  })

  if (!result) {
    throw new Error('Failed to duplicate workflow');
  }

  revalidatePath('/workflows')
}