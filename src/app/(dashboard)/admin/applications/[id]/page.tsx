'use client'

import { getTeacherApplication } from '@/action/actions'
import { useQuery } from '@tanstack/react-query'
import { Spinner } from '@/components/ui/spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ApplicationActions } from './application-actions'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use } from 'react'

export default function ApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const resolvedParams = use(params)

  const { data, isLoading } = useQuery({
    queryKey: ['application', parseInt(resolvedParams.id)],
    queryFn: () => getTeacherApplication(parseInt(resolvedParams.id)),
  })

  if (isLoading) {
    return (
      <div className='h-[calc(100vh-4rem)] flex items-center justify-center'>
        <Spinner size={32} variant='primary' />
      </div>
    )
  }

  if (!data?.application) {
    return <div>Application not found</div>
  }

  const application = data.application

  return (
    <div className='p-6 space-y-6'>
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => router.push('/admin/applications')}
          className='flex items-center gap-2'
        >
          <ChevronLeft className='h-4 w-4' />
          Back to Applications
        </Button>
      </div>

      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Application Details</h1>
        <ApplicationActions
          applicationId={application.id}
          currentStatus={application.status}
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <h3 className='font-semibold'>Name</h3>
              <p>{application.name}</p>
            </div>
            <div>
              <h3 className='font-semibold'>Email</h3>
              <p>{application.email}</p>
            </div>
            <div>
              <h3 className='font-semibold'>Phone</h3>
              <p>{application.phone}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <h3 className='font-semibold'>Years of Experience</h3>
              <p>{application.yearsOfExperience} years</p>
            </div>
            <div>
              <h3 className='font-semibold'>Preferred Age Group</h3>
              <p>{application.preferredAgeGroup}</p>
            </div>
          </CardContent>
        </Card>

        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle>Qualifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='whitespace-pre-wrap'>{application.qualifications}</p>
          </CardContent>
        </Card>

        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle>Teaching Style</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='whitespace-pre-wrap'>{application.teachingStyle}</p>
          </CardContent>
        </Card>

        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle>Video Presentation</CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href={application.videoUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline'
            >
              View Video Presentation
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
