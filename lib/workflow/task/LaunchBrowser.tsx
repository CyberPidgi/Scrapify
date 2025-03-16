import { TaskType } from "@/types/task"
import { GlobeIcon, LucideProps } from "lucide-react"
import { TaskInputValue } from "@/types/task"
import { WorkflowTask } from "@/types/workflow"

export const LaunchBrowserTask = {
  type: TaskType.LAUNCH_BROWSER,
  label: "Launch Browser",
  icon: (props: LucideProps) => <GlobeIcon className="stroke-pink-400" {...props}/>,
  isEntryPoint: true,
  inputs: [
    {
      name: "Website Url",
      type: TaskInputValue.STRING,
      helperText: "eg: https://example.com",
      required: true,
      hideHandle: true
    }
  ] as const,
  outputs: [
    {
      name: 'Web Page',
      type: TaskInputValue.BROWSER_INSTANCE
    }
  ] as const,
  credits: 5,
} satisfies WorkflowTask