import { NodeProps } from "@xyflow/react";
import NodeHeader from "./NodeHeader";
import NodeCard from "./NodeCard";
import { memo } from "react";
import { AppNodeData } from "@/types/appNode";
import { NodeInputs, NodeInput } from "./NodeInputs";
import { NodeOutputs, NodeOutput } from "./NodeOutputs";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { Badge } from "@/components/ui/badge";

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true'

const NodeComponent  = memo((props: NodeProps) => {
  const nodeData = props.data as AppNodeData
  const task = TaskRegistry[nodeData.type]

  // console.log(task.inputs)
  return <NodeCard nodeId={props.id} isSelected={!!props.selected}>
    {DEV_MODE && <Badge>DEV: {props.id}</Badge>}
    <NodeHeader taskType={nodeData.type} nodeId={props.id}/>
    <NodeInputs>
      {task.inputs.map((input) => (
        <NodeInput key={input.name} input={input} nodeId={props.id}/>
      ))}
    </NodeInputs>
    <NodeOutputs>
      {task.outputs.map((output) => (
        <NodeOutput key={output.name} output={output} nodeId={props.id}/>
      ))}
    </NodeOutputs>
  </NodeCard>
})

export default NodeComponent

NodeComponent.displayName = 'NodeComponent'