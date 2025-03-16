import React from 'react'
import Logo from '@/components/Logo'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex flex-col justify-center items-center gap-4 h-screen'>
      <Logo/>
      {children}
    </div>
  )
}

export default layout