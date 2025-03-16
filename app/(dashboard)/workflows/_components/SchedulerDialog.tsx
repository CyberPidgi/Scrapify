'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { CalendarIcon, ClockIcon, TriangleAlertIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import CustomDialogHeader from '@/components/CustomDialogHeader'
import { Input } from '@/components/ui/input'
import { useMutation } from '@tanstack/react-query'
import { updateWorkflowCron } from '@/actions/workflows/updateWorkflowCron'
import { toast } from 'sonner'

import cronstue from 'cronstrue'
import { removeWorkflowSchedule } from '@/actions/workflows/removeWorkflowSchedule'
import { Separator } from '@radix-ui/react-separator'

const SchedulerDialog = (props: {
  workflowId: string
  cron: string | null
}) => {
  const [cron, setCron] = useState(props.cron ?? '')
  const [validCron, setValidCron] = useState(true)
  const [humanCronString, setHumanCronString] = useState('')

  const mutation = useMutation({
    mutationFn: updateWorkflowCron,
    onSuccess: () => {
      toast.success('Schedule updated successfully', { id: 'cron' })
    },
    onError: error => {
      toast.error(error.message, { id: 'cron' })
    }
  })

  const removeMutation = useMutation({
    mutationFn: removeWorkflowSchedule,
    onSuccess: () => {
      toast.success('Schedule updated successfully', { id: 'cron' })
    },
    onError: error => {
      toast.error(error.message, { id: 'cron' })
    }
  })

  useEffect(() => {
    try {
      const humanCronString = cronstue.toString(cron)
      setValidCron(true)
      setHumanCronString(humanCronString)
    } catch (error) {
      setValidCron(false)
      setHumanCronString('')
    }
  }, [cron])

  const workflowHasValidCron = props.cron && props.cron.length > 0
  const readableSavedCron =
    workflowHasValidCron && cronstue.toString(props.cron!)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={'link'}
          size={'sm'}
          className={cn(
            'text-sm p-0 h-auto text-orange-500',
            workflowHasValidCron && 'text-primary'
          )}
        >
          {workflowHasValidCron && (
            <div className='flex items-center gap-2'>
              <ClockIcon />
              {readableSavedCron}
            </div>
          )}
          {!workflowHasValidCron && (
            <div className='flex items-center gap-1'>
              <TriangleAlertIcon className='w-3 h-3' />
              Set Schedule
            </div>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className='px-0'>
        <CustomDialogHeader
          title='Schedule Workflow Execution'
          icon={CalendarIcon}
        />
        <div className='space-y-4 p-6'>
          <p className='text-muted-foreground text-sm'>
            Specify a cron expression to schedule a periodic workflow execution
          </p>
          <Input
            value={cron}
            onChange={e => setCron(e.target.value)}
            placeholder='E.g: * * * * *'
          />
          <div
            className={cn(
              'bg-accent rounded-md p-4 border text-sm',
              validCron
                ? 'border-primary text-primary'
                : 'text-destructive border-destructive'
            )}
          >
            {validCron ? humanCronString : 'Invalid cron expression'}
          </div>

          {workflowHasValidCron && (
            <DialogClose asChild>
              <div className="|">
                {/* the button text takes black colour when hovered over */}
                <Button className='border-destructive w-full text-destructive hover:text-destructive' variant={'outline'} disabled={removeMutation.isPending} onClick={() => {
                  toast.loading('Removing schedule...', { id: 'cron' })
                  removeMutation.mutate(props.workflowId)
                }}
                >
                  Remove Current Schedule
                </Button>
                <Separator className='my-4'/>
              </div>
            </DialogClose>
          )}
        </div>
        <DialogFooter className='gap-2 px-6'>
          <DialogClose asChild>
            <Button className='border w-full' variant={'secondary'}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className='border w-full'
              onClick={() => {
                toast.loading('Updating schedule...', { id: 'cron' })
                mutation.mutate({ cron, id: props.workflowId })
              }}
              disabled={mutation.isPending || !validCron}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SchedulerDialog
