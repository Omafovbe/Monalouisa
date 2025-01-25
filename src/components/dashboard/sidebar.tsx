'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

// interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div
      className={cn(
        'bg-white h-full',
        'w-0 md:w-[250px]', // Default width on desktop
        isMobileOpen && 'w-[250px]', // Mobile expanded width
        'transition-all duration-300 ease-in-out',
        className
      )}
    >
      {/* Mobile Toggle Button */}
      <Button
        variant='ghost'
        size='icon'
        className='fixed right-4 top-4 md:hidden z-50'
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className='h-6 w-6' />
        ) : (
          <Menu className='h-6 w-6' />
        )}
      </Button>

      {/* Sidebar Content */}
      <div
        className={cn(
          'space-y-4 py-4',
          'fixed md:relative', // Fixed position on mobile, relative on desktop
          'w-[250px]', // Content width
          'h-full',
          'bg-white',
          'transition-transform duration-300',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0' // Slide in/out on mobile
        )}
      >
        <div className='px-3 py-2'>
          <div className='flex items-center px-2 mb-8'>
            <BookOpen className='h-6 w-6 text-amber-500' />
            <h2 className='ml-2 text-lg font-semibold'>EduTeach</h2>
          </div>

          {/* Navigation Links */}
          <div className='space-y-1'>
            <Link href='#'>
              <Button variant='ghost' className='w-full justify-start'>
                <LayoutDashboard className='h-4 w-4 mr-2' />
                Dashboard
              </Button>
            </Link>
            <Link href='#'>
              <Button variant='ghost' className='w-full justify-start'>
                <Users className='h-4 w-4 mr-2' />
                Students
              </Button>
            </Link>
            <Link href='#'>
              <Button variant='ghost' className='w-full justify-start'>
                <Calendar className='h-4 w-4 mr-2' />
                Schedule
              </Button>
            </Link>
          </div>
        </div>

        {/* Classes Section */}
        <div className='px-3 py-2'>
          <h2 className='mb-2 px-4 text-lg font-semibold tracking-tight'>
            Classes
          </h2>
          <ScrollArea className='h-[300px] px-1'>
            <div className='space-y-1'>
              {[
                'English - Beginner',
                'English - Intermediate',
                'Conversation Practice',
                'Grammar Workshop',
                'IELTS Preparation',
              ].map((className) => (
                <Button
                  key={className}
                  variant='ghost'
                  className='w-full justify-start font-normal'
                >
                  <BookOpen className='mr-2 h-4 w-4' />
                  {className}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Bottom Actions */}
        <div className='absolute bottom-4 px-3 w-full space-y-1'>
          <Button variant='ghost' className='w-full justify-start'>
            <Settings className='h-4 w-4 mr-2' />
            Settings
          </Button>
          <Button
            variant='ghost'
            className='w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50'
          >
            <LogOut className='h-4 w-4 mr-2' />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  )
}
