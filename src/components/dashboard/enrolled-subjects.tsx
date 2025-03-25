'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { BookOpen, Calendar, Clock, GraduationCap, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import {
  getEnrolledSubjects,
  unenrollFromSubject,
} from '@/actions/subject-actions'

interface EnrolledSubjectsProps {
  studentId: string
}

// Define the type for enrolled subjects
interface EnrolledSubject {
  id: number
  name: string
  description: string | null
  enrolledAt: string | Date
  teachers?: { id: number; name: string }[]
  nextClass?: { startTime: string | Date; endTime: string | Date } | null
}

export function EnrolledSubjects({ studentId }: EnrolledSubjectsProps) {
  const [expandedSubject, setExpandedSubject] = useState<number | null>(null)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['enrolled-subjects', studentId],
    queryFn: () => getEnrolledSubjects(studentId),
    enabled: !!studentId,
  })

  const unenrollMutation = useMutation({
    mutationFn: (subjectId: number) =>
      unenrollFromSubject(studentId, subjectId),
    onSuccess: (result) => {
      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'Success',
        description: 'Successfully unenrolled from subject',
      })
      queryClient.invalidateQueries({ queryKey: ['enrolled-subjects'] })
      queryClient.invalidateQueries({ queryKey: ['enrolled-subject-ids'] })
      queryClient.invalidateQueries({ queryKey: ['available-subjects'] })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to unenroll from subject',
        variant: 'destructive',
      })
    },
  })

  const handleUnenroll = (subjectId: number) => {
    if (confirm('Are you sure you want to unenroll from this subject?')) {
      unenrollMutation.mutate(subjectId)
    }
  }

  if (isLoading) {
    return (
      <div className='flex justify-center p-8'>
        <Spinner size={32} />
      </div>
    )
  }

  if (error) {
    return (
      <div className='p-4 text-red-500'>
        Error loading enrolled subjects:{' '}
        {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    )
  }

  const enrolledSubjects = data?.subjects || []

  if (enrolledSubjects.length === 0) {
    return (
      <Card className='border-dashed'>
        <CardContent className='pt-6 text-center'>
          <BookOpen className='mx-auto h-12 w-12 text-muted-foreground/50' />
          <h3 className='mt-3 text-lg font-semibold'>No Enrolled Subjects</h3>
          <p className='text-sm text-muted-foreground'>
            You haven&apos;t enrolled in any subjects yet.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {enrolledSubjects.map((subject: EnrolledSubject) => (
        <Card
          key={subject.id}
          className='overflow-hidden transition-all hover:shadow-md'
        >
          <CardHeader className='bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950'>
            <div className='flex justify-between items-start'>
              <CardTitle className='flex items-center gap-2'>
                <BookOpen className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
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
          <CardContent className='pt-6 space-y-4'>
            <p className='text-sm text-muted-foreground'>
              {subject.description || 'No description available.'}
            </p>

            <div className='space-y-2'>
              <div className='flex items-center text-sm'>
                <Calendar className='h-4 w-4 mr-2 text-muted-foreground' />
                <span>
                  Enrolled:{' '}
                  {format(new Date(subject.enrolledAt), 'MMM d, yyyy')}
                </span>
              </div>

              {subject.teachers && subject.teachers.length > 0 && (
                <div className='flex items-center text-sm'>
                  <GraduationCap className='h-4 w-4 mr-2 text-muted-foreground' />
                  <span>Teacher: {subject.teachers[0].name}</span>
                </div>
              )}

              {subject.nextClass && (
                <div className='flex items-center text-sm'>
                  <Clock className='h-4 w-4 mr-2 text-muted-foreground' />
                  <span>
                    Next Class:{' '}
                    {format(
                      new Date(subject.nextClass.startTime),
                      'MMM d, h:mm a'
                    )}
                  </span>
                </div>
              )}
            </div>

            {expandedSubject === subject.id && subject.description && (
              <p className='mt-2 text-sm text-muted-foreground'>
                {subject.description}
              </p>
            )}
            {subject.description && subject.description.length > 150 && (
              <button
                onClick={() =>
                  setExpandedSubject(
                    expandedSubject === subject.id ? null : subject.id
                  )
                }
                className='mt-2 text-xs text-emerald-600 hover:underline dark:text-emerald-400'
              >
                {expandedSubject === subject.id ? 'Show less' : 'Read more'}
              </button>
            )}
          </CardContent>
          <CardFooter className='bg-gray-50 dark:bg-gray-900 justify-between'>
            <Button
              variant='outline'
              className='w-full hover:bg-gray-100 dark:hover:bg-gray-800'
              onClick={() =>
                (window.location.href = `/student/subjects/${subject.id}`)
              }
            >
              View Details
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30'
              onClick={() => handleUnenroll(subject.id)}
              disabled={unenrollMutation.isPending}
            >
              {unenrollMutation.isPending &&
              unenrollMutation.variables === subject.id ? (
                <Spinner size={16} />
              ) : (
                <X className='h-4 w-4' />
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
