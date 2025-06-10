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

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFeedbackList, updateFeedbackStatus } from '@/actions/actions'
import { toast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { Search } from 'lucide-react'

interface Feedback {
  id: string
  rating: number
  comment: string
  status: 'completed' | 'missed'
  createdAt: Date
  student: {
    user: {
      name: string | null
      email: string
    }
  }
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
  pagination?: {
    total: number
    pages: number
    page: number
    limit: number
  }
}

export default function AdminFeedbackPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [status, setStatus] = useState<string>('')
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<FeedbackResponse>({
    queryKey: ['feedback', page, pageSize, status, search],
    queryFn: async () => {
      const response = await getFeedbackList({
        page,
        limit: pageSize,
        status: status === 'ALL' ? undefined : status,
        search,
      })
      return response as FeedbackResponse
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, rating }: { id: string; rating: number }) =>
      updateFeedbackStatus(id, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] })
      toast({
        title: 'Success',
        description: 'Feedback status updated successfully',
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update feedback status',
        variant: 'destructive',
      })
    },
  })

  const handleStatusChange = (id: string, newRating: number) => {
    updateStatusMutation.mutate({ id, rating: newRating })
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Feedback Management</h1>
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
              <SelectItem value='ALL'>All Status</SelectItem>
              <SelectItem value='completed'>Completed</SelectItem>
              <SelectItem value='missed'>Missed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((feedback) => (
              <TableRow key={feedback.id}>
                <TableCell>
                  {feedback.student.user.name}
                  <br />
                  <span className='text-sm text-muted-foreground'>
                    {feedback.student.user.email}
                  </span>
                </TableCell>
                <TableCell>
                  {feedback.teacher.user.name}
                  <br />
                  <span className='text-sm text-muted-foreground'>
                    {feedback.teacher.user.email}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex capitalize items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      feedback.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {feedback.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Select
                    value={feedback.rating.toString()}
                    onValueChange={(value) =>
                      handleStatusChange(feedback.id, Number(value))
                    }
                  >
                    <SelectTrigger className='w-[100px]'>
                      <SelectValue placeholder='Rate' />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>
                          {rating}/5
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className='max-w-[300px] truncate'>
                  {feedback.comment}
                </TableCell>
                <TableCell>
                  {format(feedback.createdAt, 'MMM d, yyyy')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-between mt-4'>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-muted-foreground'>Rows per page</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className='text-sm text-muted-foreground'>
            Page {page} of {data?.pagination?.pages || 1}
          </span>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPage(page + 1)}
            disabled={page === (data?.pagination?.pages || 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
