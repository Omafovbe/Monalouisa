import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { getStudentSchedule } from '@/action/actions'

export interface Schedule {
  id: number
  title: string
  start: Date
  end: Date
  teacherId: string
  subjectId: number
  teacherName: string
  subjectName: string
}

export function useStudentSchedule() {
  const { data: session } = useSession()

  // Fetch student's schedule
  const {
    data: scheduleData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['student-schedule', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null
      return getStudentSchedule(session.user.id)
    },
    enabled: !!session?.user?.id,
  })

  return {
    schedules: scheduleData?.schedules || [],
    isLoading,
    error,
  }
}
