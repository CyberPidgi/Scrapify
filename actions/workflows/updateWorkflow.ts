"use server";

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateWorkflow({
  id, definition
}: {
  id: string;
  definition: string;
}) {
  const { userId } = auth();

  if (!userId) throw new Error('Not authenticated'); 

  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
      userId
    }
  })

  if (!workflow) throw new Error('Workflow not found');

  if (workflow.status !== WorkflowStatus.DRAFT) throw new Error('Cannot update workflow: Workflow is not a draft');

  await prisma.workflow.update({
    where: {
      id
    },
    data: {
      definition
    }
  })

  revalidatePath(`/workflows`)
}