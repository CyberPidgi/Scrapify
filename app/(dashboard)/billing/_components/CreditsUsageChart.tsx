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
import { ChartColumnStackedIcon, Layers2Icon } from 'lucide-react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { getCreditsUsageInPeriod } from '@/actions/analytics/getCreditsUsageInPeriod'

type ChartData = Awaited<ReturnType<typeof getCreditsUsageInPeriod>>

const chartConfig = {
  success: {
    label: 'Successful Phase Credits',
    color: 'hsl(var(--chart-2))'
  },
  failed: {
    label: 'Failed Phase Credits',
    color: '#FF4D4F'
  }
}

const CreditsUsageChart = ({ data, title, description }: { data: ChartData, title: string, description: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 font-bold'>
          <ChartColumnStackedIcon className='w-6 h-6 text-primary' />
          {title}
        </CardTitle>

        <CardDescription>
          {description}
        </CardDescription>

        <CardContent>
          <ChartContainer className='w-full max-h-[200px]' config={chartConfig}>
            <BarChart
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
              <ChartTooltip content={<ChartTooltipContent className='w-[225px]' />} />
              <Bar
                dataKey={'success'}
                fill='var(--color-success)'
                fillOpacity={0.8}
                radius={[2, 2, 0, 0]}
                stroke='var(--color-success)'
              />
              <Bar
                dataKey={'failed'}
                radius={[2, 2, 0, 0]}
                fill='var(--color-failed)'
                fillOpacity={0.8}
                stroke='var(--color-failed)'
                stackId={'a'}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </CardHeader>
    </Card>
  )
}

export default CreditsUsageChart
