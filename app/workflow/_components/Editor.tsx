"use client"

import { Workflow } from '@prisma/client'
import FlowEditor from '@/app/workflow/_components/FlowEditor'
import TopBar from './topbar/TopBar'
import { ReactFlowProvider } from '@xyflow/react'
import React from 'react'
import TaskMenu from './TaskMenu'
import { FlowValidationContextProvider } from '@/components/context/FlowValidationContext'
import { WorkflowStatus } from '@/types/workflow'

const Editor = ({ workflow }: { workflow: Workflow }) => {
  return (
    <FlowValidationContextProvider>
      <ReactFlowProvider>
        <div className="flex flex-col w-full h-full overflow-hidden">
          <TopBar title='Workflow Editor' subtitle={workflow.name} workflowId={workflow.id} isPublished={workflow.status === WorkflowStatus.PUBLISHED}/>
          <section className="flex h-full overflow-auto">
            <TaskMenu/>
            <FlowEditor workflow={workflow} />
          </section>
        </div>
      </ReactFlowProvider>
    </FlowValidationContextProvider>
  )
}

export default Editor