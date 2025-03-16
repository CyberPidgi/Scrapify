import TopBar from '@/app/workflow/_components/topbar/TopBar'
import { auth } from '@clerk/nextjs/server'
import {  Loader2Icon } from 'lucide-react'
import React, { Suspense } from 'react'

import { getWorkflowExecutionWithPhases } from '@/actions/workflows/getWorkflowExecutionWithPhases'
import ExecutionViewer from './_components/ExecutionViewer'

const page = ({
  params
}: {
  params: {
    workflowId: string
    executionId: string
  }
}) => {
  return (
    <div className='flex flex-col w-full h-screen overflow-hidden'>
      <TopBar
        workflowId={params.workflowId}
        title='Workflow Run Details'
        subtitle={`Run ID: ${params.executionId}`}
        hideButtons
      />
      <section className='flex w-full h-full overflow-auto'>
        <Suspense
          fallback={
            <div className='flex justify-center items-center w-full'>
              <Loader2Icon className='stroke-primary w-10 h-10 animate-spin' />
            </div>
          }
        >
          <ExecutionViewerWrapper executionId={params.executionId} />
        </Suspense>
      </section>
    </div>
  )
}

async function ExecutionViewerWrapper ({
  executionId
}: {
  executionId: string
}) {

  const { userId } = auth()
  if (!userId) return <div>Unauthenticated</div>

  const workflowExecution = await getWorkflowExecutionWithPhases(executionId)

  if (!workflowExecution) return <div>Execution not found</div>

  return (
    <ExecutionViewer initialData={workflowExecution}/>
)
}

export default page
