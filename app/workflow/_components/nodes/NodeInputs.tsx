import { cn } from "@/lib/utils"
import { TaskInputType } from "@/types/task"
import { Handle, Position, useEdges } from "@xyflow/react"
import NodeInputField from "./NodeInputField"
import { ColorForHandle } from "./common"
import useFlowValidation from "@/components/hooks/useFlowValidation"

export function NodeInputs({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 divide-y">
      {children}
    </div>
  )
}

export function NodeInput({ input, nodeId }: { input: TaskInputType, nodeId: string }) {

  const { invalidInputs } = useFlowValidation();
  const hasErrors = invalidInputs.find(input => input.nodeId === nodeId)?.inputs.find((invalidInput) => invalidInput === input.name);

  const edges = useEdges();
  const isConnected = edges.some(edge => edge.target === nodeId && edge.targetHandle === input.name);

  return (
    <div className={cn("relative flex justify-start bg-secondary p-3 w-full", hasErrors && "bg-destructive/30")}>
      <NodeInputField input={input} nodeId={nodeId} disabled={isConnected}/>
      { !input.hideHandle && 
        <Handle
        id={input.name}
        isConnectable={!isConnected}
        type="target"
        position={Position.Left}
        className={
          cn(
            "!bg-muted-foreground !border-2 !border-background !-left-2 !size-4",
            ColorForHandle[input.type]
          )
        }
        />
      }
    </div>
  )
}