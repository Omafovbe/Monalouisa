'use client'
import { X, Menu } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { SignInButton } from './auth/SignInBtn'
import { SignOutButton } from './auth/SignOutBtn'
import { useSession } from 'next-auth/react'

// Navigation configuration
const navigationLinks = [
  { label: 'Classes', href: '/classes' },
  { label: 'About', href: '/about' },
  { label: 'Teachers', href: '/teach' },
  { label: 'Cost', href: '/cost' },
]

const roleBasedLinks = {
  ADMIN: { label: 'Admin Dashboard', href: '/admin' },
  TEACHER: { label: 'Teacher Dashboard', href: '/teacher' },
}

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  // console.log('nav: ', session)

  const isLoading = status === 'loading'

  const getRoleBasedLink = () => {
    const userRole = session?.user?.role as keyof typeof roleBasedLinks
    return roleBasedLinks[userRole]
  }

  return (
    <>
      <nav className='bg-white w-[calc(100%-68px)] max-w-[1320px] sticky top-6 shadow-lg rounded-full mx-auto px-6 py-3 flex items-center justify-between z-50'>
        <h1 className='text-xl font-m_bold'>
          <Link href={'/'}> Monalouisa Teaches </Link>
        </h1>

        <div className='hidden md:flex items-center gap-4'>
          {navigationLinks.map((link) => (
            <span key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </span>
          ))}
          {session?.user?.role && getRoleBasedLink() && (
            <Link href={getRoleBasedLink()!.href}>
              <span className='text-goldyellow-600'>
                {getRoleBasedLink()!.label}
              </span>
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
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {session?.user?.role && getRoleBasedLink() && (
            <Link
              href={getRoleBasedLink()!.href}
              className='text-goldyellow-600 hover:text-goldyellow-700 transition-colors'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {getRoleBasedLink()!.label}
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
