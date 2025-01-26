'use client'
import { X, Menu } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { SignInBtn } from './auth/SignInBtn'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <nav className='bg-white w-[calc(100%-68px)] max-w-[1320px] sticky top-4 shadow-lg rounded-full mx-auto px-6 py-3 flex items-center justify-between z-50'>
        <h1 className='text-xl font-m_bold'>
          <Link href={'/'}> Monalouisa Teaches </Link>
        </h1>

        <div className='hidden md:flex items-center gap-4'>
          <span>Classes</span>
          <span>
            <Link href='/about'>About</Link>
          </span>
          <span>Teachers</span>
          <span>Cost</span>
        </div>
        <div className='flex gap-4'>
          <Button variant='outline'>Try Free Class1</Button>
          <SignInBtn />
          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className='h-6 w-6' />
            ) : (
              <Menu className='h-6 w-6' />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full h-screen py-24 px-14 transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        } bg-white shadow-lg z-30`}
      >
        <div className='container flex flex-col space-y-4 py-4'>
          <Link
            href='/'
            className='text-gray-600 hover:text-indigo-600 transition-colors'
          >
            Home
          </Link>
          <Link
            href='/#'
            className='text-gray-600 hover:text-indigo-600 transition-colors'
          >
            Classes
          </Link>
          <Link
            href='/about'
            className='text-gray-600 hover:text-indigo-600 transition-colors'
          >
            About
          </Link>
          <Link
            href='/#'
            className='text-gray-600 hover:text-indigo-600 transition-colors'
          >
            Teachers
          </Link>
        </div>
        <div className='flex flex-col space-y-2 pt-2 border-t'>
          <Link href='/signup' className='w-full'>
            <Button className='w-full bg-goldyellow-600 hover:bg-goldyellow-600/80'>
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Navbar
