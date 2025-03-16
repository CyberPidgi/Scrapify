'use client'

import { publishWorkflow } from '@/actions/workflows/publishWorkflow'
import useExecutionPlan from '@/components/hooks/useExecutionPlan'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import {  UploadIcon } from 'lucide-react'
import React from 'react'
import { useReactFlow } from '@xyflow/react'
import { toast } from 'sonner'

const PublishButton = ({ workflowId }: { workflowId: string }) => {
  const generate = useExecutionPlan()
  const { toObject } = useReactFlow()

  const mutation = useMutation({
    mutationFn: publishWorkflow,
    onSuccess: () => {
      toast.success('Workflow Published', { id: workflowId})
    },
    onError: (error) => {
      toast.error(error.message, { id: workflowId })
    }
  });


  return (
    <Button
      variant={'outline'}
      className='flex items-center gap-2'
      disabled={mutation.isPending}
      onClick={() => {
        const plan = generate()
        if (!plan) {
          toast.error('Invalid Flow Definition', { id: "flow-execution" })
          return
        }

        toast.loading("Publishing Workflow", { id: workflowId })
        
        mutation.mutate({
          workflowId,
          flowDefinition: JSON.stringify(toObject())
        })
      }}
    >
      <UploadIcon size={16} className='stroke-blue-400' />
      <span className='hidden md:inline'>Publish</span>
    </Button>
  )
}

export default PublishButton
