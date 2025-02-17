import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { getStudentSchedule } from '@/actions/actions'

export interface Schedule {
  id: number
  title: string
  start: Date
  end: Date
  teacherId: string
  subjectId: number
  studentId?: string
  teacherName: string
  subjectName: string
}

export function useStudentSchedule() {
  const { data: session } = useSession()

  const {
    data: scheduleData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['student-schedule', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) throw new Error('No session')
      return getStudentSchedule(session.user.id)
    },
    enabled: !!session?.user?.id,
  })

  return {
    schedules: scheduleData?.schedules || [],
    isLoading,
    error: error instanceof Error ? error.message : null,
  }
}
