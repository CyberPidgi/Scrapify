import React from 'react'
import { InputProps } from '@/types/appNode'

const BrowserInstanceInput = ({ input }: InputProps ) => {
  return (
    <p className="text-xs">
      {input.name}
    </p>
  )
}

export default BrowserInstanceInput