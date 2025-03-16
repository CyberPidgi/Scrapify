"use client"

import { updateWorkflow } from '@/actions/workflows/updateWorkflow'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { useReactFlow } from '@xyflow/react'
import { CheckIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

const SaveBtn = ({ workflowId } : { workflowId: string }) => {
  const { toObject } = useReactFlow();

  const saveMutation = useMutation({
    mutationFn: updateWorkflow,
    onSuccess: () => {
      toast.success('Workflow saved successfully', { id: 'save-workflow' })
    },
    onError: (error) => {
      toast.error('Failed to save workflow', { id: 'save-workflow' })
    }
  })

  return (
    <Button 
      variant={'outline'} 
      className='flex items-center gap-2'
      onClick={() => {
        const workflowDefinition = JSON.stringify(toObject())
        // console.log(workflowDefinition)
        toast.loading('Saving workflow...', { id: 'save-workflow' })
        saveMutation.mutate({ 
          id: workflowId, 
          definition: workflowDefinition 
        })
      }}
      disabled={saveMutation.isPending}
    >
      <CheckIcon className='size-16 stroke-primary' />
      <span className="md:inline hidden">Save</span>
    </Button>
  )
}

export default SaveBtn