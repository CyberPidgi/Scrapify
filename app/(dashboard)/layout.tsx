import React from 'react'
import { Separator } from '@/components/ui/separator'
import { DesktopSidebar } from '@/components/Sidebar'
import BreadcrumbHeader from '@/components/BreadcrumbHeader'
import { ModeToggle } from '@/components/ThemeModeToggle'
import { SignedIn, UserButton } from '@clerk/nextjs'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex h-screen'>
      <DesktopSidebar />
      <div className="flex flex-col flex-1 min-h-screen">
        <header className="flex justify-between items-center px-6 py-4 h-[50px] container">
          <BreadcrumbHeader/>
          <div className="flex items-center gap-1">
            <ModeToggle />
            <SignedIn>
              <UserButton/>
            </SignedIn>
          </div>
        </header>
        <Separator/>
        <div className="overflow-auto">
          <div className="flex-1 py-4 text-accent-foreground container">
            {children}
          </div>
        </div>
      </div>
    </div> 
  )
}

export default layout