'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export type Application = {
  id: number
  name: string
  email: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: Date
  yearsOfExperience: number
}

export const columns: ColumnDef<Application>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'yearsOfExperience',
    header: 'Experience',
    cell: ({ row }) => `${row.original.yearsOfExperience} years`,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      return <Badge variant={getStatusVariant(status)}>{status}</Badge>
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Applied',
    cell: ({ row }) =>
      formatDistanceToNow(new Date(row.original.createdAt), {
        addSuffix: true,
      }),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Button asChild variant='ghost' size='sm'>
        <Link href={`/admin/applications/${row.original.id}`}>
          View <ArrowRight className='ml-2 h-4 w-4' />
        </Link>
      </Button>
    ),
  },
]

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return 'secondary'
    case 'REJECTED':
      return 'destructive'
    default:
      return 'default'
  }
}
