"use client";

import { deleteCredential } from '@/actions/credentials/deleteCredential';
import { deleteWorkflow } from '@/actions/workflows/deleteWorkflow';
import { Alert } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { Trash2Icon } from 'lucide-react';

import React, { useState } from 'react'
import { toast } from 'sonner';

interface Props {
  name: string;
}

const DeleteCredentialDialog = ({ name }: Props) => {

  const [open, setOpen] = useState(false)

  const [confirmText, setConfirmText] = useState('')

  const { mutate, isPending } = useMutation({
    mutationFn: deleteCredential,
    onSuccess: () => {
      toast.success("Credential deleted successfully", {id: name})
      setConfirmText('')
    },
    onError: () => {
      toast.error("Failed to delete credential", {id: name});
    }
  })

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={'destructive'} size={'icon'}>
          <Trash2Icon className='' size={18}/>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            If you delete this workflow, you will not be able to recover it.
            <div className="flex flex-col gap-2 py-4">
              <p>If you are sure, enter <b>{name}</b> to confirm:</p>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}/>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setConfirmText('')
            }}
          >Cancel</AlertDialogCancel>
          <AlertDialogAction 
            disabled={confirmText !== name || isPending}
            className='bg-destructive hover:bg-destructive/90 text-destructive-foreground'
            onClick={(e) => {
              e.stopPropagation();
              toast.loading("Deleting credential", {id: name })
              mutate(name)
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteCredentialDialog