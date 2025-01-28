import { Sidebar, SidebarProvider } from '@/components/ui/sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className='flex h-screen'>
        <Sidebar />
        <main className='flex-1 overflow-y-auto bg-gray-50 p-8'>
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
