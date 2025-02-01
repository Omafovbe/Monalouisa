'use client'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { QuoteIcon } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Sarah M.',
    role: 'Parent of Emma, Age 8',
    text: 'My daughter has made incredible progress in Spanish. The teachers are patient and make learning fun. She looks forward to every class!',
    image: '/avatars/sarah.jpg',
    initials: 'SM',
  },
  {
    id: 2,
    name: 'David O.',
    role: 'Parent of James, Age 12',
    text: 'The structured curriculum and interactive sessions have helped my son develop confidence in speaking French. The progress tracking is excellent!',
    image: '/avatars/david.jpg',
    initials: 'DO',
  },
  {
    id: 3,
    name: 'Michelle K.',
    role: 'Parent of Twins, Age 6',
    text: 'Having both my children learn Chinese together has been amazing. The teachers handle different learning paces beautifully.',
    image: '/avatars/michelle.jpg',
    initials: 'MK',
  },
  {
    id: 4,
    name: 'Robert P.',
    role: 'Parent of Alex, Age 15',
    text: 'The advanced English program has been perfect for my teenager. The cultural elements included in lessons make it more engaging.',
    image: '/avatars/robert.jpg',
    initials: 'RP',
  },
  {
    id: 5,
    name: 'Lisa T.',
    role: 'Parent of Sophie, Age 10',
    text: "The flexibility of online classes and the quality of teaching is outstanding. We've tried other platforms but this is by far the best.",
    image: '/avatars/lisa.jpg',
    initials: 'LT',
  },
]

export function Testimonials() {
  return (
    <section className='w-full overflow-x-hidden py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center mb-12'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'
          >
            What Parents Are Saying
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='max-w-[600px] text-gray-500 md:text-xl/relaxed'
          >
            Join hundreds of satisfied parents who have transformed their
            children&#39;s language learning journey
          </motion.p>
        </div>

        <motion.div
          className='flex gap-10'
          animate={{
            x: [0, -1500],
            transition: {
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 25,
                ease: 'linear',
              },
            },
          }}
        >
          {[...testimonials, ...testimonials].map((testimonial, idx) => (
            <Card
              key={idx}
              className='w-[400px] flex-shrink-0 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300'
            >
              <CardContent className='p-6'>
                <QuoteIcon className='h-8 w-8 text-goldyellow-500 mb-4' />
                <p className='text-gray-700 text-lg mb-6 italic leading-relaxed'>
                  &#34;{testimonial.text}&#34;
                </p>
                <div className='flex items-center gap-4'>
                  <Avatar>
                    <AvatarImage
                      src={testimonial.image}
                      alt={testimonial.name}
                    />
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className='font-semibold text-gray-900'>
                      {testimonial.name}
                    </h4>
                    <p className='text-sm text-gray-500'>{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
