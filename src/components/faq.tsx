'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface FAQ {
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    question: 'What is Monlouisa Teaches?',
    answer:
      'Monlouisa Teaches is an online platform that offers comprehensive language courses for learners aged 4 and above, focusing on Spanish, French, Chinese, and English.',
  },
  {
    question: 'How long does each class last?',
    answer:
      'Our courses are structured for long-term learning with each class period built to last for just 40 mins, with progressive milestones to track development.',
  },
  {
    question: 'Are there any discounts available?',
    answer:
      'Yes, we offer a 20% discount for siblings and a 20% discount for the first 20 students to enroll.',
  },
  {
    question: 'Are live classes included?',
    answer:
      'Yes, our courses include live, instructor-led sessions to enhance speaking and interaction skills.',
  },
  {
    question: 'What devices can I use to access the courses?',
    answer:
      'Our courses are compatible with laptops, tablets, and smartphones for flexibility and convenience.',
  },
  {
    question: 'How is progress monitored?',
    answer:
      "Progress is tracked through regular quizzes, assignments, and speaking tasks. Parents can also join in during their children's courses as well as access performance reports to monitor their child's growth.",
  },
  {
    question: 'Can adults enroll in these courses?',
    answer:
      'Currently, our programs are specifically designed for learners aged 4–18.',
  },
]

const FAQItem = ({ faq, index }: { faq: FAQ; index: number }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className='border-b border-gray-200 last:border-none'
    >
      <motion.button
        className='flex w-full items-center justify-between py-6 text-left'
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className='text-lg font-semibold text-gray-900'>{faq.question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className='h-5 w-5 text-gray-500' />
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
        className='overflow-hidden'
      >
        <p className='text-gray-600'>{faq.answer}</p>
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
          Frequently Asked Questions
        </motion.h1>
        <motion.p
          className='mt-4 text-lg text-gray-600'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Everything you need to know about Monlouisa Teaches
        </motion.p>
      </motion.div>

      <motion.div
        className='mt-12 divide-y divide-gray-200 rounded-xl bg-white p-6 shadow-lg'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {faqs.map((faq, index) => (
          <FAQItem key={index} faq={faq} index={index} />
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
            href='mailto:support@monlouisateaches.com'
            className='text-indigo-600 hover:text-indigo-500'
          >
            support@monlouisateaches.com
          </a>
        </p>
      </motion.div>
    </div>
  )
}

export default FAQ
