import { LucideProps } from "lucide-react"
import { TaskInputType, TaskType } from "./task"
import { AppNode } from "./appNode";

export enum WorkflowStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export type WorkflowTask = {
  label: string,
  icon: React.FC<LucideProps>,
  type: TaskType,
  isEntryPoint: boolean,
  inputs: TaskInputType[],
  outputs: TaskInputType[],
  credits: number;
}

export type WorkflowExecutionPlanPhase = {
  phase: number;
  nodes: AppNode[];  // for parallel node execution
};

export type WorkflowExecutionPlan = WorkflowExecutionPlanPhase[];

export enum WorkflowExecutionStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  COMPLETED = "COMPLETED",
}

export enum ExecutionPhaseStatus {
  CREATED = "CREATED",
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum WorkflowExecutionTrigger {
  MANUAL = "MANUAL",
  SCHEDULED = "SCHEDULED",
  CRON = "CRON",
}


