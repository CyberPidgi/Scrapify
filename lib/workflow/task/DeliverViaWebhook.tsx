import { TaskType } from "@/types/task"
import { LucideProps, SendIcon } from "lucide-react"
import { TaskInputValue } from "@/types/task"
import { WorkflowTask } from "@/types/workflow"

export const DeliverViaWebhookTask = {
  type: TaskType.DELIVER_VIA_WEBHOOK,
  label: "Deliver Via Webhook",
  icon: (props: LucideProps) => <SendIcon className="stroke-blue-400" {...props}/>,
  isEntryPoint: false,
  inputs: [
    {
      name: "Target URL",
      type: TaskInputValue.STRING,
      required: true,
    },
    {
      name: "Body",
      type: TaskInputValue.STRING,
      required: true,
    }
  ] as const,
  outputs: [] as const,
  credits: 1
} satisfies WorkflowTask