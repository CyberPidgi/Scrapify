import { AppNode } from '@/types/appNode';
import { TaskType } from '@/types/task'

export function createFlowNode (
  nodeType: TaskType,
  position?: { x: number; y: number }
): AppNode {
  return {
    id: crypto.randomUUID(),
    type: 'ScrapifyNode',
    dragHandle: '.drag-handle',
    position: position || { x: 0, y: 0 },
    data: {
      type: nodeType,
      inputs: {}
    }
  }
}
