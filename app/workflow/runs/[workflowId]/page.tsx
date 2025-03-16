import { Suspense } from 'react'
import TopBar from '../../_components/topbar/TopBar'
import { getWorkflowExecutions } from '@/actions/workflows/getWorkflowExecutions'
import { InboxIcon, Loader2Icon } from 'lucide-react'

import ExecutionsTable from './_components/ExecutionsTable'

export default function ExecutionPage ({
  params
}: {
  params: { workflowId: string }
}) {
  return (
    <div className='w-full h-full overflow-auto'>
      <TopBar
        workflowId={params.workflowId}
        title='All Runs'
        subtitle='List of all your workflow runs'
        hideButtons
      />
      <Suspense
        fallback={
          <div className='justify-center items-center w-full h-full'>
            <Loader2Icon className='stroke-primary animate-spin' />
          </div>
        }
      >
        <ExecutionsTableWrapper workflowId={params.workflowId} />
      </Suspense>
    </div>
  )
}

async function ExecutionsTableWrapper ({ workflowId }: { workflowId: string }) {
  const executions = await getWorkflowExecutions(workflowId)

  if (!executions) {
    return <div>No Data</div>
  }

  if (executions.length == 0) {
    return (
      <div className='py-6 w-full container'>
        <div className='flex flex-col justify-center items-center gap-2 w-full h-full'>
          <div className='flex justify-center items-center bg-accent rounded-full w-20 h-20'>
            <InboxIcon size={40} className='stroke-primary' />
          </div>
          <div className='flex flex-col gap-1 text-center'>
            <p className='font-bold'>
              No runs have been executed yet for this workflow
            </p>
            <p className='text-muted-foreground text-sm'>
              You can execute a new run in the editor page
            </p>
          </div>
        </div>
      </div>
    )
  }

  return <div className="py-6 w-full container">
    <ExecutionsTable executions={executions}/>
  </div>
}
