import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import {
  getTeacherSchedule,
  upsertSchedule,
  deleteSchedule,
  getSubjects,
  getTeacherStudents,
} from '@/action/actions'

export interface Schedule {
  id: number
  title: string
  start: Date
  end: Date
  studentId: string
  subjectId: number
  studentName: string
  subjectName: string
}

export interface ScheduleFormValues {
  title: string
  studentId: string
  subjectId: string
  startTime: string
  endTime: string
}

export function useSchedule() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch teacher's schedule
  const {
    data: scheduleData,
    isLoading: isLoadingSchedule,
    error: scheduleError,
  } = useQuery({
    queryKey: ['teacher-schedule', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null
      return getTeacherSchedule(session.user.id)
    },
    enabled: !!session?.user?.id,
  })

  // Fetch teacher's students
  const {
    data: studentsData,
    isLoading: isLoadingStudents,
    error: studentsError,
  } = useQuery({
    queryKey: ['teacher-students', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null
      const result = await getTeacherStudents(session?.user?.id)
      return result
    },
    enabled: !!session?.user?.id,
  })

  // Fetch subjects
  const {
    data: subjectsData,
    isLoading: isLoadingSubjects,
    error: subjectsError,
  } = useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjects,
  })

  // Unified mutation for creating and updating schedules
  const scheduleMutation = useMutation({
    mutationFn: async ({
      scheduleId,
      values,
    }: {
      scheduleId?: number
      values: ScheduleFormValues
    }) => {
      if (!session?.user?.id) throw new Error('No session')

      const result = await upsertSchedule({
        scheduleId,
        teacherId: session.user.id,
        studentId: values.studentId,
        subjectId: parseInt(values.subjectId),
        startTime: new Date(values.startTime),
        endTime: new Date(values.endTime),
        title: values.title || 'Class Session',
      })

      if (result.error) {
        throw new Error(result.error)
      }

      return result
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Schedule saved successfully',
      })
      queryClient.invalidateQueries({ queryKey: ['teacher-schedule'] })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save schedule',
        variant: 'destructive',
      })
    },
  })

  // Delete schedule mutation
  const deleteScheduleMutation = useMutation({
    mutationFn: async (scheduleId: number) => {
      if (!session?.user?.id) throw new Error('No session')
      return deleteSchedule(scheduleId, session.user.id)
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Schedule deleted successfully',
      })
      queryClient.invalidateQueries({ queryKey: ['teacher-schedule'] })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete schedule',
        variant: 'destructive',
      })
    },
  })
  // console.log('studentsData', studentsData)
  return {
    schedules: scheduleData?.schedules || [],
    students: studentsData?.students || [], // Use students array from getUnassignedStudents
    subjects: subjectsData?.subjects || [],
    isLoading: isLoadingSchedule || isLoadingStudents || isLoadingSubjects,
    error: scheduleError || studentsError || subjectsError,
    createSchedule: (values: ScheduleFormValues) =>
      scheduleMutation.mutate({ values }),
    updateSchedule: (scheduleId: number, values: ScheduleFormValues) =>
      scheduleMutation.mutate({ scheduleId, values }),
    deleteSchedule: deleteScheduleMutation.mutate,
    isCreating: scheduleMutation.isPending,
    isUpdating: scheduleMutation.isPending,
    isDeleting: deleteScheduleMutation.isPending,
  }
}
