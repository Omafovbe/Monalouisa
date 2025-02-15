'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
// import { ScrollArea } from '@/components/ui/scroll-area'
import {
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  GraduationCap,
  MessageSquare,
  FileText,
  // Clock,
  BookOpenCheck,
  CreditCard,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

interface MenuItem {
  href: string
  label: string
  icon: React.ReactNode
}

const teacherMenuItems: MenuItem[] = [
  {
    href: '/teacher',
    label: 'Dashboard',
    icon: <LayoutDashboard className='h-4 w-4 mr-2' />,
  },
  {
    href: '/teacher/students',
    label: 'My Students',
    icon: <Users className='h-4 w-4 mr-2' />,
  },
  {
    href: '/teacher/schedule',
    label: 'Schedule',
    icon: <Calendar className='h-4 w-4 mr-2' />,
  },
  {
    href: '/teacher/classes',
    label: 'Classes',
    icon: <BookOpen className='h-4 w-4 mr-2' />,
  },
  {
    href: '/teacher/live-class',
    label: 'Video Session',
    icon: <MessageSquare className='h-4 w-4 mr-2' />,
  },
  {
    href: '/teacher/resources',
    label: 'Resources',
    icon: <FileText className='h-4 w-4 mr-2' />,
  },
]

const studentMenuItems: MenuItem[] = [
  {
    href: '/student',
    label: 'Dashboard',
    icon: <LayoutDashboard className='h-4 w-4 mr-2' />,
  },
  {
    href: '/student/teachers',
    label: 'My Teachers',
    icon: <GraduationCap className='h-4 w-4 mr-2' />,
  },
  {
    href: '/student/schedule',
    label: 'Schedule',
    icon: <Calendar className='h-4 w-4 mr-2' />,
  },
  {
    href: '/student/classes',
    label: 'My Classes',
    icon: <BookOpen className='h-4 w-4 mr-2' />,
  },
  {
    href: '/student/progress',
    label: 'Progress',
    icon: <BookOpenCheck className='h-4 w-4 mr-2' />,
  },
  {
    href: '/student/messages',
    label: 'Messages',
    icon: <MessageSquare className='h-4 w-4 mr-2' />,
  },
  {
    href: '/student/payments',
    label: 'Payments',
    icon: <CreditCard className='h-4 w-4 mr-2' />,
  },
]

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()

  // Get the appropriate menu items based on user role
  const menuItems =
    session?.user?.role === 'STUDENT' ? studentMenuItems : teacherMenuItems

  return (
    <div
      className={cn(
        'bg-white h-full',
        'w-0 md:w-[250px]',
        isMobileOpen && 'w-[250px]',
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
          'fixed md:relative',
          'w-[250px]',
          'h-full',
          'bg-white',
          'transition-transform duration-300',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className='px-3 py-2'>
          <div className='flex items-center px-2 mb-8'>
            <BookOpen className='h-6 w-6 text-amber-500' />
            <h2 className='ml-2 text-lg font-semibold'>EduTeach</h2>
          </div>

          {/* Navigation Links */}
          <div className='space-y-1'>
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? 'secondary' : 'ghost'}
                  className='w-full justify-start'
                >
                  {item.icon}
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Classes Section */}
        <div className='px-3 py-2'>
          {/* <h2 className='mb-2 px-4 text-lg font-semibold tracking-tight'>
            {session?.user?.role === 'TEACHER'
              ? 'My Classes'
              : 'Enrolled Classes'}
          </h2> */}
          {/* <ScrollArea className='h-[300px] px-1'>
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
                  <Clock className='mr-2 h-4 w-4' />
                  {className}
                </Button>
              ))}
            </div>
          </ScrollArea> */}
        </div>

        {/* Bottom Actions */}
        <div className='absolute bottom-4 px-3 w-full space-y-1'>
          <Link href={`/${session?.user?.role?.toLowerCase()}/settings`}>
            <Button variant='ghost' className='w-full justify-start'>
              <Settings className='h-4 w-4 mr-2' />
              Settings
            </Button>
          </Link>
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
