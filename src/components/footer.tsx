import { Button } from '@/components/ui/button'
import { Twitter, Linkedin, Facebook, Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className='bg-white border-t'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Company Info */}
          <div className='space-y-4'>
            <div className='text-xl font-bold text-[#6C5CE7]'>
              Monalouisa Teaches
            </div>
            <p className='text-gray-600'>
              Empowering students worldwide with quality online education.
            </p>
            <div className='flex gap-4'>
              <a
                href='#'
                className='text-gray-400 hover:text-[#6C5CE7] transition-colors'
                aria-label='Twitter'
              >
                <Twitter className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-[#6C5CE7] transition-colors'
                aria-label='LinkedIn'
              >
                <Linkedin className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-[#6C5CE7] transition-colors'
                aria-label='Facebook'
              >
                <Facebook className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-[#6C5CE7] transition-colors'
                aria-label='Instagram'
              >
                <Instagram className='h-5 w-5' />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='font-bold mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <a href='#' className='text-gray-600 hover:text-[#6C5CE7]'>
                  About Us
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-600 hover:text-[#6C5CE7]'>
                  Courses
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-600 hover:text-[#6C5CE7]'>
                  Instructors
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-600 hover:text-[#6C5CE7]'>
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className='font-bold mb-4'>Help</h3>
            <ul className='space-y-2'>
              <li>
                <a href='#' className='text-gray-600 hover:text-[#6C5CE7]'>
                  Contact Us
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-600 hover:text-[#6C5CE7]'>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-600 hover:text-[#6C5CE7]'>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-600 hover:text-[#6C5CE7]'>
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className='font-bold mb-4'>Newsletter</h3>
            <p className='text-gray-600 mb-4'>
              Subscribe to our newsletter for updates
            </p>
            <form className='flex flex-col gap-2'>
              <input
                type='email'
                placeholder='Enter your email'
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]'
              />
              <Button className='w-full bg-[#6C5CE7] hover:bg-[#5849E5] text-white'>
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className='border-t mt-12 pt-8 text-center text-gray-600'>
          <p>
            &copy; {new Date().getFullYear()} Monalouisa Teaches. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
