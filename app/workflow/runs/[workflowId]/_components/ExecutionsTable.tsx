'use client'

import { WorkflowExecution } from '@prisma/client'
import React from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@/components/ui/table'
import { datesToDurationString } from '@/lib/helper/dates'
import { Badge } from '@/components/ui/badge'
import ExecutionStatus from './ExecutionStatus'
import { WorkflowExecutionStatus } from '@/types/workflow'
import { Coins } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'

const ExecutionsTable = ({
  executions
}: {
  executions: WorkflowExecution[]
}) => {

  const router = useRouter();
  return (
    <div className='shadow-md border overflow-auto'>
      <Table className='w-full h-full'>
        <TableHeader className='bg-muted'>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Consumed</TableHead>
            <TableHead className='text-muted-foreground text-xs text-right'>
              Started
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='gap-2 h-full overflow-auto'>
          {executions.map(execution => {
            const formattedStartedAt = execution.startedAt && formatDistanceToNow(execution.startedAt, { addSuffix: true })
            return (
              <TableRow key={execution.id} className='cursor-pointer' onClick={() => {
                router.push(`/workflow/runs/${execution.workflowId}/${execution.id}`)
              }}>
                <TableCell>
                  <div className='flex flex-col'>
                    <span className='font-semibold'>{execution.id}</span>
                    <div className='space-x-2 text-muted-foreground'>
                      <span>Triggered via:</span>
                      <Badge variant={'outline'}>{execution.trigger}</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className='font-semibold capitalize'>
                      {execution.status}
                    </div>
                    <div className='text-muted-foreground text-xs'>
                      {datesToDurationString(
                        execution.completedAt,
                        execution.startedAt
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className='flex items-center gap-2'>
                      <Coins size={16} className='text-primary' />
                      <span className='font-semibold capitalize'>
                        {execution.creditsConsumed}
                      </span>
                    </div>
                    {/* <div className='mx-6 text-muted-foreground text-xs'>Credits</div> */}
                  </div>
                </TableCell>
                <TableCell className='text-muted-foreground text-right'>
                  {formattedStartedAt}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default ExecutionsTable
