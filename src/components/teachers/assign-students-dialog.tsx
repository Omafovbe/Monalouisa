import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  assignStudentsToTeacher,
  getUnassignedStudents,
} from '@/actions/actions'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { Spinner } from '@/components/ui/spinner'

interface AssignStudentsDialogProps {
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
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch unassigned students
  const { data: unassignedData, isLoading } = useQuery({
    queryKey: ['unassigned-students', teacherId],
    queryFn: () => getUnassignedStudents(teacherId),
    enabled: open, // Only fetch when dialog is open
  })

  // Mutation for assigning students
  const { mutate, isPending } = useMutation({
    mutationFn: (studentIds: string[]) =>
      assignStudentsToTeacher(teacherId, studentIds),
    onSuccess: (data) => {
      if (data.error) {
        toast({
          title: 'Error',
          description: data.error,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Success',
          description: `Assigned ${data.count} students to ${teacherName}`,
        })
        queryClient.invalidateQueries({ queryKey: ['teachers'] })
        onOpenChange(false)
        setSelectedStudents([])
      }
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to assign students',
        variant: 'destructive',
      })
    },
  })

  const handleSubmit = () => {
    if (selectedStudents.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one student',
        variant: 'destructive',
      })
      return
    }
    mutate(selectedStudents)
  }

  const toggleStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Assign Students to {teacherName}</DialogTitle>
        </DialogHeader>

        <div className='py-4'>
          {isLoading ? (
            <div className='flex justify-center py-8'>
              <Spinner size={24} />
            </div>
          ) : unassignedData?.error ? (
            <div className='text-center text-red-500 py-4'>
              Failed to load students
            </div>
          ) : unassignedData?.students?.length === 0 ? (
            <div className='text-center text-gray-500 py-4'>
              No unassigned students available
            </div>
          ) : (
            <div className='space-y-4'>
              {unassignedData?.students?.map((student) => (
                <div key={student.id} className='flex items-center space-x-2'>
                  <Checkbox
                    id={student.id}
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => toggleStudent(student.id)}
                  />
                  <label
                    htmlFor={student.id}
                    className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                  >
                    {student.user.name || 'Unnamed'} ({student.user.email})
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='flex justify-end space-x-2'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || selectedStudents.length === 0}
          >
            {isPending ? 'Assigning...' : 'Assign Selected'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
