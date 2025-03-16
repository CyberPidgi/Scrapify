'use client'

import { cn } from '@/lib/utils'
import { useReactFlow } from '@xyflow/react'
import { ReactNode } from 'react'
import useFlowValidation from '@/components/hooks/useFlowValidation'

const NodeCard = ({
  children,
  nodeId,
  isSelected
}: {
  nodeId: string
  children: ReactNode
  isSelected: boolean
}) => {
  const { getNode, setCenter } = useReactFlow()
  const { invalidInputs } = useFlowValidation()
  const hasInvalidInputs = invalidInputs.some(input => input.nodeId === nodeId)

  return (
    <div
      onDoubleClick={() => {
        const node = getNode(nodeId)
        if (!node) return
        const { position, measured } = node

        if (!position || !measured) return

        const { width, height } = measured
        if (!width || !height) return

        const x = position.x + width / 2
        const y = position.y + height / 2

        if (x === undefined || y === undefined) return

        setCenter(x, y, {
          zoom: 1,
          duration: 500
        })
      }}
      className={cn(
        'flex flex-col gap-1 border-2 border-separate bg-background rounded-md w-[420px] text-xs cursor-pointer',
        isSelected ? 'border-primary' : 'border-transparent',
        hasInvalidInputs ? 'border-destructive border-2' : 'border-transparent'
      )}
      id={nodeId}
    >
      {children}
    </div>
  )
}

export default NodeCard
