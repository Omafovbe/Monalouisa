'use client'
import { PageHeader } from '@/components/page-header'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { submitTeacherApplication } from '@/actions/actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
// import Navbar from '../Navbar'
// import Footer from '../footer2'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  qualifications: z.string().min(10, 'Please provide detailed qualifications'),
  yearsOfExperience: z
    .number()
    .min(2, 'Minimum 2 years of experience required'),
  preferredAgeGroup: z.string().min(1, 'Please select preferred age group'),
  teachingStyle: z.string().min(50, 'Please provide a detailed description'),
  videoUrl: z.string().url('Please provide a valid video URL'),
})

export function TeachPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      qualifications: '',
      yearsOfExperience: 2,
      preferredAgeGroup: '',
      teachingStyle: '',
      videoUrl: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      const result = await submitTeacherApplication(values)

      if (result.success) {
        toast({
          title: 'Application Submitted!',
          description:
            'We will review your application and get back to you soon.',
          variant: 'default',
        })
        // Redirect to success page after 2 seconds
        setTimeout(() => {
          router.push('/teach/success')
        }, 2000)
      } else {
        toast({
          title: 'Submission Failed',
          description: result.error || 'Please try again later.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen mx-auto bg-gradient-to-b from-gray-50 to-white'>
      <PageHeader title='Teach With Us' breadcrumbs={[{ label: 'Teach' }]} />

      <section className='w-[calc(100%-68px)] max-w-[1320px] mx-auto px-4 py-20'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='max-w-4xl mx-auto space-y-8'
        >
          <div className='space-y-4'>
            <h2 className='text-2xl font-bold'>Requirements for Tutors</h2>
            <div className='space-y-2'>
              {[
                'A degree in English, Education, or a related field (or equivalent teaching certification)',
                'Minimum of 2 years teaching experience (online or offline)',
                'Strong command of the English language, both written and spoken',
                'Passion for teaching and engaging students of different age groups',
                'Familiarity with online teaching tools and methods',
                'A stable internet connection and a quiet teaching environment',
                'Submission of a 1-minute video presentation introducing yourself',
              ].map((requirement, index) => (
                <div key={index} className='flex items-start gap-2'>
                  <span className='text-goldyellow-600 mt-1'>•</span>
                  <span className='text-gray-600'>{requirement}</span>
                </div>
              ))}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type='email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='qualifications'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualifications</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder='Detail your educational background and certifications'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='yearsOfExperience'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='preferredAgeGroup'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Age Group</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='e.g., 4-8, 9-12, 13-18' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='teachingStyle'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teaching Style Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder='Describe your teaching approach and methodology'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='videoUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Presentation URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='Link to your 1-minute introduction video'
                      />
                    </FormControl>
                    <FormDescription>
                      Please upload your video to a platform like YouTube or
                      Vimeo and provide the link
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full' disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </Form>
        </motion.div>
      </section>
    </div>
  )
}
