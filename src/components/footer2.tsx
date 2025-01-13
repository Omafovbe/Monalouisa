import { Facebook, Youtube, Instagram } from 'lucide-react'

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-white py-12'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8'>
          <div>
            <h3 className='font-bold mb-4'>Monalouisa Teaches</h3>
            <div className='text-gray-400 text-sm mb-2'>
              09:00-17:00 (CET) <span className='text-green-400'>Open</span>
            </div>
            <ul className='space-y-2 text-gray-400'>
              <li>For Teachers</li>
              <li>We are hiring!</li>
              <li>Partner programme</li>
            </ul>
          </div>

          <div>
            <h3 className='font-bold mb-4'>Individual lessons</h3>
            <ul className='space-y-2 text-gray-400'>
              <li>English for kids 4-5 y.o.</li>
              <li>English for kids 6-7 y.o.</li>
              <li>English for kids 8-9 y.o.</li>
              <li>English for kids 10-11 y.o.</li>
              <li>English for kids 11-12 y.o.</li>
            </ul>
          </div>

          <div>
            <h3 className='font-bold mb-4'>Contact us</h3>
            <div className='text-gray-400'>
              <p className='mb-2'>Text messages only:</p>
              <p className='mb-4'>+14844731060</p>
              <p className='mb-2'>Find us here:</p>
              <p>US 548 Market St 8291, San Francisco, CA 94104-5401</p>
            </div>
          </div>

          <div>
            <h3 className='font-bold mb-4'>Discover</h3>
            <ul className='space-y-2 text-gray-400'>
              <li>Free games</li>
              <li>Our App</li>
              <li>Cost</li>
              <li>Reviews</li>
              <li>Blog</li>
              <li>Q&A</li>
            </ul>
          </div>
        </div>

        <div className='flex justify-between items-center pt-8 border-t border-gray-800'>
          <div className='flex gap-4 text-sm text-gray-400'>
            <a href='#' className='hover:text-white'>
              Privacy Policy
            </a>
            <a href='#' className='hover:text-white'>
              Terms and Conditions
            </a>
            <a href='#' className='hover:text-white'>
              Children&#39;s Privacy Policy
            </a>
            <a href='#' className='hover:text-white'>
              Cookie Policy
            </a>
          </div>
          <div className='flex gap-4'>
            <Facebook className='w-6 h-6' />
            <Youtube className='w-6 h-6' />
            <Instagram className='w-6 h-6' />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
