'use client'
import { X, Menu } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { SignInButton } from './auth/SignInBtn'
import { SignOutButton } from './auth/SignOutBtn'
import { useSession } from 'next-auth/react'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  // console.log('nav: ', session)

  const isLoading = status === 'loading'

  return (
    <>
      <nav className='bg-white w-[calc(100%-68px)] max-w-[1320px] sticky top-6 shadow-lg rounded-full mx-auto px-6 py-3 flex items-center justify-between z-50'>
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
          {session?.user?.role === 'ADMIN' && (
            <Link href='/admin'>
              <span className='text-goldyellow-600'>Admin Dashboard</span>
            </Link>
          )}
          {session?.user?.role === 'TEACHER' && (
            <Link href='/teacher'>
              <span className='text-goldyellow-600'>Teacher Dashboard</span>
            </Link>
          )}
        </div>
        <div className='flex gap-4 items-center'>
          {!isLoading && (
            <>
              {!session && <Button variant='link'>Try Free Class</Button>}
              {session ? (
                <SignOutButton />
              ) : (
                <Button asChild>
                  <Link href='/login'>Login</Link>
                </Button>
              )}
            </>
          )}
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
            className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href='/about'
            className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href='/contact'
            className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
          <Link
            href='/#'
            className='text-gray-600 hover:text-indigo-600 transition-colors'
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Teachers
          </Link>
          {session?.user?.role === 'ADMIN' && (
            <Link
              href='/admin'
              className='text-goldyellow-600 hover:text-goldyellow-700 transition-colors'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Admin Dashboard
            </Link>
          )}
          {session?.user?.role === 'TEACHER' && (
            <Link
              href='/teacher'
              className='text-goldyellow-600 hover:text-goldyellow-700 transition-colors'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Teacher Dashboard
            </Link>
          )}
        </div>
        <div className='flex flex-col space-y-2 pt-2 border-t'>
          {!isLoading &&
            (session ? (
              <SignOutButton />
            ) : (
              <>
                <Button variant='link' className='w-full'>
                  Try Free Class
                </Button>
                <SignInButton />
              </>
            ))}
        </div>
      </div>
    </>
  )
}

export default Navbar
