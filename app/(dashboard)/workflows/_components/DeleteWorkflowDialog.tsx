"use client";

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
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';

import React, { useState } from 'react'
import { toast } from 'sonner';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  workflowName: string
  workflowId: string
}

const DeleteWorkflowDialog = ({open, setOpen, workflowName, workflowId }: Props) => {

  const [confirmText, setConfirmText] = useState('')

  const { mutate, isPending } = useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: () => {
      toast.success("Workflow deleted successfully", {id: workflowId})
      setConfirmText('')
    },
    onError: () => {
      toast.error("Failed to delete workflow", {id: workflowId});
    }
  })

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            If you delete this workflow, you will not be able to recover it.
            <div className="flex flex-col gap-2 py-4">
              <p>If you are sure, enter <b>{workflowName}</b> to confirm:</p>
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
            disabled={confirmText !== workflowName || isPending}
            className='bg-destructive hover:bg-destructive/90 text-destructive-foreground'
            onClick={(e) => {
              e.stopPropagation();
              toast.loading("Deleting workflow", {id: workflowId })
              mutate(workflowId)
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteWorkflowDialog