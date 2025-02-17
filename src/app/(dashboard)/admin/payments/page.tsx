'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPayments } from '@/actions/stripe-actions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { format } from 'date-fns'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Row,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  created: Date
  customerDetails: {
    name: string | null
    email: string
    packageName: string
    billingType: string
  } | null
}

export default function PaymentsPage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-payments'],
    queryFn: async () => {
      const result = await getPayments()
      if ('error' in result) {
        throw new Error(result.error)
      }
      console.log('result', result)
      return result
    },
  })
  console.log('selectedPayment', selectedPayment)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'requires_payment_method':
        return 'bg-orange-100 text-orange-800'
      case 'canceled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: 'created',
      header: 'Date',
      cell: ({ row }) =>
        format(new Date(row.original.created), 'MMM d, yyyy HH:mm'),
    },
    {
      header: 'Student',
      cell: ({ row }) => (
        <div>
          <div className='font-medium'>
            {row.original.customerDetails?.name || 'N/A'}
          </div>
          <div className='text-sm text-muted-foreground'>
            {row.original.customerDetails?.email || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      header: 'Package',
      cell: ({ row }) => (
        <div>
          <div className='font-medium'>
            {row.original.customerDetails?.packageName || 'N/A'}
          </div>
          <div className='text-sm text-muted-foreground capitalize'>
            {row.original.customerDetails?.billingType || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount'))
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: row.original.currency,
        }).format(amount)
        return formatted
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        return (
          <Badge className={cn(getStatusColor(status))}>
            {status.replace('_', ' ').toLowerCase()}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant='ghost'
              className='h-8'
              onClick={() => setSelectedPayment(row.original)}
            >
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>Payment Details</DialogTitle>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <h3 className='font-semibold mb-2'>
                    Transaction Information
                  </h3>
                  <div className='space-y-2'>
                    <div>
                      <span className='text-sm text-muted-foreground'>ID:</span>
                      <p className='font-mono text-sm'>{row.original.id}</p>
                    </div>
                    <div>
                      <span className='text-sm text-muted-foreground'>
                        Date:
                      </span>
                      <p>{format(new Date(row.original.created), 'PPpp')}</p>
                    </div>
                    <div>
                      <span className='text-sm text-muted-foreground'>
                        Amount:
                      </span>
                      <p className='font-semibold'>
                        {row.original.amount} {row.original.currency}
                      </p>
                    </div>
                    <div>
                      <span className='text-sm text-muted-foreground'>
                        Status:
                      </span>
                      <Badge
                        className={`ml-2 capitalize ${getStatusColor(
                          row.original.status
                        )}`}
                      >
                        {row.original.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className='font-semibold mb-2'>Customer Information</h3>
                  <div className='space-y-2'>
                    <div>
                      <span className='text-sm text-muted-foreground'>
                        Name:
                      </span>
                      <p>{row.original.customerDetails?.name || 'Unknown'}</p>
                    </div>
                    <div>
                      <span className='text-sm text-muted-foreground'>
                        Email:
                      </span>
                      <p>{row.original.customerDetails?.email}</p>
                    </div>
                    <div>
                      <span className='text-sm text-muted-foreground'>
                        Package:
                      </span>
                      <p>{row.original.customerDetails?.packageName}</p>
                    </div>
                    <div>
                      <span className='text-sm text-muted-foreground'>
                        Plan:
                      </span>
                      <p className='capitalize'>
                        {row.original.customerDetails?.billingType}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ),
    },
  ]

  // Filter function for global search
  const globalFilterFn = (
    row: Row<Payment>,
    columnId: string,
    filterValue: string
  ) => {
    const searchValue = filterValue.toLowerCase()
    const customerName = row.original.customerDetails?.name?.toLowerCase() || ''
    const customerEmail =
      row.original.customerDetails?.email?.toLowerCase() || ''
    return (
      customerName.includes(searchValue) || customerEmail.includes(searchValue)
    )
  }

  const table = useReactTable({
    data: data?.payments || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  })

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-[50vh]'>
        <Spinner size={32} />
      </div>
    )
  }

  if (error) {
    return (
      <div className='p-6'>
        <div className='text-red-500'>
          Error loading payments:{' '}
          {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    )
  }

  return (
    <div className='p-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>Payments</h1>
        <p className='text-muted-foreground'>View all payment transactions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <Search className='h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search by student name or email...'
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className='max-w-sm'
              />
            </div>
            <Select
              value={
                (table.getColumn('status')?.getFilterValue() as string) ?? 'all'
              }
              onValueChange={(value) =>
                table
                  .getColumn('status')
                  ?.setFilterValue(value === 'all' ? '' : value)
              }
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Filter by status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All statuses</SelectItem>
                <SelectItem value='succeeded'>Succeeded</SelectItem>
                <SelectItem value='processing'>Processing</SelectItem>
                <SelectItem value='requires_payment_method'>
                  Requires Payment
                </SelectItem>
                <SelectItem value='canceled'>Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
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
                  <TableCell colSpan={columns.length} className='text-center'>
                    No payments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className='flex items-center justify-between px-2 py-4'>
            <div className='flex-1 text-sm text-muted-foreground'>
              Showing{' '}
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}{' '}
              to{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{' '}
              of {table.getFilteredRowModel().rows.length} entries
            </div>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className='sr-only'>Go to first page</span>
                <ChevronsLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className='sr-only'>Go to previous page</span>
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className='sr-only'>Go to next page</span>
                <ChevronRight className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className='sr-only'>Go to last page</span>
                <ChevronsRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
