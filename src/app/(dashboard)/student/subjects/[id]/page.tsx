'use client'

import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  ArrowLeft,
  FileText,
  Users,
  MessageSquare,
  AlertCircle,
} from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { getSubjectDetails } from '@/actions/subject-actions'
import { getSubscription } from '@/actions/stripe-actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'

interface ClassSession {
  id: number
  title: string
  startTime: string | Date
  endTime: string | Date
}

interface Material {
  id: number
  title: string
  type: string
  createdAt: string | Date
}

interface Discussion {
  id: number
  title: string
  messageCount: number
  lastMessage: string
  updatedAt: string | Date
}

// interface Teacher {
//   id: number
//   name: string
//   profilePicture?: string
//   bio?: string
// }

export default function SubjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const subjectId = Number(params.id)
  const { toast } = useToast()

  const { data, isLoading, error } = useQuery({
    queryKey: ['subject-details', subjectId, session?.user?.id],
    queryFn: () =>
      session?.user?.id ? getSubjectDetails(subjectId, session.user.id) : null,
    enabled: !!session?.user?.id && !isNaN(subjectId),
  })

  const { data: subscriptionData, isLoading: isLoadingSubscription } = useQuery(
    {
      queryKey: ['subscription', session?.user?.id],
      queryFn: () =>
        session?.user?.id ? getSubscription(session.user.id) : null,
      enabled: !!session?.user?.id,
    }
  )

  const hasActiveSubscription =
    subscriptionData?.status === 'HAS_SUBSCRIPTION' &&
    subscriptionData.subscription?.status === 'active'

  const handleActionRequiringSubscription = () => {
    if (!hasActiveSubscription) {
      toast({
        title: 'Subscription Required',
        description: 'You need an active subscription to access this feature.',
        variant: 'destructive',
      })
      return false
    }
    return true
  }

  if (isLoading || isLoadingSubscription) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <Spinner size={32} />
      </div>
    )
  }

  if (error || !data?.subject) {
    return (
      <div className='container mx-auto p-6'>
        <Button
          variant='ghost'
          onClick={() => router.back()}
          className='mb-6 hover:bg-gray-100 dark:hover:bg-gray-800'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Subjects
        </Button>

        {!hasActiveSubscription && (
          <Alert variant='warning' className='mb-6'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Subscription Required</AlertTitle>
            <AlertDescription className='flex items-center gap-2'>
              <span>
                You need an active subscription to access all features.
              </span>
              <Button asChild variant='link' className='p-0 h-auto font-normal'>
                <Link href='/student/payments'>Upgrade Now</Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardContent className='pt-6 text-center'>
            <div className='text-red-500 mb-4'>
              {error instanceof Error
                ? error.message
                : 'Failed to load subject details'}
            </div>
            <Button asChild className='hover:bg-primary-foreground'>
              <Link href='/student/subjects'>View All Subjects</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { subject } = data

  return (
    <div className='container mx-auto p-6'>
      <Button
        variant='ghost'
        onClick={() => router.back()}
        className='mb-6 hover:bg-gray-100 dark:hover:bg-gray-800'
      >
        <ArrowLeft className='mr-2 h-4 w-4' />
        Back to Subjects
      </Button>

      {!hasActiveSubscription && (
        <Alert variant='warning' className='mb-6'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Subscription Required</AlertTitle>
          <AlertDescription className='flex items-center gap-2'>
            <span>You need an active subscription to access all features.</span>
            <Button asChild variant='link' className='p-0 h-auto font-normal'>
              <Link href='/student/payments'>Upgrade Now</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className='grid gap-6 md:grid-cols-3'>
        {/* Main Subject Info */}
        <div className='md:col-span-2 space-y-6'>
          <Card>
            <CardHeader className='bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950'>
              <div className='flex justify-between items-start'>
                <CardTitle className='flex items-center gap-2 text-2xl'>
                  <BookOpen className='h-6 w-6 text-emerald-600 dark:text-emerald-400' />
                  {subject.name}
                </CardTitle>
                <Badge
                  variant='outline'
                  className='bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                >
                  Enrolled
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='pt-6'>
              <div className='prose dark:prose-invert max-w-none'>
                <p>{subject.description || 'No description available.'}</p>
              </div>

              <div className='grid grid-cols-2 gap-4 mt-6'>
                <div className='flex items-center'>
                  <Calendar className='h-5 w-5 mr-2 text-muted-foreground' />
                  <span>
                    Enrolled:{' '}
                    {format(new Date(subject.enrolledAt), 'MMM d, yyyy')}
                  </span>
                </div>

                <div className='flex items-center'>
                  <Clock className='h-5 w-5 mr-2 text-muted-foreground' />
                  <span>Classes: {subject.classCount || 0} total</span>
                </div>

                <div className='flex items-center'>
                  <Users className='h-5 w-5 mr-2 text-muted-foreground' />
                  <span>Students: {subject.studentCount || 0} enrolled</span>
                </div>

                <div className='flex items-center'>
                  <FileText className='h-5 w-5 mr-2 text-muted-foreground' />
                  <span>Materials: {subject.materialCount || 0} available</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue='schedule' className='space-y-4'>
            <TabsList>
              <TabsTrigger value='schedule'>Schedule</TabsTrigger>
              <TabsTrigger value='materials'>Materials</TabsTrigger>
              <TabsTrigger value='discussions'>Discussions</TabsTrigger>
            </TabsList>

            <TabsContent value='schedule' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Classes</CardTitle>
                </CardHeader>
                <CardContent>
                  {subject.upcomingClasses &&
                  subject.upcomingClasses.length > 0 ? (
                    <div className='space-y-4'>
                      {subject.upcomingClasses.map(
                        (classItem: ClassSession) => (
                          <div
                            key={classItem.id}
                            className='flex items-center justify-between p-4 border rounded-lg'
                          >
                            <div>
                              <h4 className='font-medium'>
                                {classItem.title || 'Class Session'}
                              </h4>
                              <div className='text-sm text-muted-foreground'>
                                {format(
                                  new Date(classItem.startTime),
                                  'EEEE, MMMM d, yyyy'
                                )}
                              </div>
                              <div className='text-sm text-muted-foreground'>
                                {format(
                                  new Date(classItem.startTime),
                                  'h:mm a'
                                )}{' '}
                                -{' '}
                                {format(new Date(classItem.endTime), 'h:mm a')}
                              </div>
                            </div>
                            <Button
                              variant='outline'
                              size='sm'
                              className='hover:bg-gray-100 dark:hover:bg-gray-800'
                              onClick={() =>
                                handleActionRequiringSubscription()
                              }
                              disabled={!hasActiveSubscription}
                            >
                              {hasActiveSubscription
                                ? 'Join Class'
                                : 'Subscription Required'}
                            </Button>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className='text-center py-6 text-muted-foreground'>
                      No upcoming classes scheduled
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='materials' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle>Learning Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  {subject.materials && subject.materials.length > 0 ? (
                    <div className='space-y-4'>
                      {subject.materials.map((material: Material) => (
                        <div
                          key={material.id}
                          className='flex items-center justify-between p-4 border rounded-lg'
                        >
                          <div className='flex items-center'>
                            <FileText className='h-5 w-5 mr-3 text-blue-500' />
                            <div>
                              <h4 className='font-medium'>{material.title}</h4>
                              <div className='text-sm text-muted-foreground'>
                                {material.type} • Added{' '}
                                {format(
                                  new Date(material.createdAt),
                                  'MMM d, yyyy'
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant='outline'
                            size='sm'
                            className='hover:bg-gray-100 dark:hover:bg-gray-800'
                            onClick={() => handleActionRequiringSubscription()}
                            disabled={!hasActiveSubscription}
                          >
                            {hasActiveSubscription
                              ? 'Download'
                              : 'Subscription Required'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='text-center py-6 text-muted-foreground'>
                      No materials available yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='discussions' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle>Class Discussions</CardTitle>
                </CardHeader>
                <CardContent>
                  {subject.discussions && subject.discussions.length > 0 ? (
                    <div className='space-y-4'>
                      {subject.discussions.map((discussion: Discussion) => (
                        <div
                          key={discussion.id}
                          className='p-4 border rounded-lg'
                        >
                          <div className='flex items-center justify-between mb-3'>
                            <h4 className='font-medium'>{discussion.title}</h4>
                            <Badge variant='outline'>
                              {discussion.messageCount} messages
                            </Badge>
                          </div>
                          <p className='text-sm text-muted-foreground mb-3'>
                            Last message: {discussion.lastMessage}
                          </p>
                          <div className='flex justify-between items-center'>
                            <div className='text-xs text-muted-foreground'>
                              Updated:{' '}
                              {format(
                                new Date(discussion.updatedAt),
                                'MMM d, yyyy'
                              )}
                            </div>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() =>
                                handleActionRequiringSubscription()
                              }
                              disabled={!hasActiveSubscription}
                            >
                              <MessageSquare className='h-4 w-4 mr-2' />
                              {hasActiveSubscription
                                ? 'View Discussion'
                                : 'Subscription Required'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='text-center py-6 text-muted-foreground'>
                      No discussions available yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Teacher Info */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Your Teacher</CardTitle>
            </CardHeader>
            <CardContent>
              {subject.teachers && subject.teachers.length > 0 ? (
                <div className='flex flex-col items-center text-center'>
                  <Avatar className='h-24 w-24 mb-4'>
                    <AvatarImage
                      src={subject.teachers[0].profilePicture || ''}
                      alt={subject.teachers[0].name}
                    />
                    <AvatarFallback className='text-lg'>
                      {subject.teachers[0].name?.charAt(0) || 'T'}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className='font-medium text-lg'>
                    {subject.teachers[0].name}
                  </h3>
                  <p className='text-sm text-muted-foreground mb-4'>
                    {subject.teachers[0].bio || 'No bio available'}
                  </p>
                  <Button
                    className='w-full hover:bg-primary-foreground'
                    onClick={() => handleActionRequiringSubscription()}
                    disabled={!hasActiveSubscription}
                  >
                    <MessageSquare className='h-4 w-4 mr-2' />
                    {hasActiveSubscription
                      ? 'Message Teacher'
                      : 'Subscription Required'}
                  </Button>
                </div>
              ) : (
                <div className='text-center py-4 text-muted-foreground'>
                  <GraduationCap className='h-12 w-12 mx-auto mb-2 text-muted-foreground/50' />
                  No teacher assigned yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <Button
                variant='outline'
                className='w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800'
                onClick={() => handleActionRequiringSubscription()}
                disabled={!hasActiveSubscription}
              >
                <Calendar className='h-4 w-4 mr-2' />
                {hasActiveSubscription
                  ? 'View Full Schedule'
                  : 'Subscription Required'}
              </Button>
              <Button
                variant='outline'
                className='w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800'
                onClick={() => handleActionRequiringSubscription()}
                disabled={!hasActiveSubscription}
              >
                <FileText className='h-4 w-4 mr-2' />
                {hasActiveSubscription
                  ? 'Submit Assignment'
                  : 'Subscription Required'}
              </Button>
              <Button
                variant='outline'
                className='w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800'
                onClick={() => handleActionRequiringSubscription()}
                disabled={!hasActiveSubscription}
              >
                <MessageSquare className='h-4 w-4 mr-2' />
                {hasActiveSubscription
                  ? 'Start Discussion'
                  : 'Subscription Required'}
              </Button>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div>
                  <div className='flex justify-between mb-1 text-sm'>
                    <span>Attendance</span>
                    <span className='font-medium'>
                      {subject.progress?.attendance || 0}%
                    </span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div
                      className='bg-green-500 h-2 rounded-full'
                      style={{ width: `${subject.progress?.attendance || 0}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className='flex justify-between mb-1 text-sm'>
                    <span>Assignments</span>
                    <span className='font-medium'>
                      {subject.progress?.assignments || 0}%
                    </span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div
                      className='bg-blue-500 h-2 rounded-full'
                      style={{
                        width: `${subject.progress?.assignments || 0}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className='flex justify-between mb-1 text-sm'>
                    <span>Overall</span>
                    <span className='font-medium'>
                      {subject.progress?.overall || 0}%
                    </span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div
                      className='bg-purple-500 h-2 rounded-full'
                      style={{ width: `${subject.progress?.overall || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
