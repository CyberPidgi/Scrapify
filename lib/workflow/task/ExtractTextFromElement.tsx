import { TaskType } from "@/types/task"
import { CodeIcon, LucideProps } from "lucide-react"
import { TaskInputValue } from "@/types/task"
import { WorkflowTask } from "@/types/workflow"

export const ExtractTextFromElementTask = {
  type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
  label: "Extract Text From Element",
  icon: (props: LucideProps) => <CodeIcon className="stroke-rose-400" {...props}/>,
  isEntryPoint: false,
  inputs: [
    {
      name: "Html",
      type: TaskInputValue.STRING,
      required: true,
      variant: "textarea"
    },
    {
      name: "Selector",
      type: TaskInputValue.STRING,
      required: true,
    }
  ] as const,
  outputs: [
    {
      name: "Extracted Text",
      type: TaskInputValue.STRING
    }
  ] as const,
  credits: 3
} satisfies WorkflowTask