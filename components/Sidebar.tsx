'use client'
import {
  CoinsIcon,
  HomeIcon,
  Layers2Icon,
  MenuIcon,
  ShieldCheckIcon
} from 'lucide-react'
import React from 'react'
import Logo from './Logo'
import Link from 'next/link'
import { buttonVariants } from './ui/button'
import { usePathname } from 'next/navigation'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Button } from './ui/button'
import UserAvailableCreditsBadge from './UserAvailableCreditsBadge'

const routes = [
  {
    href: '',
    label: 'Home',
    icon: HomeIcon
  },
  {
    href: 'workflows',
    label: 'Workflows',
    icon: Layers2Icon
  },
  {
    href: 'credentials',
    label: 'Credentials',
    icon: ShieldCheckIcon
  },
  {
    href: 'billing',
    label: 'Billing',
    icon: CoinsIcon
  }
]

export const DesktopSidebar = () => {
  const pathname = usePathname()
  const activeRoute =
    routes.find(
      route => route.href.length > 0 && pathname.includes(route.href)
    ) || routes[0]

  return (
    <div className='hidden md:block relative bg-primary/5 dark:bg-secondary/30 border-r-2 w-[280px] h-screen overflow-hidden text-muted-foreground dark:text-foreground border-separate'>
      <div className='flex justify-center items-center gap-2 p-4 border border-b-1 border-separate'>
        <Logo />
      </div>

      <div className='p-2'><UserAvailableCreditsBadge/></div>

      <div className='flex flex-col gap-0.5 p-2'>
        {routes.map((route, index) => (
          <Link
            key={index}
            href={`/${route.href}`}
            className={buttonVariants({
              variant:
                activeRoute.href === route.href
                  ? 'sidebarActiveItem'
                  : 'sidebarItem'
            })}
          >
            <route.icon size={20} />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export const MobileSidebar = () => {
  const pathname = usePathname()
  const activeRoute =
    routes.find(
      route => route.href.length > 0 && pathname.includes(route.href)
    ) || routes[0]

  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className='md:hidden block bg-background border-separate'>
      <nav className='flex justify-between items-center px-8 container'>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant='ghost' size='icon'>
              <MenuIcon />
            </Button>
          </SheetTrigger>

          <SheetContent
            className='space-y-4 max-w-xs sm:max-w-md'
            side={'left'}
          >
            <Logo />
            <UserAvailableCreditsBadge/>
            <div className='flex flex-col gap-1'>
              {routes.map((route, index) => (
                <Link
                  key={index}
                  href={`/${route.href}`}
                  className={buttonVariants({
                    variant:
                      activeRoute.href === route.href
                        ? 'sidebarActiveItem'
                        : 'sidebarItem'
                  })}
                  onClick={() => setIsOpen(false)}
                >
                  <route.icon size={20} />
                  {route.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}
