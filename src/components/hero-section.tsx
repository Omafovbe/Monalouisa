import { Button } from '@/components/ui/button'
import { Play, GraduationCap } from 'lucide-react'

export function HeroSection() {
  return (
    <section className='container mx-auto px-4 py-16 md:py-24'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
        <div className='space-y-16 text-center md:text-left pt-20'>
          <h1 className='text-4xl leading-loosed sm:text-5xl lg:text-6xl font-m_bold relative z-10'>
            Find out which English programme is best for your child Best online
            platform for{' '}
            <span className='bg-[#6C5CE7] text-white px-4 py-2 rounded-lg inline-block mt-2'>
              learning
            </span>
          </h1>
          <p className='text-gray-600  text-lg relative z-10'>
            There are many variations of passages of Lorem Ipsum available, but
            the majority have suffered alteration in some form, by injected
            humour, or randomised words which don&#39;t look even slightly
            believable.
          </p>
          <div className='flex flex-wrap justify-center md:justify-start gap-4 relative z-10'>
            <Button
              size='lg'
              className='bg-[#6C5CE7] hover:bg-[#5849E5] text-white'
            >
              Join for free
            </Button>
            <Button size='lg' variant='outline' className='text-[#6C5CE7]'>
              <Play className='mr-2 h-4 w-4' /> Learn how
            </Button>
          </div>
        </div>

        {/* Hero Image - Hidden on mobile */}
        <div className='relative hidden lg:block'>
          {/* First decorative element */}
          <div className='absolute -left-32 top-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-[#6C5CE7]/10 blur-3xl' />

          <div className='relative z-10'>
            <img
              src='/boy_smiles.png'
              alt='Happy student learning online'
              className='w-full h-auto object-cover rounded-2xl'
            />

            {/* Floating Elements */}
            <div className='absolute -right-6 -top-6 bg-white p-4 rounded-xl shadow-lg'>
              <div className='flex items-center gap-3'>
                <div className='h-10 w-10 bg-[#6C5CE7] rounded-full flex items-center justify-center'>
                  <GraduationCap className='h-6 w-6 text-white' />
                </div>
                <div>
                  <p className='text-sm font-medium'>Active Students</p>
                  <p className='text-lg font-bold'>10.2k+</p>
                </div>
              </div>
            </div>

            <div className='absolute -left-6 -bottom-6 bg-white p-4 rounded-xl shadow-lg'>
              <div className='flex items-center gap-3'>
                <div className='h-10 w-10 bg-[#6C5CE7] rounded-full flex items-center justify-center'>
                  <Play className='h-6 w-6 text-white' />
                </div>
                <div>
                  <p className='text-sm font-medium'>Video Courses</p>
                  <p className='text-lg font-bold'>120+</p>
                </div>
              </div>
            </div>
          </div>

          {/* Second decorative element */}
          <div className='absolute -bottom-44 right-0 h-[100px] w-[100px] rounded-full bg-[#A29BFE]/60 blur-3xl' />
        </div>
      </div>
    </section>
  )
}
