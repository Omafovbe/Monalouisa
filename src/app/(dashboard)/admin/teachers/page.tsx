'use client'

import { getTeachers } from '@/action/actions'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { AssignStudentsDialog } from '@/components/teachers/assign-students-dialog'
import { UserPlus } from 'lucide-react'

type StatusType = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
}

interface Teacher {
  id: number
  status: keyof typeof statusColors
  user: {
    name: string | null
    email: string
  }
  teacherApplication: {
    yearsOfExperience: number
    preferredAgeGroup: string
  } | null
  hireDate: Date | null
}

const ManageTeachers = () => {
  const [selectedStatus, setSelectedStatus] = useState<StatusType>('ALL')
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['teachers', selectedStatus],
    queryFn: async () => {
      const status = selectedStatus === 'ALL' ? undefined : selectedStatus
      return getTeachers(status)
    },
  })

  const teachers = data?.teachers || []

  return (
    <div className='container mx-auto p-6'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold mb-4'>Manage Teachers</h1>
        <div className='flex gap-2'>
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(
            (status) => (
              <Badge
                key={status}
                className={`cursor-pointer capitalize ${
                  selectedStatus === status
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
                onClick={() => setSelectedStatus(status)}
              >
                {status.toLowerCase()}
              </Badge>
            )
          )}
        </div>
      </div>

      <Card>
        {isLoading ? (
          <div className='p-4'>Loading...</div>
        ) : error ? (
          <div className='p-4 text-red-500'>Error loading teachers</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Age Group</TableHead>
                <TableHead>Hire Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher: Teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>{teacher.user.name}</TableCell>
                  <TableCell>{teacher.user.email}</TableCell>
                  <TableCell>
                    <Badge
                      className={`capitalize ${
                        statusColors[teacher.status] || ''
                      }`}
                    >
                      {teacher.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {teacher.teacherApplication?.yearsOfExperience} years
                  </TableCell>
                  <TableCell>
                    {teacher.teacherApplication?.preferredAgeGroup}
                  </TableCell>
                  <TableCell>
                    {teacher.hireDate
                      ? new Date(teacher.hireDate).toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {teacher.status === 'APPROVED' && (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => setSelectedTeacher(teacher)}
                      >
                        <UserPlus className='h-4 w-4 mr-2' />
                        Assign Students
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {teachers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className='text-center'>
                    No teachers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      {selectedTeacher && (
        <AssignStudentsDialog
          teacherId={selectedTeacher.id}
          teacherName={selectedTeacher.user.name || 'Unnamed Teacher'}
          open={!!selectedTeacher}
          onOpenChange={(open) => !open && setSelectedTeacher(null)}
        />
      )}
    </div>
  )
}

export default ManageTeachers
