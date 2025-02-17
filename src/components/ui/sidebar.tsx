'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { sidebarLinks } from '@/app/data/sidebar-links'
import { signOut } from 'next-auth/react'

// Define types
type SidebarContextType = {
  isCollapsed: boolean
  toggleSidebar: () => void
}

// Create context
const SidebarContext = React.createContext<SidebarContextType | undefined>(
  undefined
)

// Create provider
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}

// Custom hook
function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

// Sidebar component
export function Sidebar({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname()
  const { isCollapsed, toggleSidebar } = useSidebar()

  return (
    <div
      className={cn(
        'relative flex flex-col h-screen bg-white border-r shadow-sm',
        'transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
      {...props}
    >
      <div className='p-4 flex justify-between items-center'>
        <h1
          className={cn(
            'font-bold text-xl origin-left',
            'transition-all duration-300 ease-in-out',
            isCollapsed && 'scale-0 w-0 opacity-0'
          )}
        >
          Monalouisa Teaches
        </h1>
        <button
          onClick={toggleSidebar}
          className={cn(
            'p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100',
            'transition-all duration-300 ease-in-out'
          )}
        >
          {isCollapsed ? (
            <ChevronRight className='h-5 w-5' />
          ) : (
            <ChevronLeft className='h-5 w-5' />
          )}
        </button>
      </div>

      <div className='flex-1 px-3'>
        {sidebarLinks.map((group, idx) => (
          <div key={idx} className='mb-8'>
            <div
              className={cn(
                'text-xs font-semibold text-gray-400 mb-4',
                'transition-all duration-300 ease-in-out',
                isCollapsed && 'opacity-0 translate-x-28'
              )}
            >
              {group.title}
            </div>
            {group.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-4 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100',
                  'transition-all duration-300 ease-in-out',
                  pathname === link.href && 'bg-gray-100 text-gray-900',
                  isCollapsed ? 'justify-center' : 'justify-start'
                )}
              >
                <span className='transition-all duration-300 ease-in-out'>
                  {link.icon}
                </span>
                <span
                  className={cn(
                    'text-sm whitespace-nowrap',
                    'transition-all duration-300 ease-in-out',
                    isCollapsed && 'hidden opacity-0 translate-x-28'
                  )}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className='border-t p-4'>
        <div className='flex flex-col gap-4'>
          <Link
            href='/admin/settings'
            className={cn(
              'flex items-center gap-4 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100',
              'transition-all duration-300 ease-in-out min-w-[40px]',
              pathname === '/admin/settings' && 'bg-gray-100 text-gray-900',
              isCollapsed ? 'justify-center' : 'justify-start'
            )}
          >
            <Settings className='h-4 w-4 min-w-[16px]' />
            <span
              className={cn(
                'text-sm',
                'transition-all duration-300 ease-in-out',
                isCollapsed && 'hidden opacity-0 translate-x-28'
              )}
            >
              Settings
            </span>
          </Link>
          <button
            className={cn(
              'flex items-center gap-4 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100',
              'transition-all duration-300 ease-in-out min-w-[40px]',
              isCollapsed ? 'justify-center' : 'justify-start'
            )}
            onClick={() => signOut()}
          >
            <LogOut className='h-4 w-4 min-w-[16px]' />
            <span
              className={cn(
                'text-sm',
                'transition-all duration-300 ease-in-out',
                isCollapsed && 'hidden opacity-0 translate-x-28'
              )}
            >
              Log Out
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
