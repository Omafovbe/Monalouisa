'use client'
// import { SignOutButton } from '@/components/auth/SignOutBtn'
import { OverviewCards } from '@/components/dashboard/overview-cards'

import { StudentProgress } from '@/components/dashboard/student-progress'
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { ScheduleTable } from '@/components/dashboard/schedule-table'
import { useQuery } from '@tanstack/react-query'
import { getTeacherStudents } from '@/action/actions'
import { useSession } from 'next-auth/react'

import { useToast } from '@/hooks/use-toast'
import { useEffect } from 'react'

// export const metadata: Metadata = {
//   title: 'Teacher Dashboard',
//   description: 'teacher dashboard for an EdTech platform',
// }

const TeacherDashboard = () => {
  const { data: session } = useSession()
  const { toast } = useToast()

  const { data, error } = useQuery({
    queryKey: ['teacher-students', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null
      return getTeacherStudents(session.user.id)
    },
    enabled: !!session?.user?.id,
  })

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load your students',
        variant: 'destructive',
      })
    }
  }, [error, toast])

  return (
    <>
      {/* Main Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='h-full p-4 lg:p-8'>
          {/* Header */}
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>Dashboard</h2>
              <p className='text-muted-foreground'>
                Welcome back, {session?.user?.name || 'Teacher'}!
              </p>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className='space-y-4'>
            {/* Overview Cards */}
            <OverviewCards />

            {/* Main Grid */}
            <div className='grid gap-4 grid-cols-1 lg:grid-cols-7'>
              {/* Schedule Card */}
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Upcoming Schedule</CardTitle>
                  <CardDescription>
                    Your classes for today and tomorrow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScheduleTable />
                </CardContent>
              </Card>

              {/* Student Progress */}
              <div className='col-span-1 lg:col-span-3'>
                <StudentProgress />
              </div>
            </div>

            {/* Students List */}
            {data?.students && data.students.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>My Students</CardTitle>
                  <CardDescription>
                    List of students assigned to you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    {data.students.map((student) => (
                      <div
                        key={student.id}
                        className='flex items-center justify-between p-2 bg-gray-50 rounded-lg'
                      >
                        <div>
                          <p className='font-medium'>
                            {student.name || 'Unnamed Student'}
                          </p>
                          <p className='text-sm text-gray-500'>
                            {student.email}
                          </p>
                        </div>
                        <span className='text-sm text-gray-500'>
                          Assigned:{' '}
                          {new Date(student.assignedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default TeacherDashboard
