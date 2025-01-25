import Image from 'next/image'
import { Badge } from './ui/badge'
import underline from '../../public/underline.svg'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { MoveRight } from 'lucide-react'

export const TeacherFeature = () => {
  return (
    <div className='w-full py-20 lg:py-40'>
      <div className='w-[calc(100%-68px)] max-w-[1320px] mx-auto'>
        <div className='text-center mb-10'>
          <motion.h2
            className='text-2xl font-m_bold md:text-5xl tracking-wide font-regular'
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Join Our Team at Monalouisa Teaches!
          </motion.h2>
          <div className='flex justify-center mt-2'>
            <Image
              className='w-full h-3 max-w-[300px]  fill-goldyellow-700'
              alt='underline'
              src={underline}
            />
          </div>
          <motion.p
            className='text-lg mt-12  leading-relaxed tracking-tight text-muted-foreground'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Are you passionate about education and inspiring young minds? At
            Monlouisa Teaches, we&#39;re shaping the future of language
            learning, and we want YOU to be part of our mission! We&#39;re
            looking for talented, driven, and creative individuals who are ready
            to make a difference. Whether you&#39;re an experienced educator, a
            curriculum designer, or a tech-savvy innovator, there&#39;s a place
            for you on our team.
          </motion.p>
        </div>
        <div className='flex flex-col lg:flex-row gap-6 lg:items-center'>
          <motion.div
            className='bg-muted rounded-2xl overflow-hidden w-full aspect-video h-full flex-1 justify-center'
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Image src='/teacher.jpg' width={600} height={650} alt='teacher' />
          </motion.div>
          <div className='flex gap-4 pl-0 lg:pl-20 flex-col  flex-1'>
            <div>
              <Badge className=' invisible md:visible'>Apply</Badge>
            </div>
            <div className='flex gap-2 flex-col'>
              <h2 className='font-m_bold text-3xl'>Why Work With Us?</h2>
              <ul className='list-disc list-outside pl-5 text-lg'>
                <li>Make a global impact by empowering learners aged 4–18.</li>
                <li>Collaborate with a dynamic and passionate team.</li>
                <li>Enjoy a flexible, remote-friendly work environment.</li>
                <li>
                  Grow your career with exciting opportunities for professional
                  development.
                </li>
              </ul>
              <Button size='lg' className='gap-4 w-36 mt-4 bg-goldyellow-500'>
                Sign up here <MoveRight className='w-4 h-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
