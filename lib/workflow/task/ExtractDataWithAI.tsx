import { TaskType } from "@/types/task"
import { BrainIcon, LucideProps } from "lucide-react"
import { TaskInputValue } from "@/types/task"
import { WorkflowTask } from "@/types/workflow"

export const ExtractDataWithAITask = {
  type: TaskType.EXTRACT_DATA_WITH_AI,
  label: "Extract Data With AI",
  icon: (props: LucideProps) => <BrainIcon className="stroke-rose-400" {...props}/>,
  isEntryPoint: false,
  inputs: [
    {
      name: "Content",
      type: TaskInputValue.STRING,
      required: true,
    },
    {
      name: "Credentials",
      type: TaskInputValue.CREDENTIAL,
      required: true,
    },
    {
      name: "Prompt",
      type: TaskInputValue.STRING,
      required: true,
      variant: "textarea",
    }
  ] as const,
  outputs: [
    {
      name: "Extracted Data",
      type: TaskInputValue.STRING
    }
  ] as const,
  credits: 4
} satisfies WorkflowTask