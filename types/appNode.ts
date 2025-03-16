import { Node } from "@xyflow/react";
import { TaskInputType, TaskType } from "@/types/task";

export interface AppNodeData {
  type: TaskType;
  inputs: Record<string, string>;
  [key: string]: any;
}

export interface AppNode extends Node {
  data: AppNodeData;
}

export interface InputProps {
  input: TaskInputType,
  value?: string,
  updateInputValue: (newValue: string) => void
  disabled?: boolean 
}

export type AppNodeMissingInputs = {
  nodeId: string,
  inputs: string[]
}