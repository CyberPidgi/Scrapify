import Logo from "@/components/Logo";
import { Separator } from "@/components/ui/separator";
import { Loader2Icon } from "lucide-react";

export default function loading() {
  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full h-screen">
      <Logo iconSize={50} fontSize="text-3xl"/>
      <Separator className="max-w-xs"/>
      <div className="flex justify-center items-center gap-2">
        <Loader2Icon size={16} className="stroke-primary animate-spin"/>
        <p className="text-muted-foreground">Setting up your account ...</p>
      </div>
    </div>
  )
}