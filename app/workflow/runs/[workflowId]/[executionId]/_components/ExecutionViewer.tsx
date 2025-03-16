'use client'

import { getWorkflowExecutionWithPhases } from '@/actions/workflows/getWorkflowExecutionWithPhases'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from '@/types/workflow'
import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import {
  CalendarIcon,
  CircleDashedIcon,
  ClockIcon,
  CoinsIcon,
  Loader2Icon,
  LucideIcon,
  WorkflowIcon
} from 'lucide-react'
import React, { ReactNode, useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader
} from '@/components/ui/table'

import { datesToDurationString } from '@/lib/helper/dates'
import { getPhasesTotalCost } from '@/lib/helper/phases'

import { getWorkflowPhaseDetails } from '@/actions/workflows/getWorkflowPhaseDetails'
import { Input } from '@/components/ui/input'
import { ExecutionLog, ExecutionPhase } from '@prisma/client'
import { cn } from '@/lib/utils'
import { LogLevel } from '@/types/log'
import PhaseStatusBadge from './PhaseStatusBadge'
import ReactCountUpWrapper from '@/components/ReactCountUpWrapper'

type ExecutionData = Awaited<ReturnType<typeof getWorkflowExecutionWithPhases>>

const ExecutionViewer = ({ initialData }: { initialData: ExecutionData }) => {
  const query = useQuery({
    queryKey: ['execution', initialData?.id],
    initialData: initialData,
    queryFn: () => getWorkflowExecutionWithPhases(initialData!.id),
    refetchInterval: q =>
      q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false
  })

  const [selectedPhase, setSelectedPhase] = useState<string | null>(null)
  const phaseDetails = useQuery({
    queryKey: ['phaseDetails', selectedPhase, query.data?.status],
    enabled: !!selectedPhase,
    queryFn: () => getWorkflowPhaseDetails(selectedPhase!)
  })

  const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING

  useEffect(() => {
    const phases = query.data?.phases || []

    if (isRunning){
      const phaseToSelect = phases.toSorted((a, b) => a.startedAt! > b.startedAt! ? -1 : 1)[0];

      setSelectedPhase(phaseToSelect.id);
      return;
    }

    const phaseToSelect = phases.toSorted((a, b) => a.startedAt! > b.startedAt! ? -1 : 1)[0];
    setSelectedPhase(phaseToSelect.id || null)
  }, [query.data?.phases, isRunning])

  const duration = datesToDurationString(
    query.data?.completedAt,
    query.data?.startedAt
  )

  const creditsConsumed = getPhasesTotalCost(query.data?.phases || [])

  return (
    <div className='flex w-full h-full'>
      <aside className='flex flex-col border-r-2 min-w-[440px] max-w-[440px] overflow-y-auto border-separate'>
        <div className='px-2 py-4'>
          {/* Status */}
          <ExecutionLabel
            icon={CircleDashedIcon}
            label='Status'
            value={query.data?.status}
          />
          {/* Started At */}
          <ExecutionLabel
            icon={CalendarIcon}
            label='StartedAt'
            value={
              <span>
                {query.data?.startedAt
                  ? formatDistanceToNow(new Date(query.data.startedAt), {
                      addSuffix: true
                    })
                  : 'Not Started Yet'}
              </span>
            }
          />
          <ExecutionLabel
            icon={ClockIcon}
            label='Duration'
            value={
              duration ? duration : <Loader2Icon className='animate-spin' />
            }
          />
          <ExecutionLabel
            icon={CoinsIcon}
            label='Credits Consumed'
            value={<ReactCountUpWrapper value={creditsConsumed}/>}
          />
          <Separator />

          <div className='flex justify-center items-center px-4 py-2'>
            <div className='flex items-center gap-2 text-muted-foreground'>
              <WorkflowIcon size={20} className='stroke-muted-foreground/80' />
              <span className='font-semibold'>Phases</span>
            </div>
          </div>
          <Separator />
          <div className='px-2 py-4 h-full overflow-auto'>
            {query.data?.phases.map((phase, index) => (
              <Button
                key={phase.id}
                className='justify-between mt-2 w-full'
                variant={selectedPhase === phase.id ? 'secondary' : 'ghost'}
                onClick={() => {
                  if (isRunning) return
                  setSelectedPhase(phase.id)
                }}
              >
                <div className='flex items-center gap-2'>
                  <Badge variant={'outline'}>{index + 1}</Badge>
                  <p className='font-semibold'>{phase.name}</p>
                </div>
                <PhaseStatusBadge status={phase.status as ExecutionPhaseStatus} />
              </Button>
            ))}
          </div>
        </div>
      </aside>
      <div className='flex w-full h-full'>
        {isRunning && (
          <div className='flex flex-col justify-center items-center gap-2 w-full h-full'>
            <p className='font-bold'>Run is in progress, please wait.</p>
          </div>
        )}
        {!isRunning && !selectedPhase && (
          <div className='flex flex-col justify-center items-center gap-2 w-full h-full'>
            <div className='flex flex-col gap-1 text-center'>
              <p className='font-bold'>No Phase Selected</p>
              <p className='text-muted-foreground text-sm'>
                Select a phase to view details
              </p>
            </div>
          </div>
        )}

        {!isRunning && selectedPhase && phaseDetails.data && (
          <div className='flex flex-col gap-4 py-4 overflow-auto container'>
            <div className='flex items-center gap-2'>
              <Badge variant='outline' className='space-x-4'>
                <div className='flex items-center gap-1'>
                  <CoinsIcon size={18} className='stroke-muted-foreground' />
                  <span>Credits</span>
                </div>
                <span>{phaseDetails.data.creditsConsumed}</span>
              </Badge>

              <Badge variant='outline' className='space-x-4'>
                <div className='flex items-center gap-1'>
                  <ClockIcon size={18} className='stroke-muted-foreground' />
                  <span>Duration</span>
                </div>
                <span>
                  {datesToDurationString(
                    phaseDetails.data.completedAt,
                    phaseDetails.data.startedAt
                  ) || '-'}
                </span>
              </Badge>
            </div>
            <ParameterViewer
              title='Inputs'
              subtitle='Inputs used for this phase'
              paramsJSON={phaseDetails.data.inputs}
            />
            <ParameterViewer
              title='Outputs'
              subtitle='Outputs generated by this phase'
              paramsJSON={phaseDetails.data.outputs}
            />
            <LogViewer logs={phaseDetails.data.logs} />
          </div>
        )}
      </div>
    </div>
  )
}

