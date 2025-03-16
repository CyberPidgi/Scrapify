'use client'

import { cn } from '@/lib/utils'
import { TaskInputType } from '@/types/task'
import { Handle, Position } from '@xyflow/react'
import React from 'react'
import { ColorForHandle } from './common'

export function NodeOutputs ({ children }: { children: React.ReactNode }) {
  return <div className='flex flex-col gap-1 divide-y'>{children}</div>
}

export function NodeOutput ({ output, nodeId }: { output: TaskInputType }) {
  return (
    <div className='relative flex justify-end bg-secondary p-3'>
      <p className='text-muted-foreground text-xs'>{output.name}</p>
      <Handle
        id={output.name}
        type='source'
        position={Position.Right}
        className={cn(
          '!bg-muted-foreground !border-2 !border-background !-right-2 !w-4 !h-4',
          ColorForHandle[output.type]
        )}
      />
    </div>
  )
}
