import { TaskType } from "@/types/task"
import { EyeIcon, LucideProps } from "lucide-react"
import { TaskInputValue } from "@/types/task"
import { WorkflowTask } from "@/types/workflow"

export const WaitForElementTask = {
  type: TaskType.WAIT_FOR_ELEMENT,
  label: "Wait For Element",
  icon: (props: LucideProps) => <EyeIcon className="stroke-amber-400" {...props}/>,
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
      name: "Visibility",
      type: TaskInputValue.SELECT,
      required: true,
      hideHandle: true,
      options: [
        {
          value: "visible",
          label: "Visible"
        },
        {
          value: "hidden",
          label: "Hidden"
        }
      ]
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