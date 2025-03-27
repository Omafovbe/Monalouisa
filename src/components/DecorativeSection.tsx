'use client'

import { motion } from 'framer-motion'
import {
  TreesIcon as Plant,
  BookOpen,
  Pencil,
  Camera,
  Palette,
  Music,
} from 'lucide-react'
import Image from 'next/image'

export function DecorativeSection() {
  const floatingAnimation = {
    y: [-10, 10],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: 'reverse' as const,
      ease: 'easeInOut',
    },
  }

  return (
    <div className='relative bg-gradient-to-br from-amber-50 via-white to-amber-100 py-24 overflow-hidden'>
      <div className='container mx-auto px-4'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          <div className='relative'>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className='space-y-6'
            >
              <h2 className='text-4xl font-bold tracking-tight'>
                A Place Every Student
                <br />
                <span className='text-amber-500'>Should Be.</span>
              </h2>
              <p className='text-lg text-gray-600 max-w-md'>
                Education is smart enough to change the human mind positively!
                Join our community of eager learners today.
              </p>
              <div className='flex gap-4'>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='bg-amber-500 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-600 transition-colors'
                >
                  Get started
                </motion.button>
              </div>
            </motion.div>

            {/* Floating Icons */}
            <motion.div
              animate={floatingAnimation}
              className='absolute left-8 -top-20'
            >
              <Plant className='w-12 h-12 text-green-500' />
            </motion.div>
            <motion.div
              animate={floatingAnimation}
              transition={{ delay: 0.5 }}
              className='absolute right-4 top-20'
            >
              <BookOpen className='w-10 h-10 text-amber-500' />
            </motion.div>
            <motion.div
              animate={floatingAnimation}
              transition={{ delay: 1 }}
              className='absolute left-52 -bottom-10'
            >
              <Pencil className='w-10 h-10 text-blue-500' />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className='relative'
          >
            <Image
              src='/learning_together.jpg'
              alt='Happy student'
              width={700}
              height={400}
              className='rounded-3xl border-1'
            />
            <motion.div
              animate={floatingAnimation}
              className='absolute right-8 top-10'
            >
              <Camera className='w-8 h-8 text-purple-500' />
            </motion.div>
            <motion.div
              animate={floatingAnimation}
              transition={{ delay: 0.7 }}
              className='absolute left-4 bottom-12'
            >
              <Palette className='w-8 h-8 text-pink-500' />
            </motion.div>
            <motion.div
              animate={floatingAnimation}
              transition={{ delay: 1.2 }}
              className='absolute right-20 -bottom-18'
            >
              <Music className='w-8 h-8 text-indigo-500' />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
