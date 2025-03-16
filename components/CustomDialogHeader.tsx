import React from 'react'
import { DialogHeader } from './ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

interface Props {
  title?: string;
  subTitle?: string;
  icon?: LucideIcon;

  iconClassName?: string;
  titleClassName?: string; 
  subtitleClassName?: string;
}

const CustomDialogHeader = (props: Props) => {

  const Icon = props.icon;

  return (
    <DialogHeader className='py-6'>
      <DialogTitle asChild>
        <div className="flex flex-col items-center gap-2 mb-2">
          {Icon && <Icon size={30} className={cn(props.iconClassName, 'stroke-primary')}/>}
          {props.title && (
            <p className={cn("text-primary text-xl", props.titleClassName)}>
              {props.title}
            </p>
          )}
          {props.subTitle && (
            <p className={cn("text-muted-foreground text-sm", props.subtitleClassName)}>
              {props.subTitle}
            </p>
          )}
        </div>
      </DialogTitle>
      <Separator/>
    </DialogHeader>
  )
}

export default CustomDialogHeader