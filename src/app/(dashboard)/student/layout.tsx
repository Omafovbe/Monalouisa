'use client'

import { Sidebar } from '@/components/dashboard/sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  if (session?.user?.role === 'TEACHER') {
    redirect('/teacher')
  }
  return (
    <SidebarProvider>
      <div className='flex h-screen overflow-hidden'>
        {/* Sidebar - fixed on all screen sizes */}
        <div className='fixed md:relative md:flex flex-col border-r transition-all duration-300 ease-in-out inset-y-0 z-50'>
          <Sidebar className='h-full' />
        </div>

        {/* Main content - scrollable */}
        <div className='flex-1 overflow-auto'>{children}</div>
      </div>
    </SidebarProvider>
  )
}
