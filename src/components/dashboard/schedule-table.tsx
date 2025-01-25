'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const schedules = [
  {
    student: {
      name: 'Emma Ryan',
      image: 'https://v0.blob.com/eLKcX.png',
      email: 'emma@example.com',
    },
    subject: 'English Conversation',
    status: 'Completed',
    date: 'Today, 2:00 PM',
    duration: '60 min',
  },
  {
    student: {
      name: 'Adrian Daren',
      image: 'https://v0.blob.com/eLKcX.png',
      email: 'adrian@example.com',
    },
    subject: 'Grammar Workshop',
    status: 'Upcoming',
    date: 'Today, 4:00 PM',
    duration: '45 min',
  },
  {
    student: {
      name: 'Sophia Chen',
      image: 'https://v0.blob.com/eLKcX.png',
      email: 'sophia@example.com',
    },
    subject: 'IELTS Preparation',
    status: 'Upcoming',
    date: 'Tomorrow, 10:00 AM',
    duration: '90 min',
  },
  {
    student: {
      name: 'Marcus Kim',
      image: 'https://v0.blob.com/eLKcX.png',
      email: 'marcus@example.com',
    },
    subject: 'English Beginner',
    status: 'Cancelled',
    date: 'Tomorrow, 3:00 PM',
    duration: '60 min',
  },
]

export function ScheduleTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date & Time</TableHead>
          <TableHead className='text-right'>Duration</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {schedules.map((schedule) => (
          <TableRow key={schedule.student.email}>
            <TableCell className='font-medium'>
              <div className='flex items-center'>
                <Avatar className='h-8 w-8 mr-2'>
                  <AvatarImage
                    src={schedule.student.image}
                    alt={schedule.student.name}
                  />
                  <AvatarFallback>{schedule.student.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className='font-medium'>{schedule.student.name}</div>
                  <div className='text-sm text-muted-foreground'>
                    {schedule.student.email}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>{schedule.subject}</TableCell>
            <TableCell>
              <Badge
                variant={
                  schedule.status === 'Completed'
                    ? 'default'
                    : schedule.status === 'Upcoming'
                    ? 'outline'
                    : 'destructive'
                }
              >
                {schedule.status}
              </Badge>
            </TableCell>
            <TableCell>{schedule.date}</TableCell>
            <TableCell className='text-right'>{schedule.duration}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
