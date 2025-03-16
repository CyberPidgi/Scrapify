'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { WorkflowStatus } from '@/types/workflow'
import { Workflow } from '@prisma/client'
import {
  ChevronRightIcon,
  ClockIcon,
  CoinsIcon,
  CornerDownRightIcon,
  FileTextIcon,
  MoreVerticalIcon,
  MoveRight,
  MoveRightIcon,
  Pen,
  PlayIcon,
  TrashIcon
} from 'lucide-react'
import React, { useState } from 'react'

import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

import TooltipWrapper from '@/components/TooltipWrapper'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import DeleteWorkflowDialog from './DeleteWorkflowDialog'
import RunButton from './RunButton'
import SchedulerDialog from './SchedulerDialog'
import { Badge } from '@/components/ui/badge'
import ExecutionStatus from '@/app/workflow/runs/[workflowId]/_components/ExecutionStatus'
import { format, formatDistanceToNow } from 'date-fns'
import DuplicateWorkflowDialog from './DuplicateWorkflowDialog'

const statusColors = {
  [WorkflowStatus.DRAFT]: 'bg-yellow-400 text-yellow-600',
  [WorkflowStatus.PUBLISHED]: 'bg-primary'
}

const WorkflowCard = ({ workflow }: { workflow: Workflow }) => {
  const isDraft = workflow.status === WorkflowStatus.DRAFT

  return (
    <Card className='group/card shadow-sm hover:shadow-md dark:shadow-primary/90 border rounded-lg overflow-hidden border-separate'>
      <CardContent className='flex justify-between items-center p-4 h-[100px]'>
        <div className='flex justify-end items-center space-x-3'>
          <div
            className={cn(
              'flex justify-center items-center rounded-full size-10',
              statusColors[workflow.status as WorkflowStatus]
            )}
          >
            {isDraft ? (
              <FileTextIcon className='size-5' />
            ) : (
              <PlayIcon className='size-5 text-white' />
            )}
          </div>
          <div>
            <h3 className='flex items-center font-bold text-muted-foreground text-base'>
              <TooltipWrapper content={workflow.description}>
                <Link
                  href={`/workflow/editor/${workflow.id}`}
                  className='hover:underline'
                >
                  {workflow.name}
                </Link>
              </TooltipWrapper>
              {isDraft && (
                <span className='bg-yellow-100 ml-2 px-2 py-0.5 rounded-full font-medium text-yellow-800 text-xs'>
                  Draft
                </span>
              )}

              <DuplicateWorkflowDialog workflowId={workflow.id}/>
            </h3>
            <ScheduleSection
              isDraft={isDraft}
              creditsCost={workflow.creditsCost}
              workflowId={workflow.id}
              cron={workflow.cron}
            />
          </div>
        </div>

        <div className='flex items-center space-x-2'>
          {!isDraft && <RunButton workflowId={workflow.id} />}
          <Link
            href={`/workflow/editor/${workflow.id}`}
            className={cn(
              buttonVariants({
                variant: 'outline',
                size: 'sm'
              }),
              'flex items-center gap-2'
            )}
          >
            <Pen size={16} />
            Edit
          </Link>
          <WorkflowActions
            workflowName={workflow.name}
            workflowId={workflow.id}
          />
        </div>
      </CardContent>
      <LastRunDetails workflow={workflow} />
    </Card>
  )
}

function WorkflowActions ({
  workflowName,
  workflowId
}: {
  workflowName: string
  workflowId: string
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  return (
    <>
      <DeleteWorkflowDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        workflowName={workflowName}
        workflowId={workflowId}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='sm'>
            <TooltipWrapper content='More Options'>
              <div className='flex justify-center items-center w-full h-full'>
                <MoreVerticalIcon size={18} />
              </div>
            </TooltipWrapper>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className='flex items-center gap-2 text-destructive'
            onSelect={() => setShowDeleteDialog(prev => !prev)}
          >
            <TrashIcon size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
        <DropdownMenuSeparator />
      </DropdownMenu>
    </>
  )
}

function ScheduleSection ({
  isDraft,
  creditsCost,
  workflowId,
  cron
}: {
  isDraft: boolean
  creditsCost: number
  workflowId: string
  cron: string | null
}) {
  if (isDraft) return null

  return (
    <div className='flex items-center gap-2'>
      <CornerDownRightIcon className='w-4 h-4 text-muted-foreground' />
      {/* this is used to update the scheduler dialog when the cron changes (when we remove the cron string) */}
      <SchedulerDialog
        workflowId={workflowId}
        cron={cron}
        key={`${cron}-${workflowId}`}
      />
      <MoveRightIcon className='w-4 h-4 text-muted-foreground' />
      <TooltipWrapper content='Credit consumption for full run'>
        <div className='flex items-center gap-3'>
          <Badge
            variant={'outline'}
            className='space-x-2 text-muted-foreground rouned-sm'
          >
            <CoinsIcon className='w-4 h-4' />
            <span className='text-sm'>{creditsCost}</span>
          </Badge>
        </div>
      </TooltipWrapper>
    </div>
  )
}

function LastRunDetails ({ workflow }: { workflow: Workflow }) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT
  if (isDraft) return null
  const { lastRunAt, lastRunStatus, lastRunId, nextRunAt } = workflow
  const formattedStartedAt =
    lastRunAt &&
    formatDistanceToNow(lastRunAt, {
      addSuffix: true
    })

  const nextSchedule = nextRunAt && format(nextRunAt, 'yyyy-MM-dd HH:mm')
  return (
    <div className='flex justify-between items-center bg-primary/10 px-4 py-1 text-muted-foreground'>
      <div className='flex items-center gap-2 text-sm'>
        {lastRunAt && (
          <Link className='group flex items-center gap-2 text-sm' href={`/workflow/runs/${workflow.id}/${lastRunId}`}>
            <span>Last Run: </span>
            <span className='font-semibold'>{lastRunStatus}</span>
            <span>{formattedStartedAt}</span>
            <ChevronRightIcon className='transition group-hover:translate-x-2' size={14} />
          </Link>
        )}

        {!lastRunAt && (
          <span className='text-sm'>No runs yet</span>
        )}
      </div>
      {nextRunAt && (
        <div className="flex items-center gap-2 text-sm">
          <ClockIcon size={16}/>
          <span>Next run at: </span>
          <span>{nextSchedule}</span>
        </div>
      )}
    </div>
  )
}

export default WorkflowCard
