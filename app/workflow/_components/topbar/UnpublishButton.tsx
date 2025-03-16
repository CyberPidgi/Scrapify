'use client'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { Undo2Icon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'
import { unpublishWorkflow } from '@/actions/workflows/unpublishWorkflow'

const UnpublishButton = ({ workflowId }: { workflowId: string }) => {

  const mutation = useMutation({
    mutationFn: unpublishWorkflow,
    onSuccess: () => {
      toast.success('Workflow Unpublished', { id: workflowId})
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
        toast.loading("Unpublishing Workflow", { id: workflowId })
        
        mutation.mutate(workflowId)
      }}
    >
      <Undo2Icon size={16} className='stroke-red-400' />
      <span className='hidden md:inline'>Unpublish</span>
    </Button>
  )
}

export default UnpublishButton
