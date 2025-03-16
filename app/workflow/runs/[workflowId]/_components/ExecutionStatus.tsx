import { cn } from '@/lib/utils'
import { WorkflowExecutionStatus } from '@/types/workflow'
import React from 'react'

const indicatorColors: Record<WorkflowExecutionStatus, string> = {}


const ExecutionStatus = ({ status }: { status: WorkflowExecutionStatus }) => {
  return (
    <div className={cn('h-2 w-2 rounded-full')}>

    </div>
  )
}

export default ExecutionStatus