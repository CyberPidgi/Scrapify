"use client"

import { usePathname } from 'next/navigation'
import React from 'react'
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator 
} from './ui/breadcrumb';

import { MobileSidebar } from './Sidebar';
import { SignOutButton } from '@clerk/nextjs';
import { ArrowRight } from 'lucide-react';

const BreadcrumbHeader = () => {

  const pathname = usePathname();

  const paths = pathname === '/' ? [""] : pathname?.split('/');
  return (
    <div className='flex flex-start items-center'>
      <MobileSidebar/>
      <Breadcrumb>
        <BreadcrumbList>
          {paths.map((path, index) => (
            <React.Fragment  key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink className='flex items-center text-sm capitalize' href={`/${path}`}>
                  {path === '' ? 'Home' : path}
                  <BreadcrumbSeparator/>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

export default BreadcrumbHeader