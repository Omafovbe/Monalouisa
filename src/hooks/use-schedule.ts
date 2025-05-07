import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import {
  getTeacherSchedule,
  upsertSchedule,
  deleteSchedule,
  getSubjects,
  getTeacherStudents,
} from '@/actions/actions'

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

  // Fetch teacher's schedule with optimized caching
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
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep data in cache for 30 minutes
  })

  // Fetch teacher's students with optimized caching
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
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep data in cache for 30 minutes
  })

  // Fetch subjects with optimized caching
  const {
    data: subjectsData,
    isLoading: isLoadingSubjects,
    error: subjectsError,
  } = useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjects,
    staleTime: 1000 * 60 * 60, // Consider data fresh for 1 hour
    gcTime: 1000 * 60 * 60 * 24, // Keep data in cache for 24 hours
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
      // Optimize cache invalidation
      queryClient.invalidateQueries({
        queryKey: ['teacher-schedule'],
        refetchType: 'active',
      })
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
      // Optimize cache invalidation
      queryClient.invalidateQueries({
        queryKey: ['teacher-schedule'],
        refetchType: 'active',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete schedule',
        variant: 'destructive',
      })
    },
  })

  return {
    schedules: scheduleData?.schedules || [],
    students: studentsData?.students || [],
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
