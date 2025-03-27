'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import underline from '../../../public/underline.svg'
import { BookOpen, Users, Calendar, Award, Play, Lightbulb } from 'lucide-react'

import PricingTable from '@/components/PricingTable'
import packagesData from '@/app/data/packages.json'

import { Testimonials } from '@/components/Testimonials'

const LandingPage = () => {
  const ageRanges = [
    { label: '4-9', range: [4, 5, 6, 7, 8, 9] },
    { label: '10-15', range: [10, 11, 12, 13, 14, 15] },
    { label: '16-21', range: [16, 17, 18, 19, 20, 21] },
    { label: '22-29', range: [22, 23, 24, 25, 26, 27, 28, 29] },
    { label: '30-39', range: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39] },
    { label: '40+', range: [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
  ]

  const steps = [
    {
      icon: <BookOpen className='w-8 h-8 text-goldyellow-600' />,
      title: 'Take Assessment',
      description:
        "Complete a quick quiz to help us understand your child's current level and learning goals",
    },
    {
      icon: <Users className='w-8 h-8 text-goldyellow-600' />,
      title: 'Meet Your Teacher',
      description:
        'Get matched with experienced teachers who specialize in engaging young learners',
    },
    {
      icon: <Calendar className='w-8 h-8 text-goldyellow-600' />,
      title: 'Schedule Classes',
      description:
        "Choose convenient time slots that fit your child's schedule",
    },
    {
      icon: <Award className='w-8 h-8 text-goldyellow-600' />,
      title: 'Start Learning',
      description:
        "Begin your child's learning journey with personalized lessons and engaging activities",
    },
  ]

  const features = [
    {
      icon: '🎯',
      title: 'Language immersion',
    },
    {
      icon: '🎖️',
      title: 'Experienced teachers',
    },
    {
      icon: '🤝',
      title: 'From simple to complex',
    },
    {
      icon: '💻',
      title: 'Lessons from home',
    },
    {
      icon: '🎈',
      title: 'Age-appropriate programme',
    },
    {
      icon: '🎓',
      title: 'European standard of education',
    },
    {
      icon: '🌍',
      title: 'Speaking practice in groups',
    },
  ]

  // const pricingPlans = [
  //   {
  //     duration: '1 month',
  //     price: 11.8,
  //     features: [
  //       'Building confidence',
  //       'Fun interactive lessons',
  //       'Priority customer support',
  //     ],
  //     savings: null,
  //     bestValue: false,
  //   },
  //   {
  //     duration: '3 months',
  //     price: 10.1,
  //     features: [
  //       'Building confidence',
  //       'Fun interactive lessons',
  //       'Priority customer support',
  //     ],
  //     savings: '14%',
  //     bestValue: false,
  //   },
  //   {
  //     duration: '6 months',
  //     price: 9.2,
  //     features: [
  //       'Achieving fluency',
  //       'Fun interactive lessons',
  //       'Priority customer support',
  //     ],
  //     savings: '22%',
  //     bestValue: false,
  //   },
  //   {
  //     duration: '12 months',
  //     price: 8.9,
  //     features: [
  //       'Mastering English',
  //       'Fun interactive lessons',
  //       'Priority customer support',
  //     ],
  //     savings: '24%',
  //     bestValue: true,
  //   },
  // ]

  // Split text into two parts for different styling
  const lightWords = 'Discover the perfect'.split(' ')
  const darkWords = 'learning path'.split(' ')

  // Variants for the hero section elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  // Word reveal variants
  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const wordVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  }

  return (
    <div className='min-h-screen bg-opal font-m_reg -mt-20 pt-32 lg:pt-26'>
      {/* Hero Section */}
      <motion.div
        className='w-[calc(100%-68px)] max-w-[1320px] mx-auto pl-8 pr-4 pb-12 flex flex-col md:flex-row items-center justify-between'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        <motion.div
          className='max-w-xl font-m_bold flex flex-col items-center md:items-start'
          variants={itemVariants}
        >
          <motion.span
            className='text-eastern-blue-400 text-xl'
            variants={itemVariants}
          >
            ONLINE LEARNING PLATFORM
          </motion.span>

          <motion.h1
            className='text-6xl font-bold text-center md:text-left mt-4 mb-6'
            variants={textVariants}
          >
            {/* Light colored words */}
            {lightWords.map((word, index) => (
              <motion.span
                key={index}
                variants={wordVariants}
                className='inline-block mr-[0.5rem] text-white'
              >
                {word}
              </motion.span>
            ))}
            {/* Dark colored words */}
            {darkWords.map((word, index) => (
              <motion.span
                key={`dark-${index}`}
                variants={wordVariants}
                className='inline-block mr-[0.5rem] text-goldyellow-300'
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              className='text-white block mt-2'
              variants={itemVariants}
            >
              for your child
            </motion.span>
          </motion.h1>

          <motion.p
            className='text-eastern-blue-400 text-[1.2rem] mb-8'
            variants={itemVariants}
          >
            Take our assessment quiz to help us understand your child&apos;s
            current level and learning goals
          </motion.p>

          <motion.div
            className='bg-white max-w-[400px] px-6 py-8 rounded-2xl'
            variants={itemVariants}
          >
            <h3 className='text-xl text-[#262626] font-semibold mb-4 text-center'>
              Age Category
            </h3>
            <div className='flex flex-wrap gap-4 justify-center'>
              {ageRanges.map((ageRange, index) => (
                <button
                  key={index}
                  className='min-w-[80px] h-14 rounded-full border-2 border-goldyellow-300
                            flex items-center justify-center font-medium relative 
                            overflow-hidden group transition-colors duration-400 px-4'
                >
                  <span className='relative z-10 transition-colors duration-400 group-hover:text-goldyellow-900'>
                    {ageRange.label}
                  </span>
                  <div
                    className='absolute bottom-0 left-0 w-full bg-goldyellow-300
                                transition-all duration-300 ease-out
                                h-0 group-hover:h-full'
                  />
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div className='relative py-14'>
          <motion.div
            className='p-4 transform rotate-3'
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Image
              src='/young-student.png'
              alt='Learning illustration'
              width={500}
              height={250}
              className='rounded-xl scale-x-[-1]'
            />
            <motion.div
              className='absolute top-12 right-16'
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className='shadow-md rounded-full p-3'>
                <motion.div
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Lightbulb className='w-8 h-8 text-goldyellow-600' />
                </motion.div>
                <motion.div
                  className='absolute inset-0 bg-goldyellow-400/30 rounded-full blur-md'
                  animate={{
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Process Steps Section */}
      <div className='bg-amber-50 py-24'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='lg:text-5xl text-3xl font-bold mb-4'>
              Getting Started
            </h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Our simple process makes it easy to get your child started on
              their learning journey
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {steps.map((step, index) => (
              <div
                key={index}
                className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow'
              >
                <div className='bg-goldyellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-4'>
                  {step.icon}
                </div>
                <h3 className='text-xl font-semibold mb-2'>{step.title}</h3>
                <p className='text-gray-600'>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className='bg-gray-50 py-16 relative'>
        <div className='absolute top-0 left-0 right-0'>
          <svg viewBox='0 0 1440 100' className='w-full'>
            <path
              d='M0,0 C480,100 960,100 1440,0 L1440,0 L0,0 Z'
              fill='#84cc16'
              opacity='0.2'
            />
          </svg>
        </div>

        <div className='container mx-auto px-4'>
          <h2 className='lg:text-5xl text-3xl font-bold mb-12 text-center'>
            How it works
            {/* Underline SVG */}
            <div className='flex justify-center'>
              <Image
                className='w-full h-3 max-w-[250px]  fill-goldyellow-700'
                alt='underline'
                src={underline}
              />
            </div>
          </h2>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div className='space-y-6'>
              {features.map((feature, index) => (
                <div
                  key={index}
                  className='flex items-center gap-4 text-lg hover:text-indigo-600 transition-colors'
                >
                  <span className='w-8 h-8 flex items-center justify-center text-2xl'>
                    {feature.icon}
                  </span>
                  <span className='text-goldyellow-700'>{feature.title}</span>
                </div>
              ))}
            </div>

            <div className='relative'>
              <div className='rounded-2xl overflow-hidden bg-gray-100'>
                <Image
                  src='/api/placeholder/600/400'
                  alt='Teacher introduction'
                  width={600}
                  height={400}
                  className='w-full h-full object-cover'
                />
                <div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
                  <button className='w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-300 transition-colors'>
                    <Play className='w-8 h-8 text-white' />
                  </button>
                </div>
                <div className='absolute bottom-4 left-4 bg-indigo-900/80 text-white p-2 rounded'>
                  <div className='text-lg font-semibold'>Adrienne</div>
                  <div className='text-sm text-gray-200'>
                    teacher & methodologist
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Section */}
      {/* <CostSection pricingPlans={pricingPlans} /> */}
      <PricingTable data={packagesData} />
      <Testimonials />
    </div>
  )
}

export default LandingPage
