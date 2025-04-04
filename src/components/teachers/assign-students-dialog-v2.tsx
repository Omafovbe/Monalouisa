'use client'

import {
  assignStudentsToTeacher,
  getUnassignedStudents,
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
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'

type AssignStudentsDialogProps = {
  teacherId: number
  teacherName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssignStudentsDialog({
  teacherId,
  teacherName,
  open,
  onOpenChange,
}: AssignStudentsDialogProps) {
  const { toast } = useToast()
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])

  // Fetch unassigned students when dialog is open
  const { data, isLoading, error } = useQuery({
    queryKey: ['unassignedStudents', teacherId],
    queryFn: () => getUnassignedStudents(teacherId),
    enabled: open, // Only fetch when dialog is open
  })

  // Mutation for assigning students
  const mutation = useMutation({
    mutationFn: (studentIds: string[]) =>
      assignStudentsToTeacher(teacherId, studentIds),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Students assigned successfully',
        variant: 'default',
      })
      setSelectedStudents([])
      onOpenChange(false)
    },
    onError: (error) => {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Failed to assign students',
        variant: 'destructive',
      })
    },
  })

  // Handle submit action
  const handleSubmit = () => {
    if (selectedStudents.length === 0) {
      toast({
        title: 'No students selected',
        description: 'Please select at least one student to assign',
        variant: 'destructive',
      })
      return
    }
    mutation.mutate(selectedStudents)
  }

  // Toggle student selection
  const toggleStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    )
  }

  const students = data?.students || []
  const isError = !!error || !!data?.error

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>Assign Students to {teacherName}</DialogTitle>
          <DialogDescription>
            Select students to assign to this teacher. Students with matching
            subjects are highlighted.
          </DialogDescription>
        </DialogHeader>

        <div className='py-4'>
          {isLoading ? (
            <div className='space-y-2'>
              {[1, 2, 3].map((i) => (
                <div key={i} className='flex items-center gap-2'>
                  <Skeleton className='h-4 w-4' />
                  <Skeleton className='h-4 w-full' />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className='text-destructive text-sm py-2'>
              Error loading students. Please try again.
            </div>
          ) : students.length === 0 ? (
            <div className='text-muted-foreground text-sm py-2'>
              No unassigned students found
            </div>
          ) : (
            <ScrollArea className='h-[300px] pr-4'>
              <div className='space-y-4'>
                {students.map((student) => {
                  const isMatch = student.isMatch

                  return (
                    <div
                      key={student.id}
                      className={`flex flex-col gap-1 p-3 rounded-md ${
                        isMatch
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900'
                          : 'bg-card'
                      }`}
                    >
                      <div className='flex items-start gap-2'>
                        <Checkbox
                          id={student.id}
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={() => toggleStudent(student.id)}
                        />
                        <div className='flex-1'>
                          <label
                            htmlFor={student.id}
                            className='font-medium text-sm cursor-pointer flex items-center gap-2'
                          >
                            {student.user.name || student.user.email}
                            {isMatch && (
                              <Badge className='bg-green-500 text-white hover:bg-green-600'>
                                Subject Match
                              </Badge>
                            )}
                          </label>

                          {/* Show enrolled subjects */}
                          <div className='mt-2 text-xs'>
                            <span className='text-muted-foreground'>
                              Enrolled in:
                            </span>
                            <div className='flex flex-wrap gap-1 mt-1'>
                              {student.enrolledSubjects.length > 0 ? (
                                student.enrolledSubjects.map((subject) => {
                                  const isMatchingSubject =
                                    student.matchingSubjects.some(
                                      (match) => match.id === subject.id
                                    )

                                  return (
                                    <Badge
                                      key={subject.id}
                                      className={`text-xs ${
                                        isMatchingSubject
                                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                                      }`}
                                    >
                                      {subject.name}
                                    </Badge>
                                  )
                                })
                              ) : (
                                <span className='text-muted-foreground italic'>
                                  No subjects
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          )}
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
              isLoading ||
              isError ||
              mutation.isPending
            }
          >
            {mutation.isPending ? 'Assigning...' : 'Assign Selected Students'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
