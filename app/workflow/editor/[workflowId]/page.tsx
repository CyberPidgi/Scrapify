import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import React from 'react'
import { waitFor } from '@/lib/helper/waitFor'
import Editor from '@/app/workflow/_components/Editor'

const page = async ({ params }: { params: { workflowId: string }}) => {
  const workflowId = params.workflowId

  const { userId } = auth();

  if (!userId) {
    return <div>Not authenticated</div>
  }

  // Test Loading
  // await waitFor(5000);

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId
    },
  })

  if (!workflow) {
    return <div>Workflow Not found</div>
  }

  return (
    <Editor workflow={workflow}>

    </Editor>
  )
}

export default page