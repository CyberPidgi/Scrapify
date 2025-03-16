"use server"

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function removeWorkflowSchedule(id: string){
  const { userId } = auth()

  if (!userId) {
    throw new Error('You must be logged in to remove a workflow schedule')
  }

  await prisma.workflow.update({
    where: { id, userId },
    data: {
      cron: null,
      nextRunAt: null
    }
  })

  revalidatePath('/workflows')
}