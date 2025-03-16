import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useEffect, useId, useState } from 'react'
import { InputProps } from '@/types/appNode'
import { Textarea } from '@/components/ui/textarea'

const StringInput = ({ input, value, updateInputValue, disabled } : InputProps ) => {
  const id = useId()
  const [internalValue, setInternalValue] = useState('')

  //todo: this function is supposed to make sure the text field becomes empty on edge addition but doesnt work right now
  useEffect(() => {
    setInternalValue(value!)
  }, [value])

  let Component: any = Input
  if (input.variant === 'textarea') {
    Component = Textarea
  }

  return (
    <div className='space-y-1 p-1 w-full'>
      <Label htmlFor={id} className='flex text-xs'>
        {input.name}
        {input.required && <span className='px-1 text-red-500'>*</span>}
      </Label>
      <Component 
        id={id} 
        className='text-xs'  
        value={internalValue} 
        placeholder='Enter value here' 
        onChange={(e: any) => setInternalValue(e.target.value)}
        
        // on blur is when the element loses focus
        onBlur={(e: any) => updateInputValue(e.target.value)}
        disabled={disabled}
      />
      {
        input.helperText && (
          <p className="px-2 text-muted-foreground">
            {input.helperText}
          </p>
        )
      }
    </div>
  )
}

export default StringInput