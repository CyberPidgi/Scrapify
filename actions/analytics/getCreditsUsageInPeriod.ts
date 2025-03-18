'use server'

import { periodToDateRange } from '@/lib/helper/dates'
import prisma from '@/lib/prisma'
import { Period } from '@/types/analytics'
import { ExecutionPhaseStatus } from '@/types/workflow'
import { auth } from '@clerk/nextjs/server'
import { eachDayOfInterval, format } from 'date-fns'

export async function getCreditsUsageInPeriod (period: Period) {
  const { userId } = auth()
  if (!userId) {
    throw new Error('User not authenticated')
  }

  const dateRange = periodToDateRange(period)
  const { COMPLETED, FAILED } = ExecutionPhaseStatus

  const executionPhases = await prisma.executionPhase.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate
      },
      status: {
        in: [COMPLETED, FAILED]
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

  executionPhases.forEach(phase => {
    const date = format(phase.startedAt!, dateFormat)
    if (phase.status === COMPLETED) {
      stats[date].success += phase.creditsConsumed ?? 0
    } 
    else if (phase.status === FAILED) {
      stats[date].failed += phase.creditsConsumed ?? 0
    }
  })

  const result = Object.entries(stats).map(([date, infos]) => ({
    date,
    ...infos
  }))
  
  return result
}
