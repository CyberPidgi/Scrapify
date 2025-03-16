import { TaskType } from "@/types/task"
import { Edit3Icon, LucideProps } from "lucide-react"
import { TaskInputValue } from "@/types/task"
import { WorkflowTask } from "@/types/workflow"

export const FillInputTask = {
  type: TaskType.FILL_INPUT,
  label: "Fill Input",
  icon: (props: LucideProps) => <Edit3Icon className="stroke-orange-400" {...props}/>,
  isEntryPoint: false,
  inputs: [
    {
      name: "Webpage",
      type: TaskInputValue.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: "Selector",
      type: TaskInputValue.STRING,
      required: true,
    },
    {
      name: "Value",
      type: TaskInputValue.STRING,
      required: true,
    }
  ] as const,
  outputs: [
    {
      name: "Web Page",
      type: TaskInputValue.BROWSER_INSTANCE
    }
  ] as const,
  credits: 1,
} satisfies WorkflowTask