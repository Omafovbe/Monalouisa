'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateApplicationStatus } from '@/actions/actions'

export function ApplicationActions({
  applicationId,
  currentStatus,
}: {
  applicationId: number
  currentStatus: string
}) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

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

  const { mutate, isPending } = useMutation({
    mutationFn: ({ status }: { status: 'APPROVED' | 'REJECTED' }) =>
      updateApplicationStatus(applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({
        queryKey: ['application', applicationId],
      })
      toast({
        title: 'Success',
        description: 'Application status updated successfully',
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update application status',
        variant: 'destructive',
      })
    },
  })

  if (currentStatus !== 'PENDING') {
    return (
      <Badge variant={getStatusVariant(currentStatus)}>{currentStatus}</Badge>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' disabled={isPending}>
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem
          onClick={() => mutate({ status: 'APPROVED' })}
          className='text-green-600'
        >
          Approve
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => mutate({ status: 'REJECTED' })}
          className='text-red-600'
        >
          Reject
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
