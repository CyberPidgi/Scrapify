'use client'

import { Button } from '@/components/ui/button'
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  useReactFlow
} from '@xyflow/react'
import { Delete, DeleteIcon, Trash } from 'lucide-react'

export default function DeletableEdge (props: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath(props)
  const { setEdges } = useReactFlow()
  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={props.markerEnd}
        style={props.style}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all'
          }}
        >
          <Button
            variant={'outline'}
            size={'icon'}
            className='opacity-0 hover:opacity-100 hover:shadow-lg border rounded-full w-5 h-5 text-xs leading-none transition duration-500 cursor-pointer'
            onClick={() => {
              setEdges(edges => edges.filter(edge => edge.id !== props.id))
            }}
          >
            <Trash size={16} />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
