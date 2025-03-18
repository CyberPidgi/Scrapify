'use server'

import { periodToDateRange } from '@/lib/helper/dates'
import prisma from '@/lib/prisma'
import { Period } from '@/types/analytics'
import { WorkflowExecutionStatus } from '@/types/workflow'
import { auth } from '@clerk/nextjs/server'
import { eachDayOfInterval, format } from 'date-fns'

export async function getWorkflowExecutionStats (period: Period) {
  const { userId } = auth()
  if (!userId) {
    throw new Error('User not authenticated')
  }

  const dateRange = periodToDateRange(period)
  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate
      }
    }
  })

  const dateFormat = 'yyyy-MM-dd'
  const stats = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate
  })
    .map(date => {
      return format(date, dateFormat)
    })
    .reduce((acc, date) => {
      acc[date] = {
        success: 0,
        failed: 0
      }
      return acc
    }, {} as Record<string, { success: number; failed: number }>)

  executions.forEach(execution => {
    const date = format(execution.startedAt!, dateFormat)
    if (execution.status === WorkflowExecutionStatus.COMPLETED) {
      stats[date].success++
    } 
    else if (execution.status === WorkflowExecutionStatus.FAILED) {
      stats[date].failed++
    }
  })

  const result = Object.entries(stats).map(([date, infos]) => ({
    date,
    ...infos
  }))
  
  return result
}
