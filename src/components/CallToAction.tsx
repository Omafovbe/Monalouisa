import { MoveRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

function CalltoAction() {
  return (
    <div className='w-full py-20 lg:py-40'>
      <div className='container mx-auto'>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className='flex flex-col text-center bg-muted rounded-md p-4 lg:p-14 gap-8 items-center'
        >
          <div>
            <Badge>Get started</Badge>
          </div>
          <div className='flex flex-col gap-2 space-y-8'>
            <h3 className='text-3xl md:text-5xl tracking-tighter max-w-xl font-m_reg'>
              Ready to unlock your child&#39;s potential?
            </h3>
            <p className='text-2xl leading-relaxed tracking-tight text-muted-foreground max-w-xl'>
              Join{' '}
              <span className='font-m_bold text-goldyellow-700'>
                Monlouisa Teaches
              </span>{' '}
              today and give them the tools to explore the world, one language
              at a time! <br />
              Enroll now to take advantage of our special 20% discounts for
              siblings and the first 20 students. Let’s make language learning
              an unforgettable experience for your child!
            </p>
          </div>
          <div className='flex flex-row gap-4'>
            {/* <Button className='gap-4' variant='outline'>
              Jump on a call <PhoneCall className='w-4 h-4' />
            </Button> */}
            <Button variant='outline' className='gap-4'>
              Sign up here <MoveRight className='w-4 h-4' />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export { CalltoAction }
