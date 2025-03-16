'use client'

import TooltipWrapper from '@/components/TooltipWrapper'
import SaveBtn from './SaveBtn'
import { ChevronLeftIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { useRouter } from 'next/navigation'
import ExecuteBtn from './ExecuteBtn'
import NavigationTabs from './NavigationTabs'
import PublishButton from './PublishButton'
import UnpublishButton from './UnpublishButton'

interface Props {
  title: string
  subtitle?: string
  workflowId: string
  hideButtons?: boolean
  isPublished: boolean
}

const TopBar = ({
  title,
  subtitle,
  workflowId,
  hideButtons = false,
  isPublished = false
}: Props) => {
  const router = useRouter()
  return (
    <header className='top-0 z-10 sticky flex justify-between bg-background p-2 border border-b-2 w-full h-[60px] border-separate'>
      <div className='flex flex-1 items-center gap-1'>
        <TooltipWrapper content='Back'>
          <Button variant={'ghost'} size={'icon'} onClick={() => router.back()}>
            <ChevronLeftIcon className='w-6 h-6' />
          </Button>
        </TooltipWrapper>
        <div className=''>
          <p className='font-bold truncate text-ellipsis'>{title}</p>
          {subtitle && (
            <p className='text-muted-foreground text-xs truncate text-ellipsis'>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <NavigationTabs workflowId={workflowId}/>

      <div className='flex flex-1 justify-end gap-1'>
        {!hideButtons && (
          <>
            <ExecuteBtn workflowId={workflowId} />
            {!isPublished && <>
              <SaveBtn workflowId={workflowId} />
              <PublishButton workflowId={workflowId} />
            </>}
            {
              isPublished &&
              <UnpublishButton workflowId={workflowId} />
            }
          </>
        )}
      </div>
    </header>
  )
}

export default TopBar
