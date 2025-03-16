"use client"

import React, { useCallback } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog' 
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { CopyIcon, Layers2Icon, Loader2, Loader2Icon } from 'lucide-react'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { duplicateWorkflowSchema, duplicateWorkflowSchemaType } from '@/schema/workflow'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'

import CustomDialogHeader from '@/components/CustomDialogHeader'
import { Textarea } from '@/components/ui/textarea'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { duplicateWorkflow } from '@/actions/workflows/duplicateWorkflow'
import { cn } from '@/lib/utils'

const DuplicateWorkflowDialog = ({ triggerText, workflowId }: { triggerText?: string, workflowId: string }) => {

  const [open, setOpen] = useState(false)

  const form = useForm<duplicateWorkflowSchemaType>({
    resolver: zodResolver(duplicateWorkflowSchema),
    defaultValues: {
      workflowId
    }
  })

  const { mutate, isPending } = useMutation(
    {
      mutationFn: duplicateWorkflow,
      onSuccess: () => {
        toast.success('Workflow duplicated successfully', { id: 'duplicate-workflow'})
        setOpen(false)
      },
      onError: () => {
        toast.error('Failed to duplicate workflow', { id: 'duplicate-workflow'})
        setOpen(false)
      }
    }
  )

  const onSubmit = useCallback((
    values: duplicateWorkflowSchemaType
  ) => {
    toast.loading('Duplicating workflow...', { id: 'duplicate-workflow'})
    mutate(values);
  }, [mutate])

  return (
    <Dialog open={open} onOpenChange={(open) => {
      form.reset()
      setOpen(open)
    }}>
      <DialogTrigger asChild>
        <Button variant={'ghost'} size={'icon'} className={cn('ml-2 transition-opacity duration-200 opacity-0 group-hover/card:opacity-100')}>
          <CopyIcon className='w-4 h-4 text-muted-foreground cursor-pointer'/>
        </Button>
      </DialogTrigger>
      <DialogContent className='px-0'>
        <CustomDialogHeader
          icon={Layers2Icon}
          title="Duplicate workflow"
        />
        <div className="p-6">
          <Form
            {...form}
          >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
              <FormField
                name='name'
                control={form.control}
                render={
                  ({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-1'>
                        Name
                        <p className="text-primary text-xs">(required)</p>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Choose a descriptive and a unique name
                      </FormDescription>
                      <FormMessage/>
                    </FormItem>
                  )
                }
              />
              <FormField
                name='description'
                control={form.control}
                render={
                  ({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-1'>
                        Description
                        <p className="text-muted-foreground text-xs">(optional)</p>
                      </FormLabel>
                      <FormControl>
                        <Textarea className='resize-none' {...field} />
                      </FormControl>
                      <FormDescription>
                        Provide a brief description about your workflow
                      </FormDescription>
                      <FormMessage/>
                    </FormItem>
                  )
                }
              />

              <Button type='submit' className='w-full' disabled={isPending}>
                {isPending ? <>
                  <Loader2 className='animate-spin'/>
                </> : 'Proceed'}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DuplicateWorkflowDialog