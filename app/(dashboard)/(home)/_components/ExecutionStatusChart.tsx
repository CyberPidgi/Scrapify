'use client'

import { getWorkflowExecutionStats } from '@/actions/analytics/getWorkflowExecutionStats'
import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { Layers2Icon } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

type ChartData = Awaited<ReturnType<typeof getWorkflowExecutionStats>>

const chartConfig = {
  success: {
    label: 'Success',
    color: 'hsl(var(--chart-2))'
  },
  failed: {
    label: 'Failed',
    color: '#FF4D4F'
  }
}

const ExecutionStatusChart = ({ data }: { data: ChartData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 font-bold'>
          <Layers2Icon className='w-6 h-6 text-primary' />
          Workflow Execution Status
        </CardTitle>

        <CardDescription>
          Daily number of successful and failed executions
        </CardDescription>

        <CardContent>
          <ChartContainer className='w-full max-h-[200px]' config={chartConfig}>
            <AreaChart
              data={data}
              height={200}
              accessibilityLayer
              margin={{ top: 20 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={'date'}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={value => {
                  const date = new Date(value)
                  return date.toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric'
                  })
                }}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                dataKey={'success'}
                min={0}
                type={'bump'}
                fill='var(--color-success)'
                fillOpacity={0.6}
                stroke='var(--color-success)'
                stackId={'a'}
              />
              <Area
                dataKey={'failed'}
                min={0}
                type={'bump'}
                fill='var(--color-failed)'
                fillOpacity={0.6}
                stroke='var(--color-failed)'
                stackId={'a'}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </CardHeader>
    </Card>
  )
}

export default ExecutionStatusChart
