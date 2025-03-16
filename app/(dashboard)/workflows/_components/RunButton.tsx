'use client'

import { runWorkflow } from '@/actions/workflows/runWorkflow'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { PlayIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

const RunButton = ({ workflowId }: { workflowId: string }) => {
  const mutation = useMutation({
    mutationFn: runWorkflow,
    onSuccess: () => {
      toast.success('Workflow started', { id: workflowId })
    },
    onError: error => {
      toast.error(error.message, { id: workflowId })
    }
  })
  return (
    <Button
      variant={'outline'}
      size={'sm'}
      onClick={() => {
        toast.loading('Starting workflow', { id: workflowId })
        mutation.mutate({
          workflowId
        })
      }}
      disabled={mutation.isPending}
      className='flex items-center gap-2'
    >
      <PlayIcon size={16} />
      Run
    </Button>
  )
}

export default RunButton
