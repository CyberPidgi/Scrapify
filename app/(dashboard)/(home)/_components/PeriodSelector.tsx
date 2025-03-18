'use client'

import { Period } from '@/types/analytics'
import React from 'react'

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue
} from '@/components/ui/select'
import { useSearchParams, useRouter } from 'next/navigation'

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const PeriodSelector = ({
  periods,
  selectedPeriod
}: {
  periods: Period[]
  selectedPeriod: Period
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  return (
    <Select
      onValueChange={value => {
        const [month, year] = value.split('-')
        const params = new URLSearchParams(searchParams)
        params.set('month', month)
        params.set('year', year)
        router.push(`?${params.toString()}`)
      }}
      value={`${selectedPeriod.month}-${selectedPeriod.year}`}
    >
      <SelectTrigger className='w-[180px]'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {periods.map((period, index) => (
          <SelectItem key={index} value={`${period.month}-${period.year}`}>
            {MONTH_NAMES[period.month]} {period.year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default PeriodSelector
