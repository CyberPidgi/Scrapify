"use client"

import { Workflow } from '@prisma/client'
import { ReactFlow, useNodesState, useEdgesState, Controls, Background, BackgroundVariant, useReactFlow, Connection, addEdge, Edge, getOutgoers } from '@xyflow/react'
import React, { useCallback, useEffect } from 'react'

import { TaskType } from '@/types/task'
import { createFlowNode } from '@/lib/workflow/createFlowNode'

import "@xyflow/react/dist/style.css"
import NodeComponent from './nodes/NodeComponent'
import { on } from 'events'
import { AppNode } from '@/types/appNode'
import DeletableEdge from './edges/DeletableEdge'
import { TaskRegistry } from '@/lib/workflow/task/registry'
import { nodeServerAppPaths } from 'next/dist/build/webpack/plugins/pages-manifest-plugin'

const nodeTypes = {
  ScrapifyNode: NodeComponent
}
const edgeTypes = {
  default: DeletableEdge
}

const snapGrid: [number, number] = [25, 25]
const fitViewOptions = {
  padding: 0.5,
  includeHiddenNodes: true
}

const FlowEditor = ({ workflow }: { workflow: Workflow }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([
  ])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();

  useEffect(() =>  {
    try {
      const flow = JSON.parse(workflow.definition)
      if (!flow) return;

      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);


      // retain the last viewport state of the workflow
      if (!flow.viewport) return;

      const { x=0, y=0, zoom=1 }  = flow.viewport;
      setViewport({ x, y, zoom });

    } catch (error) {
      console.log(error)
      
    }
  }, [workflow.definition, setNodes, setEdges, setViewport])

  const onDragOver = useCallback(( event: any ) => {
    event.preventDefault()
    if (!event.dataTransfer) return
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(( event: any ) => {
    event.preventDefault()
    const taskType = event.dataTransfer?.getData('application/reactflow') as TaskType

    if (typeof taskType === undefined || !taskType) return

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY
    })

    const newNode = createFlowNode(taskType,position)

    setNodes((prevNodes) => [...prevNodes, newNode])
  }, [setNodes, screenToFlowPosition])

  const onConnect = useCallback((connection: Connection) => {
    setEdges((prevEdges) => addEdge({
      ...connection,
      animated: true
    }, prevEdges))

    if(!connection.targetHandle) return;

    const node = nodes.find(node => node.id === connection.target)

    if (!node) return;

    const nodeInputs = node.data.inputs || []
    updateNodeData(node.id, {
      ...node.data,
      inputs: {
        ...nodeInputs,
        [connection.targetHandle]: ""
      }
    })
  }, [setEdges, updateNodeData, nodes])

  const isValidConnection = useCallback(( connection: Edge | Connection ) => {
    // self connection
    if (connection.source === connection.target) return false;

    // different connection types
    const source = nodes.find(node => node.id === connection.source)
    const target = nodes.find(node => node.id === connection.target)

    if (!source || !target){
      console.error("invalid connection: source or target not found")
    }

    const sourceTask = TaskRegistry[source!.data.type]
    const targetTask = TaskRegistry[target!.data.type]

    const output = sourceTask.outputs.find(output => output.name === connection.sourceHandle)
    const input = targetTask.inputs.find(input => input.name === connection.targetHandle)

    if (input?.type !== output?.type) {
      console.error("invalid connection: input and output types do not match")
      return false;
    }


    // check if a cycle is formed if we add this connection
    const hasCycle = (node: AppNode, visited = new Set()) => {
      if (visited.has(node.id)) return true;

      visited.add(node.id);

      for (const outgoer of getOutgoers(node, nodes, edges)) {
        if (outgoer.id === connection.source) return true;

        if (hasCycle(outgoer, visited)) return true;
      }
    }

    if (hasCycle(target!)) {
      console.error("invalid connection: cycle detected")
      return false;
    }

    return true;

  }, [nodes, edges])


  return (
    <main className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid={true}
        snapGrid={snapGrid}
        fitViewOptions={fitViewOptions}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
      >
        <Controls position='top-left' fitViewOptions={fitViewOptions}/>
        <Background variant={BackgroundVariant.Dots} gap={12}/>
      </ReactFlow>
    </main>
  )
}

export default FlowEditor