import { getAvailableCredits } from '@/actions/billing/getAvailableCredits'
import { Skeleton } from '@/components/ui/skeleton'
import React, { Suspense } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import ReactCountUpWrapper from '@/components/ReactCountUpWrapper'
import { ArrowLeftRightIcon, CoinsIcon } from 'lucide-react'
import CreditsPurchase from './_components/CreditsPurchase'
import { Period } from '@/types/analytics'
import { getCreditsUsageInPeriod } from '@/actions/analytics/getCreditsUsageInPeriod'
import CreditsUsageChart from './_components/CreditsUsageChart'
import { getUserPurchaseHistory } from '@/actions/billing/getUserPurchaseHistory'
import { formatDate } from 'date-fns'
import InvoiceButton from './_components/InvoiceButton'

const page = () => {
  return (
    <div className='space-y-8 mx-auto p-4'>
      <h1 className='font-bold text-3xl'>Billing</h1>
      <Suspense fallback={<Skeleton className='w-full h-[166px]' />}>
        <BalanceCard />
      </Suspense>
      <CreditsPurchase />
      <Suspense fallback={<Skeleton className='w-full h-[300px]' />}>
        <CreditUsageHistory />
      </Suspense>
      <Suspense fallback={<Skeleton className='w-full h-[300px]' />}>
        <TransactionHistory />
      </Suspense>
    </div>
  )
}

async function BalanceCard () {
  const userBalance = await getAvailableCredits()

  return (
    <Card className='flex flex-col justify-between bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-lg border-primary/20 overflow-hidden'>
      <CardContent className='relative items-center p-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h3 className='font-semibold text-lg'>Available Credits</h3>
            <p className='font-bold text-primary text-4xl'>
              <ReactCountUpWrapper value={userBalance} />
            </p>
          </div>
          <CoinsIcon
            size={140}
            className='-right-5 bottom-5 absolute opacity-20 text-primary'
          />
        </div>
      </CardContent>
      <CardFooter className='text-muted-foreground text-sm'>
        When your credit balance reaches zero, your workflows will stop working.
      </CardFooter>
    </Card>
  )
}

async function CreditUsageHistory () {
  const period: Period = {
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  }

  const data = await getCreditsUsageInPeriod(period)

  return (
    <CreditsUsageChart
      data={data}
      title='Credits Consumed'
      description='Credits consumed in the current month'
    />
  )
}

async function TransactionHistory () {
  const purchases = await getUserPurchaseHistory()

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount / 100)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 font-bold text-2xl'>
          <ArrowLeftRightIcon className='w-6 h-6 text-primary' />
          Transaction History
        </CardTitle>
        <CardDescription>View your transaction history</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {purchases.length === 0 && (
          <p className='text-muted-foreground'>No transactions found.</p>
        )}
        {purchases.map(purchase => (
          <div key={purchase.id} className='flex justify-between items-center py-3 border-b last:border-b-0'>
            <div>
              <p className='font-medium'>{formatDate(purchase.date)}</p>
              <p className="text-muted-foreground texxt-sm">{purchase.description}</p>
            </div>

            <div className="text-right">
              <p className="font-medium">{formatAmount(purchase.amount, purchase.currency)}</p>
              <InvoiceButton id={purchase.id}/>
            </div>
            
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default page
