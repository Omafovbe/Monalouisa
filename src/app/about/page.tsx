'use client'
import { CalltoAction } from '@/components/CallToAction'
import Navbar from '@/components/Navbar'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className='min-h-screen mx-auto bg-gradient-to-b from-gray-50 to-white'>
      <Navbar />
      {/* Hero Section */}
      <section className='relative h-[60vh] -top-16 flex items-center justify-center'>
        <div className='absolute inset-0 bg-gradient-to-r from-goldyellow-500 to-goldyellow-700'>
          {/* <Image
            src='/about-hero.jpg'
            alt='Italian craftsmanship'
            fill
            className='object-cover'
          /> */}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='relative z-10 text-center'
        >
          <h1 className='text-5xl md:text-7xl font-bold text-white mb-6 font-playfair'>
            About Us
          </h1>
          {/* <p className='text-xl md:text-2xl text-gold-300 max-w-2xl mx-auto font-light'>
            Where Tradition Meets Contemporary Design
          </p> */}
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className='w-[calc(100%-68px)] max-w-[1320px] mx-auto px-4 py-20'>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className='max-w-4xl mx-auto text-center mb-20'
        >
          <h2 className='text-4xl font-m_bold mb-8 text-gray-900 font-merriweather'>
            Who we Are
          </h2>
          <p className='text-xl md:text-2xl text-gray-600 leading-relaxed font-m_reg'>
            Welcome to <strong>Monalouisa Teaches</strong>, where language
            learning is more than just mastering words—it’s about discovering
            new cultures, forming meaningful connections, and unlocking endless
            opportunities
          </p>
        </motion.div>

        <div className='grid md:grid-cols-2 gap-10 items-center'>
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className='p-8 bg-white text-center rounded-xl shadow-lg border border-gray-100'
          >
            <h3 className='text-4xl font-m_bold text-gold-600 mb-4'>
              Our Mission
            </h3>
            <p className='text-gray-500 text-lg'>
              We are dedicated to empowering children and teenagers aged 4–18 to
              communicate confidently in multiple languages. By providing
              expert-designed courses in Spanish, French, Chinese, and English,
              we aim to make language learning a fun and enriching journey that
              fosters both confidence and cultural awareness.
            </p>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='p-8 bg-white text-center rounded-xl shadow-lg border border-gray-100'
          >
            <h3 className='text-4xl font-m_bold text-gold-600 mb-4'>
              Our Approach
            </h3>
            <p className='text-gray-500 text-center text-lg'>
              Every child is unique, and so is their learning journey. That’s
              why our courses are structured into Beginner, Intermediate, and
              Advanced levels. This personalized approach ensures that learners
              progress at their own pace, building foundational skills and
              advancing toward fluency seamlessly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Materials Section */}
      <section className=' bg-goldyellow-100  px-4 py-36'>
        <div className='w-[calc(100%-68px)] max-w-[1320px] px-4 mx-auto'>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className='grid lg:grid-cols-3 gap-14 place-items-center'
          >
            <div className=' font-m_bold overflow-hidden text-7xl justify-center'>
              <h3>What Makes Us Different</h3>
            </div>
            <div className='lg:col-span-2 font-m_reg pl-4'>
              {/* <h2 className='text-4xl font-bold mb-8 text-gray-900'>
                Curated Excellence
              </h2> */}
              <p className='text-2xl text-goldyellow-600 mb-8'>
                At Monalouisa Teaches, we believe in making learning engaging
                and effective. Here&#39;s what sets us apart:
              </p>

              <motion.ul
                className='space-y-6'
                initial='hidden'
                whileInView='visible'
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 },
                  },
                }}
              >
                {[
                  'Interactive Learning: Live classes, multimedia resources, and fun activities to keep students engaged.',
                  'Cultural Exploration: Lessons go beyond language, helping students understand and appreciate the culture behind it.',
                  'Affordability and Inclusivity: With sibling discounts and early enrollment savings, we strive to make quality education accessible for every family.',
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    variants={{
                      hidden: { x: -20, opacity: 0 },
                      visible: { x: 0, opacity: 1 },
                    }}
                    className='flex items-center text-lg text-goldyellow-700'
                  >
                    <svg
                      className='w-6 h-6 text-gold-500 mr-3'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={3}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className=' bg-goldyellow-600  px-4 py-36'>
        <div className='flex flex-col text-center space-y-10'>
          <h2 className='text-5xl text-goldyellow-100 font-m_bold'>
            Our Impact
          </h2>
          <p className='text-2xl max-w-4xl mx-auto text-white font-m_reg font-semibold'>
            We go beyond teaching language basics—we prepare students to use
            their skills in real-life situations. From confidently traveling
            abroad to forming friendships with people from different cultures,
            our students are equipped to thrive in a globally connected world.
          </p>
        </div>
      </section>
      {/* <section className='container mx-auto px-4 py-20'>
        <div className='max-w-5xl mx-auto text-center'>
          <motion.h2
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className='text-5xl font-bold mb-12 text-gray-900 font-playfair'
          >
            The 40 Colori Difference
          </motion.h2>

          <div className='grid md:grid-cols-3 gap-8'>
            {[
              {
                title: 'Hours Crafting',
                value: '8500+',
                desc: 'Dedicated to perfection',
              },
              {
                title: 'Natural Fibers',
                value: '100%',
                desc: 'Ethically sourced',
              },
              { title: 'Artisans', value: '8', desc: 'Master craftsmen' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className='p-8 bg-white rounded-xl shadow-lg border border-gray-100'
              >
                <div className='text-4xl font-bold text-gold-600 mb-4'>
                  {item.value}
                </div>
                <h3 className='text-xl font-semibold mb-2'>{item.title}</h3>
                <p className='text-gray-600'>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}
      <CalltoAction />
    </div>
  )
}
