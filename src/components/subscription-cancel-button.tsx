'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { cancelPaystackSubscription } from '@/actions/paystack-actions'

interface SubscriptionCancelButtonProps {
  subscriptionCode: string
}

export function SubscriptionCancelButton({
  subscriptionCode,
}: SubscriptionCancelButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleCancel = async () => {
    try {
      setIsLoading(true)
      const result = await cancelPaystackSubscription(subscriptionCode)

      toast({
        title: 'Success',
        description: result.message,
      })
    } catch (error) {
      console.error('error', error)
      toast({
        title: 'Error',
        description: 'Failed to cancel subscription',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleCancel} disabled={isLoading} variant='destructive'>
      {isLoading ? 'Cancelling...' : 'Cancel Subscription'}
    </Button>
  )
}
