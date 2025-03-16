import { TaskType } from "@/types/task"
import { FileJson2Icon, LucideProps, MousePointerClick } from "lucide-react"
import { TaskInputValue } from "@/types/task"
import { WorkflowTask } from "@/types/workflow"

export const ReadPropertyFromJsonTask = {
  type: TaskType.READ_PROPERTY_FROM_JSON,
  label: "Read Property from JSON",
  icon: (props: LucideProps) => <FileJson2Icon className="stroke-rose-400" {...props}/>,
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
    }
  ] as const,
  outputs: [
    {
      name: "Property Value",
      type: TaskInputValue.STRING
    }
  ] as const,
  credits: 1
} satisfies WorkflowTask