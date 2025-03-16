import React, { useId } from 'react'
import { InputProps } from '@/types/appNode'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label';

type OptionType = {
  value: string;
  label: string;
}

const SelectInput = ({ input, updateInputValue, value }: InputProps ) => {
  const id = useId();
  return (
    <div className='flex flex-col gap-1 w-full'>
      <Label htmlFor={id} className='flex text-xs'>
        {input.name}
        {input.required && <span className='px-2 text-red-500'>*</span>}
      </Label>
      <Select onValueChange={(value) => updateInputValue(value)} defaultValue={value}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Select an option'/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Options</SelectLabel>
            {input.options.map((option: OptionType) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default SelectInput
