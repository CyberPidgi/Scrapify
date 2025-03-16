'use client'

import { runWorkflow } from '@/actions/workflows/runWorkflow'
import useExecutionPlan from '@/components/hooks/useExecutionPlan'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { PlayIcon } from 'lucide-react'
import React from 'react'
import { useReactFlow } from '@xyflow/react'
import { toast } from 'sonner'

const ExecuteBtn = ({ workflowId }: { workflowId: string }) => {
  const generate = useExecutionPlan()
  const { toObject } = useReactFlow()

  const mutation = useMutation({
    mutationFn: runWorkflow,
    onSuccess: () => {
      toast.success('Execution Started', { id: "flow-execution"})
    },
    onError: (error) => {
      toast.error(error.message, { id: "flow-execution" })
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

        mutation.mutate({
          workflowId,
          flowDefinition: JSON.stringify(toObject())
        })
      }}
    >
      <PlayIcon size={16} className='stroke-orange-400' />
      <span className='md:inline hidden'>Execute</span>
    </Button>
  )
}

export default ExecuteBtn
