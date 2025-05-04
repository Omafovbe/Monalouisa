'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { verifyPaystackTransaction } from '@/actions/paystack-actions'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function PaystackCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  )
  const [message, setMessage] = useState('')

  useEffect(() => {
    const reference = searchParams.get('reference')
    if (!reference) {
      setStatus('error')
      setMessage('No reference found in the URL')
      return
    }

    const verifyPayment = async () => {
      try {
        const result = await verifyPaystackTransaction(reference)

        if (result.success) {
          setStatus('success')
          setMessage(
            'Payment successful! Your subscription has been activated.'
          )
        } else {
          setStatus('error')
          setMessage('Payment verification failed. Please try again.')
        }
      } catch (error) {
        console.error(error)
        setStatus('error')
        setMessage('An error occurred while verifying your payment.')
      }
    }

    verifyPayment()
  }, [searchParams])

  return (
    <div className='container mx-auto py-8'>
      <Card className='max-w-md mx-auto p-6'>
        <div className='text-center'>
          {status === 'loading' && (
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4'></div>
          )}
          {status === 'success' && (
            <div className='text-green-500 mb-4'>
              <svg
                className='w-12 h-12 mx-auto'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
          )}
          {status === 'error' && (
            <div className='text-red-500 mb-4'>
              <svg
                className='w-12 h-12 mx-auto'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </div>
          )}
          <h2 className='text-2xl font-bold mb-4'>
            {status === 'loading' && 'Verifying Payment...'}
            {status === 'success' && 'Payment Successful!'}
            {status === 'error' && 'Payment Failed'}
          </h2>
          <p className='text-gray-600 mb-6'>{message}</p>
          <Button
            onClick={() => router.push('/student/paystack-test')}
            variant='default'
          >
            Return to Payment Page
          </Button>
        </div>
      </Card>
    </div>
  )
}
