'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import underline from '../../public/underline.svg'
import {
  BookOpen,
  Users,
  Calendar,
  Award,
  Play,
  Menu,
  X,
  Lightbulb,
} from 'lucide-react'

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const ageOptions = Array.from({ length: 9 }, (_, i) => i + 4)

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

  const pricingPlans = [
    {
      duration: '1 month',
      price: '11.8',
      features: [
        'Building confidence',
        'Fun interactive lessons',
        'Priority customer support',
      ],
      savings: null,
      bestValue: false,
    },
    {
      duration: '3 months',
      price: '10.1',
      features: [
        'Building confidence',
        'Fun interactive lessons',
        'Priority customer support',
      ],
      savings: '14%',
      bestValue: false,
    },
    {
      duration: '6 months',
      price: '9.2',
      features: [
        'Achieving fluency',
        'Fun interactive lessons',
        'Priority customer support',
      ],
      savings: '22%',
      bestValue: false,
    },
    {
      duration: '12 months',
      price: '8.9',
      features: [
        'Mastering English',
        'Fun interactive lessons',
        'Priority customer support',
      ],
      savings: '24%',
      bestValue: true,
    },
  ]

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
    <div className='min-h-screen bg-goldyellow-400 font-m_reg pt-10'>
      <nav className='bg-white w-[calc(100%-68px)] max-w-[1320px] sticky top-4 shadow-lg rounded-full mx-auto px-6 py-3 flex items-center justify-between z-50'>
        <h1 className='text-xl font-m_bold'>Monalouisa Teaches</h1>

        <div className='hidden md:flex items-center gap-4'>
          <span>Classes</span>
          <span>Programs</span>
          <span>Teachers</span>
          <span>Cost</span>
        </div>
        <div className='flex gap-4'>
          <Button variant='outline'>Try Free Class</Button>
          <Button className='hidden'>Sign In</Button>
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
            href='/#'
            className='text-gray-600 hover:text-indigo-600 transition-colors'
          >
            Programs
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

      <main>
        {/* Hero Section */}
        <motion.div
          className='w-[calc(100%-68px)] max-w-[1320px] mx-auto pl-8 pr-4 py-12 flex flex-col md:flex-row items-center justify-between'
          variants={containerVariants}
          initial='hidden'
          animate='visible'
        >
          <motion.div
            className='max-w-xl font-m_bold flex flex-col items-center md:items-start'
            variants={itemVariants}
          >
            <motion.span className='text-[#967117]' variants={itemVariants}>
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
                  className='inline-block mr-[0.5rem] text-[#890620]'
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
              className='text-[#967117] text-[1.2rem] mb-8'
              variants={itemVariants}
            >
              Take our assessment quiz to help us understand your child's
              current level and learning goals
            </motion.p>

            <motion.div
              className='bg-white max-w-[460px] px-6 py-8 rounded-2xl'
              variants={itemVariants}
            >
              <h3 className='text-xl text-[#262626] font-semibold mb-4 text-center'>
                Child&#39;s age
              </h3>
              <div className='flex flex-wrap gap-4 justify-center'>
                {ageOptions.map((age) => (
                  <button
                    key={age}
                    className='w-14 h-14 rounded-full border-2 border-goldyellow-300 
                              flex items-center justify-center font-medium relative 
                              overflow-hidden group transition-colors duration-400'
                  >
                    <span className='relative z-10 transition-colors duration-400 group-hover:text-white'>
                      {age}
                    </span>
                    <div
                      className='absolute bottom-0 left-0 w-full bg-goldyellow-600 
                                  transition-all duration-300 ease-out
                                  h-0 group-hover:h-full'
                    />
                  </button>
                ))}
                <button
                  className='w-14 h-14 rounded-full border-2 border-goldyellow-300 
                            flex items-center justify-center font-medium relative 
                            overflow-hidden group transition-colors duration-300'
                >
                  <span className='relative z-10 transition-colors duration-300 group-hover:text-white'>
                    13+
                  </span>
                  <div
                    className='absolute bottom-0 left-0 w-full bg-goldyellow-600 
                                transition-all duration-300 ease-out
                                h-0 group-hover:h-full'
                  />
                </button>
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
              <h2 className='text-3xl font-bold mb-4'>Getting Started</h2>
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
            <h2 className='text-5xl font-bold mb-12 text-center'>
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
                    <span className='text-indigo-700'>{feature.title}</span>
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
        <div className='bg-[#F7F5FF] p-14 text-center'>
          <h1 className='font-bold text-5xl font-m_bold mb-4'>Cost</h1>
          <div className='w-[calc(100%-68px)]  max-w-[1320px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 '>
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-xl pt-6 mt-8 flex flex-col justify-center items-center hover:border-goldyellow-300 hover:border-2 hover:shadow-lg ${
                  plan.bestValue ? 'border-2 border-goldyellow-300' : ''
                }`}
              >
                {plan.bestValue && (
                  <span className='absolute -top-4 left-1/2 transform -translate-x-1/2 bg-goldyellow-50 text-goldyellow-700 border border-goldyellow-300 text-md font-semibold px-3 py-1 rounded-lg'>
                    Best Value
                  </span>
                )}
                <h3 className='text-xl font-bold mb-4'>{plan.duration}</h3>
                <div className='text-3xl font-bold mb-2'>
                  {plan.price}$
                  <span className='text-sm text-gray-500'>/lesson</span>
                </div>
                <div className='p-6'>
                  <ul className='space-y-3 mb-6'>
                    {plan.features.map((feature, i) => (
                      <li key={i} className='flex items-center gap-2'>
                        <svg
                          className='w-5 h-5 text-indigo-600'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path
                            fillRule='evenodd'
                            d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                            clipRule='evenodd'
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className='w-full '>TRY FOR FREE</Button>
                </div>
                {/* <div className='text-center bg-green-100 w-full p-7 rounded-b-xl'>
                  <span className='text-sm'>
                    1 month of FREE speaking groups
                  </span>
                </div> */}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default LandingPage
