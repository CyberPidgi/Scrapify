'use server'

import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import parser from 'cron-parser'
import { revalidatePath } from 'next/cache'

export async function updateWorkflowCron ( {id, cron } : {
  id: string,
  cron: string
}) {
  const { userId } = auth()

  if (!userId) {
    throw new Error('You must be logged in to update a workflow')
  }

  try {
    const interval = parser.parse(cron)
    await prisma.workflow.update({
      where: { id, userId },
      data: {
        cron,
        nextRunAt: interval.next().toDate()
      }
    })
  } catch (error) {
    console.log(error)
    throw new Error("Invalid cron expression")
  }
  
  revalidatePath('/workflows')
}
