'use client'

import { useQuery } from '@tanstack/react-query'
import { getStudentTeachers } from '@/actions/actions'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/use-toast'
import { useEffect } from 'react'

interface Teacher {
  id: number
  name: string | null
  email: string
  experience: number | undefined
  ageGroup: string | undefined
  assignedAt: Date
}

export default function StudentDashboard() {
  const { data: session } = useSession()
  const { toast } = useToast()

  const { data, isLoading, error } = useQuery({
    queryKey: ['student-teachers', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null
      return getStudentTeachers(session.user.id)
    },
    enabled: !!session?.user?.id,
  })

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load your teachers',
        variant: 'destructive',
      })
    }
  }, [error, toast])

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>My Teachers</h1>

      <Card>
        {isLoading ? (
          <div className='p-8 flex justify-center'>
            <Spinner size={24} />
          </div>
        ) : error ? (
          <div className='p-8 text-center text-red-500'>
            Failed to load teachers
          </div>
        ) : !data?.teachers?.length ? (
          <div className='p-8 text-center text-gray-500'>
            No teachers assigned yet
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Age Group</TableHead>
                <TableHead>Assigned Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.teachers.map((teacher: Teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>{teacher.name || 'N/A'}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.experience} years</TableCell>
                  <TableCell>{teacher.ageGroup}</TableCell>
                  <TableCell>
                    {new Date(teacher.assignedAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
