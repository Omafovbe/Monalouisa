'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useQuery } from '@tanstack/react-query'
import { getStudentFeedback } from '@/actions/actions'
import { format } from 'date-fns'
import { Search } from 'lucide-react'

interface Feedback {
  id: string
  rating: number
  comment: string
  status: string
  createdAt: Date
  teacher: {
    user: {
      name: string | null
      email: string
    }
  }
}

interface FeedbackResponse {
  success: boolean
  data: Feedback[]
}

export default function StudentFeedbackPage() {
  const [status, setStatus] = useState<string>('')
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery<FeedbackResponse>({
    queryKey: ['student-feedback', status, search],
    queryFn: async () => {
      const response = await getStudentFeedback()
      return response as FeedbackResponse
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>My Feedback</h1>
        <div className='flex gap-4'>
          <div className='relative'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search feedback...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='pl-8 w-[300px]'
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Filter by status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=''>All Status</SelectItem>
              <SelectItem value='PENDING'>Pending</SelectItem>
              <SelectItem value='APPROVED'>Approved</SelectItem>
              <SelectItem value='REJECTED'>Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Teacher</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((feedback) => (
              <TableRow key={feedback.id}>
                <TableCell>
                  {feedback.teacher.user.name}
                  <br />
                  <span className='text-sm text-muted-foreground'>
                    {feedback.teacher.user.email}
                  </span>
                </TableCell>
                <TableCell>{feedback.rating}/5</TableCell>
                <TableCell className='max-w-[300px] truncate'>
                  {feedback.comment}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      feedback.status === 'APPROVED'
                        ? 'bg-green-100 text-green-800'
                        : feedback.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {feedback.status}
                  </span>
                </TableCell>
                <TableCell>
                  {format(feedback.createdAt, 'MMM d, yyyy')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
