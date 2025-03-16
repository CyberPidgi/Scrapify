import { TaskType } from "@/types/task"
import { ArrowUpIcon, LucideProps } from "lucide-react"
import { TaskInputValue } from "@/types/task"
import { WorkflowTask } from "@/types/workflow"

export const ScrollToElementTask = {
  type: TaskType.SCROLL_TO_ELEMENT,
  label: "Scroll To Element",
  icon: (props: LucideProps) => <ArrowUpIcon className="stroke-rose-400" {...props}/>,
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