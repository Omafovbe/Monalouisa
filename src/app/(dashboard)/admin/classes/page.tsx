'use client'

import { useQuery } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  getFilteredRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Search,
  Users,
  Clock,
  User,
  Calendar,
} from 'lucide-react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Meeting {
  id: string
  room: string
  start_time: number
  duration: number
  ongoing: boolean
  max_participants: number
  participants: Array<{
    join_time: number
    duration: number
    participant_id: string
    user_id: string | null
    user_name: string | null
  }>
}

interface MeetingsResponse {
  meetings: Meeting[]
  error?: string
}

async function getMeetings(): Promise<MeetingsResponse> {
  const response = await fetch('/api/meetings')
  if (!response.ok) {
    throw new Error('Failed to fetch meetings')
  }
  return response.json()
}

const ClassMeetings = () => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const { data, isLoading, error } = useQuery<MeetingsResponse>({
    queryKey: ['meetings'],
    queryFn: getMeetings,
    // refetchInterval: 30000,
  })

  const columns: ColumnDef<Meeting>[] = [
    {
      accessorKey: 'room',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Room Name
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        )
      },
    },
    {
      accessorKey: 'start_time',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Start Time
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        )
      },
      cell: ({ row }) =>
        format(new Date(row.original.start_time * 1000), 'MMM d, yyyy h:mm a'),
    },
    {
      accessorKey: 'duration',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Duration
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        )
      },
      cell: ({ row }) => `${Math.floor(row.original.duration / 60)} minutes`,
    },
    {
      accessorKey: 'ongoing',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.ongoing ? 'default' : 'secondary'}>
          {row.original.ongoing ? 'Ongoing' : 'Ended'}
        </Badge>
      ),
    },
    // {
    //   accessorKey: 'max_participants',
    //   header: 'Max Participants',
    // },
    {
      accessorKey: 'participants',
      header: 'Participants',
      cell: ({ row }) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant='outline'
              className='flex items-center gap-2 hover:bg-accent'
            >
              <Users className='h-4 w-4' />
              <span>{row.original.participants.length}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-3xl'>
            <DialogHeader>
              <DialogTitle>Meeting Participants</DialogTitle>
            </DialogHeader>
            <div className='mt-4 space-y-4'>
              <div className='grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg'>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Room Name
                  </p>
                  <p className='font-medium'>{row.original.room}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Meeting Status
                  </p>
                  <Badge
                    variant={row.original.ongoing ? 'default' : 'secondary'}
                  >
                    {row.original.ongoing ? 'Ongoing' : 'Ended'}
                  </Badge>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Start Time
                  </p>
                  <p className='font-medium'>
                    {format(
                      new Date(row.original.start_time * 1000),
                      'MMM d, yyyy h:mm a'
                    )}
                  </p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Duration
                  </p>
                  <p className='font-medium'>
                    {Math.floor(row.original.duration / 60)} minutes
                  </p>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[200px]'>Participant</TableHead>
                    <TableHead>Join Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {row.original.participants.map((participant) => (
                    <TableRow key={participant.participant_id}>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <User className='h-4 w-4 text-muted-foreground' />
                          <span>{participant.user_name || 'Anonymous'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <Calendar className='h-4 w-4 text-muted-foreground' />
                          <span>
                            {format(
                              new Date(participant.join_time * 1000),
                              'MMM d, yyyy h:mm a'
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <Clock className='h-4 w-4 text-muted-foreground' />
                          <span>
                            {Math.floor(participant.duration / 60)} minutes
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline'>
                          {participant.duration > 0 ? 'Active' : 'Left'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      ),
    },
  ]

  const table = useReactTable({
    data: data?.meetings || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      if (value == null) return false

      // Handle different column types
      if (columnId === 'start_time') {
        const date = format(
          new Date((value as number) * 1000),
          'MMM d, yyyy h:mm a'
        )
        return date.toLowerCase().includes(filterValue.toLowerCase())
      }
      if (columnId === 'duration') {
        const minutes = Math.floor((value as number) / 60)
        return minutes.toString().includes(filterValue)
      }
      if (columnId === 'participants') {
        const participants = value as Meeting['participants']
        return participants.some((p) =>
          (p.user_name || 'Anonymous')
            .toLowerCase()
            .includes(filterValue.toLowerCase())
        )
      }

      return String(value).toLowerCase().includes(filterValue.toLowerCase())
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  })

  return (
    <div className='p-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>Classes</h1>
        <p className='text-muted-foreground'>
          Review the classes and participants
        </p>
      </div>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Recent Meetings</CardTitle>
            <div className='relative w-72'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search all columns...'
                value={globalFilter ?? ''}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className='pl-8'
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='flex justify-center p-8'>
              <Spinner size={24} />
            </div>
          ) : error ? (
            <div className='p-8 text-center text-red-500'>
              Error loading meetings:{' '}
              {error instanceof Error ? error.message : 'Unknown error'}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className='text-center py-8'
                      >
                        No meetings found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className='flex items-center justify-between space-x-2 py-4'>
                <div className='flex items-center space-x-2'>
                  <p className='text-sm font-medium'>Rows per page</p>
                  <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(value) => {
                      table.setPageSize(Number(value))
                    }}
                  >
                    <SelectTrigger className='h-8 w-[70px]'>
                      <SelectValue
                        placeholder={table.getState().pagination.pageSize}
                      />
                    </SelectTrigger>
                    <SelectContent side='top'>
                      {[10, 20, 30, 40, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex items-center space-x-2'>
                  <div className='flex-1 text-sm text-muted-foreground'>
                    Page {table.getState().pagination.pageIndex + 1} of{' '}
                    {table.getPageCount()}
                  </div>
                  <div className='space-x-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => table.setPageIndex(0)}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <ChevronsLeft className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <ChevronLeft className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      <ChevronRight className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        table.setPageIndex(table.getPageCount() - 1)
                      }
                      disabled={!table.getCanNextPage()}
                    >
                      <ChevronsRight className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ClassMeetings
