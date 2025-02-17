'use client'

import { useQuery } from '@tanstack/react-query'
import { getAllSchedules } from '@/actions/actions'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Spinner } from '@/components/ui/spinner'
import { format } from 'date-fns'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'

// interface Schedule {
//   id: number
//   title: string
//   start: Date
//   end: Date
//   studentId: string
//   teacherId: string
//   subjectId: number
//   studentName: string
//   teacherName: string
//   subjectName: string
// }

export function ScheduleTable() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { data: scheduleData, isLoading } = useQuery({
    queryKey: ['schedules'],
    queryFn: getAllSchedules,
  })

  // Filter and paginate data
  const filteredAndPaginatedData = useMemo(() => {
    if (!scheduleData?.schedules) return { schedules: [], totalPages: 0 }

    const filtered = scheduleData.schedules.filter((schedule) => {
      const query = searchQuery.toLowerCase()
      return (
        schedule.studentName.toLowerCase().includes(query) ||
        schedule.teacherName.toLowerCase().includes(query)
      )
    })

    const totalPages = Math.ceil(filtered.length / itemsPerPage)
    const start = (currentPage - 1) * itemsPerPage
    const paginatedSchedules = filtered.slice(start, start + itemsPerPage)

    return { schedules: paginatedSchedules, totalPages }
  }, [scheduleData?.schedules, searchQuery, currentPage])

  if (isLoading) {
    return (
      <div className='flex justify-center p-4'>
        <Spinner size={24} />
      </div>
    )
  }

  if (!scheduleData?.schedules?.length) {
    return <div className='text-center p-4'>No schedules found</div>
  }

  return (
    <div className='space-y-4'>
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground mr-2' />
        <Input
          placeholder='Search by student or teacher name...'
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1) // Reset to first page on search
          }}
          className='mr-2 pl-10'
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Teacher</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndPaginatedData.schedules.map((schedule) => (
            <TableRow key={schedule.id}>
              <TableCell className='font-medium'>
                <div className='flex items-center'>
                  <Avatar className='h-8 w-8 mr-2'>
                    <AvatarFallback>{schedule.studentName[0]}</AvatarFallback>
                  </Avatar>
                  <div className='font-medium'>{schedule.studentName}</div>
                </div>
              </TableCell>
              <TableCell className='font-medium'>
                <div className='flex items-center'>
                  <Avatar className='h-8 w-8 mr-2'>
                    <AvatarFallback>{schedule.teacherName[0]}</AvatarFallback>
                  </Avatar>
                  <div className='font-medium'>{schedule.teacherName}</div>
                </div>
              </TableCell>
              <TableCell>{schedule.subjectName}</TableCell>
              <TableCell>
                {format(new Date(schedule.start), 'MMM d, yyyy h:mm a')}
              </TableCell>
              <TableCell>
                {format(
                  new Date(schedule.end).getTime() -
                    new Date(schedule.start).getTime(),
                  'H:mm'
                )}{' '}
                hrs
              </TableCell>
            </TableRow>
          ))}
          {filteredAndPaginatedData.schedules.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className='text-center py-4'>
                No matching schedules found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className='flex items-center justify-between'>
        <p className='text-sm text-muted-foreground'>
          Page {currentPage} of {filteredAndPaginatedData.totalPages}
        </p>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className='h-4 w-4' />
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, filteredAndPaginatedData.totalPages)
              )
            }
            disabled={currentPage === filteredAndPaginatedData.totalPages}
          >
            Next
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
