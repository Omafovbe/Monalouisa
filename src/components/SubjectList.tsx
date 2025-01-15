'use client'

import { motion } from 'framer-motion'
import { BookOpen, Globe2, Languages } from 'lucide-react'
import Image from 'next/image'

const subjects = [
  {
    name: 'English',
    icon: BookOpen,
    color: 'bg-blue-100',
    iconColor: 'text-blue-500',
    description: 'Master the global language of business and culture',
  },
  {
    name: 'French',
    icon: Globe2,
    color: 'bg-red-100',
    iconColor: 'text-red-500',
    description: 'Discover the language of diplomacy and arts',
  },
  {
    name: 'Arabic',
    icon: Languages,
    color: 'bg-emerald-100',
    iconColor: 'text-emerald-500',
    description: "Learn one of the world's oldest written languages",
  },
  {
    name: 'Chinese',
    icon: Languages,
    color: 'bg-amber-100',
    iconColor: 'text-amber-500',
    description: 'Explore the most spoken language in the world',
  },
  {
    name: 'Japanese',
    icon: Languages,
    color: 'bg-pink-100',
    iconColor: 'text-pink-500',
    description: 'Immerse in the language of innovation and tradition',
  },
  {
    name: 'Spanish',
    isImage: true,
    imageSrc: '/spanish.png',
    icon: Globe2,
    color: 'bg-orange-100',
    iconColor: 'text-orange-500',
    description: 'Connect with 500 million Spanish speakers worldwide',
  },
]

const SubjectList = () => {
  return (
    <div className='bg-white py-24'>
      <div className='container mx-auto px-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-center mb-16'
        >
          <h2 className='text-3xl font-bold'>Our Subjects</h2>
          <p className='mt-4 text-gray-600'>
            Explore our wide range of subjects taught by expert teachers
          </p>
        </motion.div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className='group cursor-pointer'
            >
              <div
                className={`rounded-xl p-6 ${subject.color} transition-all duration-300 group-hover:shadow-xl`}
              >
                <div className='flex items-start space-x-4'>
                  <div className='p-3 '>
                    {subject.isImage ? (
                      <Image
                        src={subject.imageSrc}
                        alt={subject.name}
                        width={64}
                        height={64}
                        className='w-14 h-14 object-contain'
                      />
                    ) : (
                      <subject.icon
                        className={`w-10 h-10 ${subject.iconColor}`}
                      />
                    )}
                  </div>
                  <div>
                    <h3 className='font-semibold text-lg'>{subject.name}</h3>
                    <p className='text-gray-600 mt-1'>{subject.description}</p>
                  </div>
                </div>
                <motion.div
                  initial={{ width: '0%' }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                  className='h-1 bg-amber-500 mt-4 rounded'
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SubjectList
