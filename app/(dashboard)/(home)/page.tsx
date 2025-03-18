import { getPeriods } from '@/actions/analytics/getPeriods'
import React, { Suspense } from 'react'
import PeriodSelector from './_components/PeriodSelector'
import { Period } from '@/types/analytics'
import { Skeleton } from '@/components/ui/skeleton'
import { getStatsCardsValues } from '@/actions/analytics/getStatsCardsValues'
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from 'lucide-react'
import StatsCard from './_components/StatsCard'
import { getWorkflowExecutionStats } from '@/actions/analytics/getWorkflowExecutionStats'
import ExecutionStatusChart from './_components/ExecutionStatusChart'
import { getCreditsUsageInPeriod } from '@/actions/analytics/getCreditsUsageInPeriod'
import CreditsUsageChart from '../billing/_components/CreditsUsageChart'

const page = ({
  searchParams
}: {
  searchParams: {
    month?: string
    year?: string
  }
}) => {
  // setting period
  const currentDate = new Date()
  const { month, year } = searchParams
  const period: Period = {
    year: year ? parseInt(year) : currentDate.getFullYear(),
    month: month ? parseInt(month) : currentDate.getMonth()
  }

  return (
    <div className='flex flex-col flex-1 h-full'>
      <div className='flex justify-between'>
        <h1 className='font-bold text-3xl'>Home</h1>
        <Suspense fallback={<Skeleton className='w-[180px] h-[140px]' />}>
          <PeriodSelectorWrapper selectedPeriod={period} />
        </Suspense>
      </div>
      <div className='flex flex-col gap-2 py-6 h-full'>
        <Suspense fallback={<StatsCardSkeleton/>}>
          <StatsCards selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className='w-full h-[300px]'/>}>
          <StatusExecutionStatus selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className='w-full h-[300px]'/>}>
          <CreditsUsageInPeriod selectedPeriod={period} />
        </Suspense>
      </div>
    </div>
  )
}

async function PeriodSelectorWrapper ({
  selectedPeriod
}: {
  selectedPeriod: Period
}) {
  const periods = await getPeriods()

  return <PeriodSelector periods={periods} selectedPeriod={selectedPeriod} />
}

async function StatsCards ({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await getStatsCardsValues(selectedPeriod)

  return (
    <div className='gap-3 lg:gap-8 grid lg:grid-cols-3 min-h-[120px]'>
      <StatsCard
        title='Workflow Executions'
        value={data.workflowExecutions}
        icon={CirclePlayIcon}
      />
      <StatsCard
        title='Phase Executions'
        value={data.phaseExecutions}
        icon={WaypointsIcon}
      />
      <StatsCard
        title='Credits Consumed'
        value={data.creditsConsumed}
        icon={CoinsIcon}
      />
    </div>
  )
}

function StatsCardSkeleton(){
  return (
    <div className='gap-3 lg:gap-8 grid lg:grid-cols-3'>
      {
        [1, 2, 3].map((_, index) => (
          <Skeleton key={index} className='w-[180px] h-[140px]' />
        ))
      }
    </div>
  )
}

async function StatusExecutionStatus ({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await getWorkflowExecutionStats(selectedPeriod)

  return (
    <ExecutionStatusChart data={data}/>
  )
}

async function CreditsUsageInPeriod ({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await getCreditsUsageInPeriod(selectedPeriod)

  return (
    <CreditsUsageChart data={data} title='Daily Credits Spent' description='Daily credit consumed in selected period'/>
  )
}

export default page
