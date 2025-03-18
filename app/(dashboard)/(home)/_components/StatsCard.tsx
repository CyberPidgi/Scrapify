import { LucideIcon } from 'lucide-react'
import React from 'react'

import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
} from '@/components/ui/card'
import ReactCountUpWrapper from '@/components/ReactCountUpWrapper'

interface Props {
  title: string
  value: number
  icon: LucideIcon
}

const StatsCard = (props: Props) => {
  return (
    <Card className='relative h-full overflow-hidden'>
      <CardHeader className='flex pb-2'>
        <CardTitle>{props.title}</CardTitle>
        <props.icon size={120} className='-right-8 -bottom-4 absolute opacity-10 stroke-primary text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='font-bold text-primary text-2xl'>
          <ReactCountUpWrapper value={props.value}/>
        </div>
      </CardContent>
    </Card>
  )
}

export default StatsCard