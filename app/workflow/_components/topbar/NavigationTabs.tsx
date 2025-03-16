'use client'

import React from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NavigationTabs = ({ workflowId }: { workflowId: string }) => {
  const pathname = usePathname()
  const activeValue = pathname?.split('/')[2]

  return (
    <Tabs value={activeValue} className='w-[400px]'>
      <TabsList className='grid grid-cols-2 w-full'>
        <Link href={`/workflow/editor/${workflowId}`}>
          <TabsTrigger value='editor' className='w-full'>Editor</TabsTrigger>
        </Link>
        <Link href={`/workflow/runs/${workflowId}`}>
          <TabsTrigger value='runs' className='w-full duration-500'>Runs</TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  )
}

export default NavigationTabs
