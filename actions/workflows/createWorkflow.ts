"use server"

import prisma from "@/lib/prisma";
import { createWorkflowSchema,createWorkflowSchemaType } from "@/schema/workflow"
import { auth } from "@clerk/nextjs/server";

import { WorkflowStatus } from "@/types/workflow";
import { redirect } from "next/navigation";
import { AppNode } from "@/types/appNode";
import { Edge } from "@xyflow/react";
import { createFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/task";

export async function createWorkflow(
  form: createWorkflowSchemaType
) {
  const { success, data } = createWorkflowSchema.safeParse(form);

  if (!success) throw new Error('Invalid form');

  const { userId } = auth();

  if (!userId) throw new Error('Not authenticated');

  const initialFlow: { nodes: AppNode[], edges: Edge[] } = {
    nodes: [],
    edges: []
  }

  initialFlow.nodes.push(createFlowNode(
    TaskType.LAUNCH_BROWSER,
  ))

  const result = await prisma.workflow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: JSON.stringify(initialFlow),
      ...data
    }
  })

  if (!result) throw new Error('Failed to create workflow');

  redirect(`/workflow/editor/${result.id}`);
}