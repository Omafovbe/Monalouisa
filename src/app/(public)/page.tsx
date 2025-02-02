'use client'
// import { useState } from 'react'
// import Link from 'next/link'
// import { Button } from '@/components/ui/button'
// import {
//   GraduationCap,
//   Menu,
//   Play,
//   Facebook,
//   Twitter,
//   Linkedin,
//   Instagram,
// } from 'lucide-react'
// import { HeroSection } from '@/components/hero-section'
// import { InstructorsSection } from '@/components/instructors-section'
// import { TestimonialsSection } from '@/components/testimonials-section'

import LandingPage from './home2'
import SubjectList from '@/components/SubjectList'
import { DecorativeSection } from '@/components/DecorativeSection'
import { TeacherFeature } from '@/components/TeacherFeature'
import FAQ from '@/components/faq'

export default function Home() {
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    // <main className='min-h-screen bg-gradient-to-br from-[#F8F9FF] to-[#F5F2FF]'>
    //   <nav className='sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm'>
    //     <div className='container mx-auto flex items-center justify-between p-4'>
    //       <div className='flex items-center gap-2'>
    //         <div className='text-xl sm:text-2xl font-bold text-indigo-600'>
    //           Monalouisa Teaches
    //         </div>
    //       </div>

    //       {/* Desktop Navigation */}
    //       <div className='hidden md:flex items-center space-x-6'>
    //         <Link
    //           href='/'
    //           className='text-gray-600 hover:text-indigo-600 transition-colors'
    //         >
    //           Home
    //         </Link>
    //         <Link
    //           href='/about'
    //           className='text-gray-600 hover:text-indigo-600 transition-colors'
    //         >
    //           About Us
    //         </Link>

    //         <Link
    //           href='/prices'
    //           className='text-gray-600 hover:text-indigo-600 transition-colors'
    //         >
    //           Prices
    //         </Link>
    //         <Link
    //           href='/courses'
    //           className='text-gray-600 hover:text-indigo-600 transition-colors'
    //         >
    //           Courses
    //         </Link>
    //         <Link href='/login'>
    //           <Button variant='ghost' className='text-indigo-600'>
    //             Sign In
    //           </Button>
    //         </Link>
    //         <Link href='/signup'>
    //           <Button className='bg-indigo-600 hover:bg-indigo-700'>
    //             Register
    //           </Button>
    //         </Link>
    //       </div>

    //       {/* Mobile Menu Button */}
    //       <Button
    //         variant='ghost'
    //         size='icon'
    //         className='md:hidden'
    //         onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    //       >
    //         <Menu className='h-6 w-6' />
    //       </Button>
    //     </div>

    //     {/* Mobile Navigation */}
    //     <div
    //       className={`md:hidden border-t ${
    //         isMobileMenuOpen ? 'block' : 'hidden'
    //       }`}
    //     >
    //       <div className='container flex flex-col space-y-4 py-4'>
    //         <Link
    //           href='/'
    //           className='text-gray-600 hover:text-indigo-600 transition-colors'
    //         >
    //           Home
    //         </Link>
    //         <Link
    //           href='/about'
    //           className='text-gray-600 hover:text-indigo-600 transition-colors'
    //         >
    //           About Us
    //         </Link>

    //         <Link
    //           href='/prices'
    //           className='text-gray-600 hover:text-indigo-600 transition-colors'
    //         >
    //           Prices
    //         </Link>
    //         <Link
    //           href='/courses'
    //           className='text-gray-600 hover:text-indigo-600 transition-colors'
    //         >
    //           Courses
    //         </Link>
    //         <div className='flex flex-col space-y-2 pt-2 border-t'>
    //           <Link href='/signin' className='w-full'>
    //             <Button variant='ghost' className='w-full text-indigo-600'>
    //               Sign In
    //             </Button>
    //           </Link>
    //           <Link href='/signup' className='w-full'>
    //             <Button className='w-full bg-indigo-600 hover:bg-indigo-700'>
    //               Sign up
    //             </Button>
    //           </Link>
    //         </div>
    //       </div>
    //     </div>
    //   </nav>

    //   <HeroSection />
    //   <InstructorsSection />
    //   <TestimonialsSection />
    //   <Footer />
    // </main>
    <>
      <LandingPage />
      <DecorativeSection />
      <SubjectList />
      <TeacherFeature />
      <FAQ />
    </>
  )
}
