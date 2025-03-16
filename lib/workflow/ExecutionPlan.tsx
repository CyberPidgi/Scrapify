import { AppNode, AppNodeMissingInputs } from '@/types/appNode'
import { WorkflowExecutionPlan, WorkflowExecutionPlanPhase } from '@/types/workflow'
import { Edge } from '@xyflow/react'
import { TaskRegistry } from './task/registry';

export enum FlowToExecutionPlanValidationError {
  INVALID_INPUTS = 'INVALID_INPUTS',
  NO_ENTRY_POINT = 'NO_ENTRY_POINT',
}

type FlowToExecutionPlanType = {
  executionPlan?: WorkflowExecutionPlan;
  error?: {
    type: FlowToExecutionPlanValidationError;
    invalidInputs?: AppNodeMissingInputs[];
  }
}

export function FlowToExecutionPlan(nodes: AppNode[], edges: Edge[]): FlowToExecutionPlanType {
  
  const entryPoint = nodes.find(node => TaskRegistry[node.data.type].isEntryPoint);
  if (!entryPoint) {
    return {
      error: {
        type: FlowToExecutionPlanValidationError.NO_ENTRY_POINT
      }
    }
  }

  const inputsWithErrors: AppNodeMissingInputs[] = [];
  
  const planned = new Set<string>();
  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint]
    },
  ];

  planned.add(entryPoint.id);

  const invalidInputs = getInvalidInputs(entryPoint, edges, planned);
  if (invalidInputs.length > 0) {
    inputsWithErrors.push({
      nodeId: entryPoint.id,
      inputs: invalidInputs
    });
  }

  for (let phase = 2; phase <= nodes.length && planned.size < nodes.length; phase++) {
    const nextPhase: WorkflowExecutionPlanPhase = {
      phase,
      nodes: []
    }
    
    for (const currentNode of nodes){
      if (planned.has(currentNode.id)) {
        continue;
      }
      const invalidInputs = getInvalidInputs(currentNode, edges, planned);

      if (invalidInputs.length > 0){
        const incomers = getIncomers(currentNode, nodes, edges);

        if (incomers.every(incomer => planned.has(incomer.id))) {
          // if all its dependencies are planned, then it is invalid
          console.error('Invalid Inputs', currentNode.id, invalidInputs);
          inputsWithErrors.push({
            nodeId: currentNode.id,
            inputs: invalidInputs
          });
        } else {
          continue;
        }
      }
      
      nextPhase.nodes.push(currentNode);
    }
    
    for (const node of nextPhase.nodes) {
      planned.add(node.id);
    }
    
    executionPlan.push(nextPhase);
  }


  if (inputsWithErrors.length > 0) {
    return {
      error: {
        type: FlowToExecutionPlanValidationError.INVALID_INPUTS,
        invalidInputs: inputsWithErrors
      }
    }
  }


  return { executionPlan }
}


function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>): string[] {
  const invalidInputs: string[] = [];
  const inputs = TaskRegistry[node.data.type].inputs;


  for (const input of inputs) {
    const inputValue = node.data.inputs[input.name]

    const inputValueProvided = inputValue?.length > 0;

    if (inputValueProvided) { continue; }

    const incomingEdges = edges.filter(edge => edge.target === node.id);



    // find the input that is linked to an output
    const linkedInput = incomingEdges.find(edge => edge.targetHandle === input.name);

    const requiredInputByVisitedOutput = input.required && linkedInput && planned.has(linkedInput.source);

    if (requiredInputByVisitedOutput) { 
      // the inputs are requiredand we have a valid value for it 
      // provided by a task that is already planned
      continue; 
    } else if (!input.required){
      // if the input is not required, but there is an output linked then we need to make sure that the output is already planned

      // no input given by another task
      if (!linkedInput) continue;

      if (linkedInput && planned.has(linkedInput.source)) {
        continue;
      }
    }

    invalidInputs.push(input.name);
  }

  return invalidInputs;
}



// manually defined function 
// as getIncomers from react-xyflow not working in server side code
function getIncomers(node: AppNode, nodes: AppNode[], edges: Edge[]): AppNode[] {
  if (!node.id) return [];

  const incomersIds = new Set();
  edges.forEach(edge => {
    if (edge.target === node.id) {
      incomersIds.add(edge.source);
    }
  });

  return nodes.filter(node => incomersIds.has(node.id));
}
