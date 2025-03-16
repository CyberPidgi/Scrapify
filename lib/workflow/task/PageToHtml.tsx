import { TaskType } from "@/types/task"
import { CodeIcon, LucideProps } from "lucide-react"
import { TaskInputValue } from "@/types/task"
import { WorkflowTask } from "@/types/workflow"

export const PageToHtmlTask = {
  type: TaskType.PAGE_TO_HTML,
  label: "Get HTML from Page",
  icon: (props: LucideProps) => <CodeIcon className="stroke-rose-400" {...props}/>,
  isEntryPoint: false,
  inputs: [
    {
      name: "Webpage",
      type: TaskInputValue.BROWSER_INSTANCE,
      required: true,
    }
  ] as const,
  outputs: [
    {
      name: "Html",
      type: TaskInputValue.STRING
    },
    {
      name: "Web Page",
      type: TaskInputValue.BROWSER_INSTANCE
    }
  ] as const,
  credits: 2,
} satisfies WorkflowTask