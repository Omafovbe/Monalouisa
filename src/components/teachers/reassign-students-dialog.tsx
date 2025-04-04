'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import {
  getTeacherStudents,
  getTeachers,
  reassignStudentsToTeacher,
} from '@/actions/actions'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type ReassignStudentsDialogProps = {
  currentTeacherId: number
  currentTeacherName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReassignStudentsDialog({
  currentTeacherId,
  currentTeacherName,
  open,
  onOpenChange,
}: ReassignStudentsDialogProps) {
  const { toast } = useToast()
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [targetTeacherId, setTargetTeacherId] = useState<number | null>(null)

  // Fetch current teacher's students
  const {
    data: studentsData,
    isLoading: isLoadingStudents,
    error: studentsError,
  } = useQuery({
    queryKey: ['teacherStudents', currentTeacherId],
    queryFn: async () => {
      // For teacher students we need to convert the ID to match what the function expects
      const currentTeacher = await getTeacherById(currentTeacherId)
      if (!currentTeacher?.userId) {
        throw new Error('Teacher not found')
      }
      return getTeacherStudents(currentTeacher.userId)
    },
    enabled: open && !!currentTeacherId,
  })

  // Helper function to get teacher details by ID
  const getTeacherById = async (id: number) => {
    const result = await getTeachers()
    return result.teachers.find((teacher) => teacher.id === id)
  }

  // Fetch available teachers for reassignment
  const {
    data: teachersData,
    isLoading: isLoadingTeachers,
    error: teachersError,
  } = useQuery({
    queryKey: ['availableTeachers', currentTeacherId],
    queryFn: async () => {
      const result = await getTeachers('APPROVED')
      // Filter out the current teacher
      return {
        ...result,
        teachers: result.teachers.filter(
          (teacher) => teacher.id !== currentTeacherId
        ),
      }
    },
    enabled: open,
  })

  // Mutation for reassigning students
  const mutation = useMutation({
    mutationFn: () => {
      if (!targetTeacherId || selectedStudents.length === 0) {
        throw new Error('Missing required data for reassignment')
      }
      return reassignStudentsToTeacher(
        currentTeacherId,
        targetTeacherId,
        selectedStudents
      )
    },
    onSuccess: () => {
      toast({
        title: 'Students Reassigned',
        description: `Successfully reassigned ${selectedStudents.length} student(s) to the new teacher.`,
        variant: 'default',
      })
      setSelectedStudents([])
      setTargetTeacherId(null)
      onOpenChange(false)
    },
    onError: (error) => {
      console.error('Reassignment error:', error)
      toast({
        title: 'Reassignment Failed',
        description:
          error instanceof Error
            ? error.message
            : 'An error occurred during student reassignment',
        variant: 'destructive',
      })
    },
  })

  // Toggle student selection
  const toggleStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    )
  }

  // Toggle all students
  const toggleAllStudents = () => {
    if (!studentsData?.students) return

    if (selectedStudents.length === studentsData.students.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(studentsData.students.map((student) => student.id))
    }
  }

  // Handle submit action
  const handleSubmit = () => {
    if (selectedStudents.length === 0) {
      toast({
        title: 'No students selected',
        description: 'Please select at least one student to reassign',
        variant: 'destructive',
      })
      return
    }

    if (!targetTeacherId) {
      toast({
        title: 'No target teacher selected',
        description: 'Please select a teacher to reassign students to',
        variant: 'destructive',
      })
      return
    }

    mutation.mutate()
  }

  const students = studentsData?.students || []
  const teachers = teachersData?.teachers || []

  const isStudentsError = !!studentsError || !!studentsData?.error
  const isTeachersError = !!teachersError || !!teachersData?.error
  const isError = isStudentsError || isTeachersError

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>Reassign Students from {currentTeacherName}</DialogTitle>
          <DialogDescription>
            Select students from {currentTeacherName}'s class to reassign to
            another teacher.
          </DialogDescription>
        </DialogHeader>

        <div className='py-4 space-y-4'>
          {/* Target teacher selection */}
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>
                Select New Teacher
              </CardTitle>
              <CardDescription>
                Choose which teacher will take over these students
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTeachers ? (
                <Skeleton className='h-9 w-full rounded-md' />
              ) : isTeachersError ? (
                <div className='text-destructive text-sm py-1'>
                  Error loading available teachers
                </div>
              ) : teachers.length === 0 ? (
                <div className='text-muted-foreground text-sm py-1'>
                  No other active teachers available
                </div>
              ) : (
                <Select
                  value={targetTeacherId?.toString() || ''}
                  onValueChange={(value) => setTargetTeacherId(Number(value))}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select a teacher' />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem
                        key={teacher.id}
                        value={teacher.id.toString()}
                      >
                        {teacher.user.name || teacher.user.email}
                        {teacher.teacherApplication?.teachableSubjects && (
                          <span className='text-xs text-muted-foreground ml-2'>
                            ({teacher.teacherApplication.teachableSubjects})
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>

          {/* Student selection */}
          <Card>
            <CardHeader className='pb-2'>
              <div className='flex justify-between items-center'>
                <CardTitle className='text-sm font-medium'>
                  Select Students to Reassign
                </CardTitle>
                {!isLoadingStudents && students.length > 0 && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={toggleAllStudents}
                  >
                    {selectedStudents.length === students.length
                      ? 'Deselect All'
                      : 'Select All'}
                  </Button>
                )}
              </div>
              <CardDescription>
                Choose which students will be transferred to the new teacher
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingStudents ? (
                <div className='space-y-2'>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className='flex items-center gap-2'>
                      <Skeleton className='h-4 w-4' />
                      <Skeleton className='h-4 w-full' />
                    </div>
                  ))}
                </div>
              ) : isStudentsError ? (
                <div className='text-destructive text-sm py-2'>
                  Error loading students. Please try again.
                </div>
              ) : students.length === 0 ? (
                <div className='text-muted-foreground text-sm py-2'>
                  This teacher has no assigned students
                </div>
              ) : (
                <ScrollArea className='h-[200px] pr-4'>
                  <div className='space-y-3'>
                    {students.map((student) => (
                      <div
                        key={student.id}
                        className='flex flex-col gap-1 p-3 rounded-md border border-border'
                      >
                        <div className='flex items-start gap-2'>
                          <Checkbox
                            id={`student-${student.id}`}
                            checked={selectedStudents.includes(student.id)}
                            onCheckedChange={() => toggleStudent(student.id)}
                          />
                          <div className='flex-1'>
                            <label
                              htmlFor={`student-${student.id}`}
                              className='font-medium text-sm cursor-pointer'
                            >
                              {student.name || student.email}
                            </label>

                            {/* Show enrolled subjects if available */}
                            {student.subjects &&
                              student.subjects.length > 0 && (
                                <div className='mt-2'>
                                  <span className='text-xs text-muted-foreground'>
                                    Enrolled in:
                                  </span>
                                  <div className='flex flex-wrap gap-1 mt-1'>
                                    {student.subjects.map(
                                      (subject: string, idx: number) => (
                                        <Badge
                                          key={idx}
                                          variant='outline'
                                          className='text-xs'
                                        >
                                          {subject}
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              selectedStudents.length === 0 ||
              !targetTeacherId ||
              isLoadingStudents ||
              isLoadingTeachers ||
              isError ||
              mutation.isPending
            }
          >
            {mutation.isPending ? 'Reassigning...' : 'Reassign Students'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
