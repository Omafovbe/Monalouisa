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
        {/* Sidebar - full on desktop, collapsible on mobile */}
        <div className='fixed md:relative md:flex flex-col border-r transition-all duration-300 ease-in-out'>
          <Sidebar className='h-full' />
        </div>

        {children}
      </div>
    </SidebarProvider>
  )
}