function ExecutionLabel ({
  icon,
  label,
  value
}: {
  icon: LucideIcon
  label: ReactNode
  value: ReactNode
}) {
  const Icon = icon
  return (
    <div className='flex justify-between items-center px-4 py-2 text-sm'>
      <div className='flex items-center gap-2 text-muted-foreground'>
        <Icon size={20} className='stroke-muted-foreground/80' />
        <span>{label}</span>
      </div>

      <div className='flex items-center gap-2 font-semibold capitalize'>
        {value}
      </div>
    </div>
  )
}

function ParameterViewer ({
  title,
  subtitle,
  paramsJSON
}: {
  title: string
  subtitle: string
  paramsJSON: string | null
}) {
  const params = paramsJSON ? JSON.parse(paramsJSON) : undefined
  return (
    <Card>
      <CardHeader className='bg-gray-50 dark:bg-background py-4 border-b rounded-lg rounded-b-none'>
        <CardTitle className='text-base'>{title}</CardTitle>
        <CardDescription className='text-muted-foreground text-sm'>
          {subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent className='py-4'>
        <div className='flex flex-col gap-2'>
          {(!params || Object.keys(params).length === 0) && (
            <p className='text-sm'>No parameters generated by this phase</p>
          )}

          {params &&
            Object.entries(params).map(([key, value]) => (
              <div key={key} className='flex justify-between items-center'>
                <p className='flex-1 text-muted-foreground text-sm basis-1/3'>
                  {key}
                </p>
                <Input
                  readOnly
                  className='flex-1 basis-2/3'
                  value={value as string}
                />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}

function LogViewer ({ logs }: { logs: ExecutionLog[] | undefined }) {
  if (!logs || logs.length === 0) return null

  return (
    <Card className='w-full'>
      <CardHeader className='bg-gray-50 dark:bg-background py-4 border-b rounded-lg rounded-b-none'>
        <CardTitle className='text-base'>Logs</CardTitle>
        <CardDescription className='text-muted-foreground text-sm'>
          Logs generated by this phase
        </CardDescription>
      </CardHeader>
      <CardContent className='p-0'>
        <Table>
          <TableHeader className='text-muted-foreground text-sm'>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map(log => (
              <TableRow key={log.id} className='text-muted-foreground'>
                <TableCell
                  width={190}
                  className='p-2 pl-4 text-muted-foreground text-xs'
                >
                  {log.timestamp.toISOString()}
                </TableCell>
                <TableCell
                  width={80}
                  className={cn(
                    'uppercase text-xs font-bold p-[3px] pl-4',
                    (log.logLevel as LogLevel) === 'error' &&
                      'text-destructive',
                    (log.logLevel as LogLevel) === 'info' && 'text-primary',

                  )}
                >
                  {log.logLevel}
                </TableCell>
                <TableCell className='flex-1 p-[3px] pl-4 text-sm'>{log.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default ExecutionViewer
