'use client'

import { TaskInputType, TaskInputValue } from '@/types/task'
import BrowserInstanceInput from './inputs/BrowserInstanceInput'
import StringInput from './inputs/StringInput'
import React, { useCallback } from 'react'
import { useReactFlow } from '@xyflow/react'
import { AppNode } from '@/types/appNode'
import SelectInput from './inputs/SelectInput'
import CredentialInput from './inputs/CredentialInput'

const NodeInputField = ({
  input,
  nodeId,
  disabled
}: {
  input: TaskInputType
  nodeId: string
  disabled: boolean
}) => {
  const { updateNodeData, getNode } = useReactFlow()
  const node = getNode(nodeId) as AppNode
  const value = node?.data.inputs?.[input.name]
  // console.log(value);

  const updateNodeInputValue = useCallback(
    (newValue: string) => {
      updateNodeData(nodeId, {
        ...node?.data,
        inputs: {
          ...node?.data.inputs,
          [input.name]: newValue
        }
      })
    },
    [nodeId, updateNodeData, input.name, node?.data]
  )

  switch (input.type) {
    case TaskInputValue.STRING:
      return (
        <StringInput
          input={input}
          value={value}
          updateInputValue={updateNodeInputValue}
          disabled={disabled}
        />
      )

    case TaskInputValue.BROWSER_INSTANCE:
      return (
        <BrowserInstanceInput
          input={input}
          value={''}
          updateInputValue={updateNodeInputValue}
        />
      )

    case TaskInputValue.SELECT:
      return (
        <SelectInput
          input={input}
          value={value}
          updateInputValue={updateNodeInputValue}
          disabled={disabled}
        />
      )

    case TaskInputValue.CREDENTIAL:
      return (
        <CredentialInput
          input={input}
          value={value}
          updateInputValue={updateNodeInputValue}
          disabled={disabled}
        />
      )

    default:
      return (
        <div className='w-full'>
          <p className='text-muted-foreground text-xs'>Not Implemented</p>
        </div>
      )
  }
}

export default NodeInputField
