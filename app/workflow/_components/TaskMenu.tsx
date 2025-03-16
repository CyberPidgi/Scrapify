"use client"

import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { TaskType } from '@/types/task'
import { TaskRegistry } from '@/lib/workflow/task/registry'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CoinsIcon } from 'lucide-react'

const TaskMenu = () => {
  return (
    <aside className='p-2 px-4 border-r-2 w-96 h-full overflow-auto border-separate'>
      <Accordion 
        type='multiple' 
        className='w-full'
        defaultValue={['extraction', 'interactions', 'timing', 'results', 'storage']}
      >
        <AccordionItem value='extraction'>
          <AccordionTrigger className='p-2 font-bold !no-underline cursor-pointer'>
            Data Extraction
          </AccordionTrigger>
          <AccordionContent className='flex flex-col gap-1'>
            <TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
            <TaskMenuBtn taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT} />
            <TaskMenuBtn taskType={TaskType.EXTRACT_DATA_WITH_AI} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value='interactions'>
          <AccordionTrigger className='p-2 font-bold !no-underline cursor-pointer'>
            User Interactions
          </AccordionTrigger>
          <AccordionContent className='flex flex-col gap-1'>
            <TaskMenuBtn taskType={TaskType.FILL_INPUT} />
            <TaskMenuBtn taskType={TaskType.CLICK_ELEMENT} />
            <TaskMenuBtn taskType={TaskType.NAVIGATE_TO_URL} />
            <TaskMenuBtn taskType={TaskType.SCROLL_TO_ELEMENT} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value='storage'>
          <AccordionTrigger className='p-2 font-bold !no-underline cursor-pointer'>
            Storage
          </AccordionTrigger>
          <AccordionContent className='flex flex-col gap-1'>
            <TaskMenuBtn taskType={TaskType.READ_PROPERTY_FROM_JSON} />
            <TaskMenuBtn taskType={TaskType.ADD_PROPERTY_TO_JSON} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value='timing'>
          <AccordionTrigger className='p-2 font-bold !no-underline cursor-pointer'>
            Timing Controls
          </AccordionTrigger>
          <AccordionContent className='flex flex-col gap-1'>
            <TaskMenuBtn taskType={TaskType.WAIT_FOR_ELEMENT} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value='results'>
          <AccordionTrigger className='p-2 font-bold !no-underline cursor-pointer'>
            Result Delivery
          </AccordionTrigger>
          <AccordionContent className='flex flex-col gap-1'>
            <TaskMenuBtn taskType={TaskType.DELIVER_VIA_WEBHOOK} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  )
}

function TaskMenuBtn({ taskType }: { taskType: TaskType }) {
  const task = TaskRegistry[taskType]

  const onDragStart = (event: React.DragEvent<HTMLButtonElement>, taskType: TaskType) => {
    event.dataTransfer.setData('application/reactflow', taskType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <Button 
      variant={'secondary'} 
      className='flex justify-between items-center gap-2 border w-full' 
      draggable
      onDragStart={event => onDragStart(event, taskType)}
    >
      <div className="flex gap-2">
        <task.icon size={20}/>
        {task.label}
      </div>
      <Badge className='flex items-center gap-2' variant={'outline'}>
        <CoinsIcon size={16} />
        {task.credits}
      </Badge>
    </Button>
  )
}

export default TaskMenu