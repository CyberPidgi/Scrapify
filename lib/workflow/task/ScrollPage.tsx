import { TaskType } from "@/types/task"
import { LucideProps, MousePointerClick } from "lucide-react"
import { TaskInputValue } from "@/types/task"
import { WorkflowTask } from "@/types/workflow"

export const ClickElementTask = {
  type: TaskType.CLICK_ELEMENT,
  label: "Click Element",
  icon: (props: LucideProps) => <MousePointerClick className="stroke-rose-400" {...props}/>,
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
    }
  ] as const,
  outputs: [
    {
      name: "Webpage",
      type: TaskInputValue.BROWSER_INSTANCE
    }
  ] as const,
  credits: 1
} satisfies WorkflowTask