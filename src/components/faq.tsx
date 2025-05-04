'use client'

import { motion } from 'framer-motion'
// import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface FAQ {
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    question: 'What ages do you teach?',
    answer:
      'We specialize in teaching languages to children between the ages of 4 and 18. Our curriculum is tailored to different age groups with age-appropriate teaching methods and materials.',
  },
  {
    question: 'What languages do you offer?',
    answer:
      'We currently offer courses in English, French, Spanish, Arabic, and Chinese. Each language is taught by native or fluent speakers with expertise in teaching children.',
  },
  {
    question: 'How do online classes work?',
    answer:
      'Our online classes are conducted through our secure video platform. Students join at their scheduled time, interact live with their teacher and sometimes with other students. Classes include interactive activities, games, and real-time feedback.',
  },
  {
    question: "What's your teaching approach?",
    answer:
      'We use a communicative, immersive approach focused on getting children speaking and understanding from day one. Our methods incorporate games, songs, stories, and cultural elements to make learning engaging and effective.',
  },
  {
    question: 'How much does it cost?',
    answer:
      'Our pricing varies based on the language, frequency of lessons, and package you choose. We offer monthly subscriptions starting from $79/month for weekly classes. Please check our pricing page for current rates and special promotions.',
  },
  {
    question: 'Can parents observe the lessons?',
    answer:
      'Yes! Parents are welcome to observe lessons, especially for younger children. We believe in transparency and encourage family involvement in the learning process.',
  },
  {
    question: 'Do you offer trial lessons?',
    answer:
      "Absolutely! We offer a complimentary 30-minute trial lesson to new students. This allows you and your child to meet the teacher, experience our teaching style, and ensure it's a good fit before committing.",
  },
  {
    question: 'How do you track progress?',
    answer:
      "We provide regular progress reports and conduct informal assessments to track your child's language development. Parents receive feedback after each class and more comprehensive evaluations quarterly.",
  },
]

const FAQItem = ({ faq, index }: { faq: FAQ; index: number }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      layout
      initial={{ borderRadius: 8 }}
      className='overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all duration-300'
    >
      <motion.button
        layout
        onClick={() => setIsOpen(!isOpen)}
        className='flex w-full items-center justify-between px-6 py-4 text-left'
        whileHover={{ backgroundColor: 'rgba(253, 224, 71, 0.1)' }}
      >
        <motion.h3 className='text-lg font-medium text-gray-900 flex items-center'>
          <motion.span
            className=' h-6 w-6 rounded-full bg-goldyellow-300 text-white flex items-center justify-center mr-3 text-sm font-semibold'
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            {index + 1}
          </motion.span>
          {faq.question}
        </motion.h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className='h-5 w-5 text-goldyellow-500'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </motion.div>
      </motion.button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
          marginBottom: isOpen ? '24px' : '0px',
        }}
        transition={{ duration: 0.3 }}
        className='overflow-hidden px-6'
      >
        <p className='text-gray-600 pb-4 border-t border-gray-100 pt-4'>
          {faq.answer}
        </p>
      </motion.div>
    </motion.div>
  )
}

const FAQ = () => {
  return (
    <div className='mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='text-center'
      >
        <motion.h1
          className='text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className='relative inline-block'>
            Frequently Asked
            <motion.span
              className='absolute -bottom-2 left-0 h-1 bg-goldyellow-300 rounded-full'
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </span>{' '}
          <span className='text-goldyellow-500'>Questions</span>
        </motion.h1>
        <motion.p
          className='mt-4 text-lg text-gray-600'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Find answers to common questions about our teaching methods,
          curriculum, and support.
        </motion.p>
      </motion.div>

      <motion.div
        className='mt-12 space-y-6'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.4 + index * 0.1,
              ease: 'easeOut',
            }}
          >
            <FAQItem faq={faq} index={index} />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className='mt-12 text-center'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className='text-2xl font-semibold text-gray-900'>
          Still have questions?
        </h2>
        <p className='mt-4 text-gray-600'>
          Contact us at{' '}
          <a
            href='mailto:info@monlouisateaches.com'
            className='text-indigo-600 hover:text-indigo-500'
          >
            info@monlouisateaches.com
          </a>
        </p>
      </motion.div>
    </div>
  )
}

export default FAQ
