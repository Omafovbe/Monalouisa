'use client'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { QuoteIcon } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Khalid.',
    role: 'Parent of Nada, Age 17',
    text: 'لقد أحرزت ابنتي تقدمًا مذهلاً في اللغة الإنجليزية. المعلمون صبورون ويجعلون التعلم ممتعًا. إنها تتطلع إلى كل حصة!',
    image: '/avatars/sarah.jpg',
    initials: 'SK',
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
    name: 'Adrien D.',
    role: 'Engineer',
    text: 'Having both my children learn Chinese together has been amazing. The teachers handle different learning paces beautifully.',
    image: '/avatars/adrien.jpg',
    initials: 'AD',
  },
  {
    id: 4,
    name: 'Mohammed Khalid.',
    role: 'Business Owner',
    text: 'كان برنامج اللغة الإنجليزية المتقدم مثاليًا لابني المراهق. العناصر الثقافية المُدرجة في الدروس تجعله أكثر تشويقًا.',
    image: '/avatars/robert.jpg',
    initials: 'RP',
  },
  {
    id: 5,
    name: 'Leena M.',
    role: 'Parent of Yasmin, Age 10',
    text: "The flexibility of online classes and the quality of teaching is outstanding. We've tried other platforms but this is by far the best.",
    image: '/avatars/lisa.jpg',
    initials: 'LM',
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
