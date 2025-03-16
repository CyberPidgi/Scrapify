import { TaskType } from "@/types/task"
import { DatabaseIcon, LucideProps } from "lucide-react"
import { TaskInputValue } from "@/types/task"
import { WorkflowTask } from "@/types/workflow"

export const AddPropertyToJsonTask = {
  type: TaskType.ADD_PROPERTY_TO_JSON,
  label: "Add Property to JSON",
  icon: (props: LucideProps) => <DatabaseIcon className="stroke-rose-400" {...props}/>,
  isEntryPoint: false,
  inputs: [
    {
      name: "JSON",
      type: TaskInputValue.STRING,
      required: true,
    },
    {
      name: "Property Name",
      type: TaskInputValue.STRING,
      required: true,
    },
    {
      name: "Property Value",
      type: TaskInputValue.STRING,
      required: true,
    }
  ] as const,
  outputs: [
    {
      name: "Updated JSON",
      type: TaskInputValue.STRING
    }
  ] as const,
  credits: 1
} satisfies WorkflowTask