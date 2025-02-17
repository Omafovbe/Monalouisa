'use client'
import { getTeacherStudents } from '@/actions/actions'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

interface Student {
  id: string
  name: string | null
  email: string
  assignedAt: Date
}

const TeacherStudents = () => {
  const { data: session } = useSession()
  console.log('session ', session)
  const { toast } = useToast()
  const { data, isLoading, error } = useQuery({
    queryKey: ['teacher-students', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null
      console.log('Teacher ID:', session.user.id)
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
    <div className='container mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>My Students</h1>
      <Card>
        <CardHeader>
          <CardTitle></CardTitle>
          <CardDescription>List of students assigned to you</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='p-8 flex justify-center'>
              <Spinner size={24} />
            </div>
          ) : error ? (
            <div className='p-8 text-center text-red-500'>
              Failed to load students
            </div>
          ) : !data?.students?.length ? (
            <div className='p-8 text-center text-gray-500'>
              No students assigned yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Assigned Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.students.map((student: Student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name || 'N/A'}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      {new Date(student.assignedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default TeacherStudents
