'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { EnrolledSubjects } from '@/components/dashboard/enrolled-subjects'
import { AvailableSubjects } from '@/components/dashboard/available-subjects'
import { Spinner } from '@/components/ui/spinner'
import { getSubscription } from '@/actions/stripe-actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getEnrolledSubjectIds } from '@/actions/subject-actions'

export default function SubjectsPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('enrolled')

  // Get the student's subscription status
  const { data: subscriptionData, isLoading: isLoadingSubscription } = useQuery(
    {
      queryKey: ['subscription', session?.user?.id],
      queryFn: () =>
        session?.user?.id ? getSubscription(session.user.id) : null,
      enabled: !!session?.user?.id,
    }
  )

  // Get the student's enrolled subject IDs
  const { data: enrolledSubjectIds, isLoading: isLoadingEnrolledIds } =
    useQuery({
      queryKey: ['enrolled-subject-ids', session?.user?.id],
      queryFn: () =>
        session?.user?.id ? getEnrolledSubjectIds(session.user.id) : [],
      enabled: !!session?.user?.id,
    })

  const isLoading = isLoadingSubscription || isLoadingEnrolledIds
  const hasActiveSubscription =
    subscriptionData?.status === 'HAS_SUBSCRIPTION' &&
    subscriptionData.subscription?.status === 'active'

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <Spinner size={32} />
      </div>
    )
  }

  return (
    <div className='container mx-auto p-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>My Subjects</h1>
        <p className='text-muted-foreground'>
          View and manage your enrolled subjects or discover new ones
        </p>
      </div>

      {!hasActiveSubscription && (
        <Alert variant='warning' className='mb-6'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Subscription Required</AlertTitle>
          <AlertDescription>
            You need an active subscription to enroll in subjects.
            <Button
              asChild
              variant='link'
              className='p-0 h-auto font-normal ml-2'
            >
              <Link href='/student/payments'>Upgrade Now</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className='space-y-4'
      >
        <TabsList>
          <TabsTrigger value='enrolled'>Enrolled Subjects</TabsTrigger>
          <TabsTrigger value='available'>Available Subjects</TabsTrigger>
        </TabsList>

        <TabsContent value='enrolled' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>My Enrolled Subjects</CardTitle>
              <CardDescription>
                Subjects you are currently enrolled in
              </CardDescription>
            </CardHeader>
            <CardContent>
              {session?.user?.id && (
                <EnrolledSubjects studentId={session.user.id} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='available' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Available Subjects</CardTitle>
              <CardDescription>
                Discover new subjects to enroll in
              </CardDescription>
            </CardHeader>
            <CardContent>
              {session?.user?.id && (
                <AvailableSubjects
                  studentId={session.user.id}
                  enrolledSubjectIds={enrolledSubjectIds || []}
                  hasActiveSubscription={hasActiveSubscription}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
