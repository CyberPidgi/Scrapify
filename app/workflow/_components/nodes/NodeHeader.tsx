"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { CoinsIcon, CopyIcon, GripVerticalIcon, TrashIcon } from "lucide-react";
import { TaskRegistry } from "@/lib/workflow/task/registry"
import { TaskType } from "@/types/task"
import { useReactFlow } from "@xyflow/react";
import { AppNode } from "@/types/appNode";
import { createFlowNode } from "@/lib/workflow/createFlowNode";

const NodeHeader = ({ taskType, nodeId }: { taskType: TaskType, nodeId: string }) => {
  const task = TaskRegistry[taskType];

  const { deleteElements, getNode, addNodes } = useReactFlow();
  return (
    <div className="flex items-center gap-2 p-2">
      <task.icon size={16}/>
      <div className="flex justify-between items-center w-full">
        <p className="font-bold text-muted-foreground text-xs uppercase">
          {task.label}
        </p>
        <div className="flex items-center gap-1">
          {task.isEntryPoint && <Badge>EntryPoint</Badge>}

          {!task.isEntryPoint && 
            <>
              <Button variant={"ghost"} size={"icon"} onClick={() => {
                deleteElements({
                  nodes: [{ id: nodeId }]
                })
              }}>
                <TrashIcon size={12} className="stroke-red-600"/>
              </Button>
              <Button variant={"ghost"} size={"icon"} onClick={() => {
                const node = getNode(nodeId) as AppNode
                const newX = node.position.x + 100;
                const newY = node.position.y + node.measured?.height! + 20;

                const newNode = createFlowNode(
                  node.data.type,
                  { x: newX, y: newY }
                );

                addNodes([newNode])
              }}>
                <CopyIcon size={12} className="stroke-gray-600"/>
              </Button>
            </>
          }
          <Badge className="flex items-center gap-1">
            <CoinsIcon size={16}/>
            {task.credits}
          </Badge>
          <Button variant={"ghost"} size={"icon"} className="cursor-grab drag-handle">
            <GripVerticalIcon size={20}/>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NodeHeader