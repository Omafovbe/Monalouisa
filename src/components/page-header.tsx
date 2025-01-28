'use client'

import { motion } from 'framer-motion'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface PageHeaderProps {
  title: string
  breadcrumbs: {
    href?: string
    label: string
  }[]
}

export function PageHeader({ title, breadcrumbs }: PageHeaderProps) {
  return (
    <section className='relative h-[60vh] -top-16 flex flex-col items-center justify-center'>
      <div className='absolute inset-0 bg-gradient-to-r from-goldyellow-500 to-goldyellow-700' />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className='relative z-10 flex flex-col items-center text-center space-y-4'
      >
        <h1 className='text-5xl md:text-7xl font-bold text-white mb-6 font-m_bold'>
          {title}
        </h1>
        <div className='flex justify-center w-full'>
          <Breadcrumb className='text-white/90'>
            <BreadcrumbList className='flex items-center justify-center'>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href='/'
                  className='text-white/75 hover:text-white'
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className='text-white/50' />
              {breadcrumbs.map((crumb, index) => (
                <BreadcrumbItem key={index}>
                  {index < breadcrumbs.length - 1 ? (
                    <>
                      <BreadcrumbLink
                        href={crumb.href || '#'}
                        className='text-white/75 hover:text-white'
                      >
                        {crumb.label}
                      </BreadcrumbLink>
                      <BreadcrumbSeparator className='text-white/50' />
                    </>
                  ) : (
                    <BreadcrumbPage className='text-white'>
                      {crumb.label}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </motion.div>
    </section>
  )
}
