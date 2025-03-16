"use client"

import React, { useCallback } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog' 
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Layers2Icon, Loader2, Loader2Icon } from 'lucide-react'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createCredentialSchema, createCredentialSchemaType } from '@/schema/credential'
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
import { createCredential } from '@/actions/credentials/createCredential'
import { toast } from 'sonner'

const CreateCredentialDialog = ({ triggerText }: { triggerText?: string }) => {

  const [open, setOpen] = useState(false)

  const form = useForm<createCredentialSchemaType>({
    resolver: zodResolver(createCredentialSchema),
    defaultValues: {}
  })

  const { mutate, isPending } = useMutation(
    {
      mutationFn: createCredential,
      onSuccess: () => {
        setOpen(false)
        form.reset()
        toast.success('Credential created successfully', { id: 'create-credential'})
      },
      onError: () => {
        toast.error('Failed to create credential', { id: 'create-credential'})
      }
    }
  )

  const onSubmit = useCallback((
    values: createCredentialSchemaType
  ) => {
    toast.loading('Creating credential...', { id: 'create-credential'})
    mutate(values);
  }, [mutate])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          { triggerText ?? "Create Credential"}
        </Button>
      </DialogTrigger>
      <DialogContent className='px-0'>
        <CustomDialogHeader
          icon={Layers2Icon}
          title="Create credential"
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
                        Enter a unique name for your credential
                      </FormDescription>
                      <FormMessage/>
                    </FormItem>
                  )
                }
              />
              <FormField
                name='value'
                control={form.control}
                render={
                  ({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-1'>
                        Value
                        <p className="text-primary text-xs">(required)</p>
                      </FormLabel>
                      <FormControl>
                        <Textarea className='resize-none' {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the value for your credential
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

export default CreateCredentialDialog