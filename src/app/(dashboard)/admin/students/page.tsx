// src/app/admin/manage-students/page.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { getStudents, syncExistingUsers } from '@/actions/actions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import React, { useEffect } from 'react'

interface Student {
  id: string
  userId: string
  createdAt: Date
  user: {
    name: string | null
    email: string
  }
  teachers: Array<{
    teacher: {
      user: {
        name: string | null
        email: string
      }
    }
  }>
}

interface StudentsResponse {
  students: Student[]
  error: string | null
}

export default function StudentsPage() {
  const { toast } = useToast()

  const { data, isLoading, error } = useQuery<StudentsResponse>({
    queryKey: ['students'],
    queryFn: async () => {
      try {
        // First sync the users
        await syncExistingUsers()
        // Then fetch the students
        const result = await getStudents()
        return result as StudentsResponse
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to sync or fetch students',
          variant: 'destructive',
        })
        throw error
      }
    },
  })

  useEffect(() => {
    if (data?.error) {
      toast({
        title: 'Error',
        description: data.error,
        variant: 'destructive',
      })
    }
  }, [data?.error, toast])

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Students</h1>
      </div>

      <div className='border rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teachers</TableHead>
              <TableHead>Joined Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className='text-center py-8'>
                  Loading students...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className='text-center py-8 text-red-600'
                >
                  Error loading students
                </TableCell>
              </TableRow>
            ) : data?.students?.length ? (
              data.students.map((student: Student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.user.name || 'N/A'}</TableCell>
                  <TableCell>{student.user.email}</TableCell>
                  <TableCell>
                    {student.teachers.length > 0 ? (
                      <ul className='list-disc list-inside'>
                        {student.teachers.map((t, index) => (
                          <li key={index}>{t.teacher.user.name || 'N/A'}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className='text-gray-500'>
                        No teachers assigned
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(student.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className='text-center py-8'>
                  No students found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
