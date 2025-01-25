'use client'

import { GalleryVerticalEnd, Minus, Plus } from 'lucide-react'

// import { SearchForm } from "@/components/search-form"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { SignOutButton } from './auth/SignOutBtn'
import { useState } from 'react'

// This is sample data.
const data = {
  navMain: [
    {
      title: 'Admin',
      url: '#',
      items: [
        {
          title: 'Installation',
          url: '#',
        },
        {
          title: 'Project Structure',
          url: '#',
        },
      ],
    },
    {
      title: 'Curriculum',
      url: '#',
      items: [
        {
          title: 'Routing',
          url: '#',
        },
        {
          title: 'Language Structure',
          url: '#',
          isActive: true,
        },
        {
          title: 'Rendering',
          url: '#',
        },
        {
          title: 'Caching',
          url: '#',
        },
        {
          title: 'Styling',
          url: '#',
        },
        {
          title: 'Optimizing',
          url: '#',
        },
        {
          title: 'Configuring',
          url: '#',
        },

        {
          title: 'Deploying',
          url: '#',
        },
        {
          title: 'Upgrading',
          url: '#',
        },
        {
          title: 'Examples',
          url: '#',
        },
      ],
    },
    {
      title: 'School Management',
      url: '#',
      items: [
        {
          title: 'Teachers',
          url: '/admin/teachers',
        },
        {
          title: 'Students',
          url: '/admin/students',
        },
        {
          title: 'Subjects',
          url: '/admin/subjects',
        },
      ],
    },

    {
      title: 'Community',
      url: '#',
      items: [
        {
          title: 'Contribution Guide',
          url: '#',
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogTitle>Navigation Menu</DialogTitle>
          {/* Mobile sidebar content */}
          <SidebarContent className='md:hidden'>
            <SidebarMenu>
              {data.navMain.map((item, index) => (
                <Collapsible
                  key={item.title}
                  defaultOpen={index === 1}
                  className='group/collapsible'
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        {item.title}
                        <Plus className='ml-auto group-data-[state=open]/collapsible:hidden' />
                        <Minus className='ml-auto group-data-[state=closed]/collapsible:hidden' />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {item.items?.length ? (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((item) => (
                            <SidebarMenuSubItem key={item.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={item.isActive}
                              >
                                <a href={item.url}>{item.title}</a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    ) : null}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </DialogContent>
      </Dialog>

      <Sidebar {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size='lg' asChild>
                <a href='#'>
                  <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                    <GalleryVerticalEnd className='size-4' />
                  </div>
                  <div className='flex flex-col gap-0.5 leading-none'>
                    <span className='font-semibold'>M-Teaches</span>
                    <span className=''>Admin</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          {/* <SearchForm /> */}
        </SidebarHeader>

        <SidebarContent className='hidden md:block'>
          <SidebarGroup>
            <SidebarMenu>
              {data.navMain.map((item, index) => (
                <Collapsible
                  key={item.title}
                  defaultOpen={index === 1}
                  className='group/collapsible'
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        {item.title}
                        <Plus className='ml-auto group-data-[state=open]/collapsible:hidden' />
                        <Minus className='ml-auto group-data-[state=closed]/collapsible:hidden' />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {item.items?.length ? (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((item) => (
                            <SidebarMenuSubItem key={item.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={item.isActive}
                              >
                                <a href={item.url}>{item.title}</a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    ) : null}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
              <SignOutButton />
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarRail />
        <SidebarFooter>
          <SignOutButton />
        </SidebarFooter>
      </Sidebar>
    </>
  )
}
