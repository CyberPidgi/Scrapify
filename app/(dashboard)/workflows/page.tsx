import { getWorkflowsForUser } from '@/actions/workflows/getWorkflowsForUsers'
import { Skeleton } from '@/components/ui/skeleton'
import { waitFor } from '@/lib/helper/waitFor'
import React, { Suspense } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, InboxIcon } from 'lucide-react'
import CreateWorkflowDialog from './_components/CreateWorkflowDialog'

import WorkflowCard from './_components/WorkflowCard'

const page = () => {
  return (
    <div className='flex flex-col flex-1 h-full'>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="font-bold text-3xl">
            Workflows
          </h1>
          <p className="text-muted-foreground">
            Manage your workflows
          </p>
        </div>
        <CreateWorkflowDialog triggerText='Create Workflow'/>
      </div>

      <div className="py-6 h-full">
        <Suspense fallback={<UserWorkflowsSkeleton />}>
          <UserWorkflows />
          
        </Suspense>
      </div>
    </div>
  )
}

function UserWorkflowsSkeleton() {
  return (
    <div className="space-y-2">
      {
        [1, 2, 3, 4].map((i) => (
          <Skeleton className='w-full h-32' key={i}/>
        ))
      }
    </div>
  )
}

async function UserWorkflows() {

  try {
    const workflows = await getWorkflowsForUser();

    if (workflows.length === 0){
      return <div className="flex flex-col items-center gap-4 h-full">
        <div className="flex justify-center items-center bg-accent rounded-full size-20">
          <InboxIcon size={40} className='stroke-primary'/>
        </div>
        <div className="flex flex-col gap-1 text-center">
          <p className="font-bold">
            No workflow created yet
          </p>
          <p className="text-muted-foreground text-sm">
            Click the button below to get started
          </p>
        </div>

        <CreateWorkflowDialog triggerText='Create your first workflow'/>
      </div>
    }

    return (
      <div className="gap-4 grid grid-cols-1">
        {
          workflows.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow}/>
          ))
        }
      </div>
    )
  } catch (error) {
    return (
      <Alert variant={'destructive'}>
        <AlertCircle className='size-4'/>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong. Please try again later.
        </AlertDescription>
      </Alert>
    )
    
  }
  
  return <div></div>
}

export default page