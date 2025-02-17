'use client'

import * as React from 'react'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  GraduationCap,
  BookOpen,
  FileText,
} from 'lucide-react'

export interface SidebarLink {
  label: string
  icon: React.JSX.Element
  href: string
}

export interface SidebarGroup {
  title: string
  links: SidebarLink[]
}

export const sidebarLinks: SidebarGroup[] = [
  {
    title: 'MAIN MENU',
    links: [
      {
        label: 'Dashboard',
        icon: <LayoutDashboard className='h-4 w-4' />,
        href: '/admin',
      },
      {
        label: 'Teachers',
        icon: <GraduationCap className='h-4 w-4' />,
        href: '/admin/teachers',
      },
      {
        label: 'Students',
        icon: <Users className='h-4 w-4' />,
        href: '/admin/students',
      },
      {
        label: 'Users',
        icon: <Users className='h-4 w-4' />,
        href: '/admin/users',
      },
      {
        label: 'Applications',
        icon: <FileText className='h-4 w-4' />,
        href: '/admin/applications',
      },
    ],
  },
  {
    title: 'LEARNING',
    links: [
      {
        label: 'Courses',
        icon: <BookOpen className='h-4 w-4' />,
        href: '/admin/courses',
      },
      {
        label: 'Payments',
        icon: <CreditCard className='h-4 w-4' />,
        href: '/admin/payments',
      },
      {
        label: 'Analytics',
        icon: <BarChart3 className='h-4 w-4' />,
        href: '/admin/analytics',
      },
    ],
  },
]
