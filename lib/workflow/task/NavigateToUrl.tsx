import { TaskType } from "@/types/task"
import { Link2Icon, LucideProps } from "lucide-react"
import { TaskInputValue } from "@/types/task"
import { WorkflowTask } from "@/types/workflow"

export const NavigateToUrlTask = {
  type: TaskType.NAVIGATE_TO_URL,
  label: "Navigate to URL",
  icon: (props: LucideProps) => <Link2Icon className="stroke-rose-400" {...props}/>,
  isEntryPoint: false,
  inputs: [
    {
      name: "Webpage",
      type: TaskInputValue.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: "URL",
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