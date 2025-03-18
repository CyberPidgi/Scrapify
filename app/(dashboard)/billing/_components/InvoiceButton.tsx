'use client'

import { downloadInvoice } from '@/actions/billing/downloadInvoice'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

const InvoiceButton = ({ id }: { id: string }) => {
  const mutation = useMutation({
    mutationFn: downloadInvoice,
    onSuccess: (url) => {
      window.location.href = url as string
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
  return (
    <Button
      variant={'ghost'}
      size={'sm'}
      className='gap-2 hover:bg-transparent px-1 text-muted-foreground text-xs hover:underline'
      disabled={mutation.isPending}
      onClick={() => mutation.mutate(id)}
    >
      Download Invoice
      {mutation.isPending && <Loader2Icon className='w-4 h-4 animate-spin' />}
    </Button>
  )
}

export default InvoiceButton
