'use client'

import { getTeacherApplications } from '@/action/actions'
import { useQuery } from '@tanstack/react-query'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export default function ApplicationsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: getTeacherApplications,
  })

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

  if (isLoading) {
    return (
      <div className='h-[calc(100vh-4rem)] flex items-center justify-center'>
        <Spinner size={32} variant='primary' />
      </div>
    )
  }

  return (
    <div className='p-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>Teacher Applications</h1>
        <p className='text-muted-foreground'>
          Manage and review teacher applications
        </p>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.applications?.length ? (
              data.applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>{application.name}</TableCell>
                  <TableCell>{application.email}</TableCell>
                  <TableCell>{application.yearsOfExperience} years</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(application.status)}>
                      {application.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(application.createdAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant='ghost' size='sm'>
                      <Link href={`/admin/applications/${application.id}`}>
                        View <ArrowRight className='ml-2 h-4 w-4' />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className='h-24 text-center'>
                  No applications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
