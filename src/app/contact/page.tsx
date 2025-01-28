'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Navbar from '@/components/Navbar'
import Footer from '@/components/footer2'

export default function ContactPage() {
  return (
    <>
      <div className='min-h-screen bg-goldyellow-400 font-m_reg pt-10'>
        <Navbar />

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='container mx-auto px-4 py-12'
        >
          <div className='max-w-4xl mx-auto'>
            <div className='text-center mb-12'>
              <motion.h1
                className='text-5xl font-m_bold text-[#890620] mb-4'
                initial={{ y: 20 }}
                animate={{ y: 0 }}
              >
                Get in Touch
              </motion.h1>
              <p className='text-[#967117] text-lg'>
                Have questions? We're here to help! Reach out to our friendly
                team.
              </p>
            </div>

            <div className='grid md:grid-cols-2 gap-12'>
              <div className='space-y-8'>
                <div className='bg-white p-6 rounded-xl shadow-lg'>
                  <div className='flex items-center gap-4 mb-4'>
                    <div className='bg-goldyellow-100 p-3 rounded-full'>
                      <MapPin className='w-8 h-8 text-goldyellow-600' />
                    </div>
                    <div>
                      <h3 className='text-xl font-semibold text-[#890620]'>
                        Our Office
                      </h3>
                      <p className='text-[#967117]'>
                        123 Learning Street
                        <br />
                        Education City, EC 4567
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-4 mb-4'>
                    <div className='bg-goldyellow-100 p-3 rounded-full'>
                      <Phone className='w-8 h-8 text-goldyellow-600' />
                    </div>
                    <div>
                      <h3 className='text-xl font-semibold text-[#890620]'>
                        Call Us
                      </h3>
                      <p className='text-[#967117]'>+1 (234) 567-8900</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-4'>
                    <div className='bg-goldyellow-100 p-3 rounded-full'>
                      <Mail className='w-8 h-8 text-goldyellow-600' />
                    </div>
                    <div>
                      <h3 className='text-xl font-semibold text-[#890620]'>
                        Email Us
                      </h3>
                      <p className='text-[#967117]'>help@mteaches.com</p>
                    </div>
                  </div>
                </div>

                <div className='relative h-64 rounded-xl overflow-hidden'>
                  <Image
                    src='/boy_smiles.png'
                    alt='Happy student'
                    fill
                    className='object-cover'
                  />
                </div>
              </div>

              <div className='bg-white p-8 rounded-xl shadow-lg'>
                <form className='space-y-6'>
                  <div>
                    <Label htmlFor='name' className='text-[#890620]'>
                      Name
                    </Label>
                    <Input
                      id='name'
                      className='mt-2 border-goldyellow-300 focus:ring-goldyellow-600'
                    />
                  </div>

                  <div>
                    <Label htmlFor='email' className='text-[#890620]'>
                      Email
                    </Label>
                    <Input
                      id='email'
                      type='email'
                      className='mt-2 border-goldyellow-300 focus:ring-goldyellow-600'
                    />
                  </div>

                  <div>
                    <Label htmlFor='message' className='text-[#890620]'>
                      Message
                    </Label>
                    <textarea
                      id='message'
                      rows={4}
                      className='mt-2 w-full border border-goldyellow-300 rounded-lg p-3 focus:ring-goldyellow-600'
                    />
                  </div>

                  <Button
                    type='submit'
                    className='w-full bg-goldyellow-600 hover:bg-goldyellow-700 text-white py-6 text-lg'
                  >
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </motion.main>
      </div>
      <Footer />
    </>
  )
}
