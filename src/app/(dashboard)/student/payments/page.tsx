'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Check, CreditCard } from 'lucide-react'
import packages from '@/app/data/packages.json'
import {
  getSubscription,
  createCheckoutSession,
  handleSuccessfulPayment,
  cancelSubscription,
  getSubscriptionDetails,
} from '@/actions/stripe-actions'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { format } from 'date-fns'

interface Package {
  packageName: string
  monthlyCost: string
  numberOfLessons: string
  lessonDuration: string
  billingOptions: Array<{
    type: string
    discounts: string
    benefits: string[]
  }>
}

// interface Subscription {
//   id: string
//   studentId: string
//   packageName: string
//   billingType: string
//   status: string
//   stripeCustomerId: string | null
//   stripeSubscriptionId: string | null
// }

// interface SubscriptionResponse {
//   status: string
//   subscription: Subscription | null
// }

interface SubscriptionDetails {
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  status: string
  nextPaymentAmount: string | null
  currency: string
}

interface SubscriptionDetailsResponse {
  success: boolean
  details: SubscriptionDetails
  error?: string
}

export default function PaymentsPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()

  // Handle session expiration and unauthorized access
  useEffect(() => {
    if (!session) {
      router.push('/login')
    }
  }, [session, router])

  // Check for success/canceled status
  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')

  // Handle successful payment
  useEffect(() => {
    if (success) {
      const sessionId = searchParams.get('session_id')
      if (sessionId) {
        handleSuccessfulPayment(sessionId)
          .then((result) => {
            if (result.error) {
              toast({
                title: 'Error',
                description: result.error,
                variant: 'destructive',
              })
            } else {
              toast({
                title: 'Success',
                description: 'Your subscription is now active.',
              })
            }
          })
          .catch((error) => {
            console.log('error', error)
            toast({
              title: 'Error',
              description: 'Failed to process payment',
              variant: 'destructive',
            })
          })
          .finally(() => {
            router.replace('/student/payments') // Remove query params
          })
      }
    }
    if (canceled) {
      toast({
        title: 'Payment canceled',
        description: 'Please try again',
        variant: 'destructive',
      })
      router.replace('/student/payments') // Remove query params
    }
  }, [success, canceled, searchParams, router])

  // Fetch current subscription
  const {
    data: subscriptionData,
    isLoading: isLoadingSubscription,
    // error: subscriptionError,
  } = useQuery({
    queryKey: ['subscription', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null
      return getSubscription(session.user.id)
    },
    enabled: !!session?.user?.id,
  })

  const hasActiveSubscription = Boolean(
    subscriptionData?.status === 'HAS_SUBSCRIPTION' &&
      subscriptionData?.subscription
  )
  const currentSubscription = subscriptionData?.subscription
  console.log('subscriptionData', currentSubscription)

  // Add new state and query for subscription details
  const [isCanceling, setIsCanceling] = useState(false)

  const { data: subscriptionDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: [
      'subscription-details',
      currentSubscription?.stripeSubscriptionId,
    ],
    queryFn: async () => {
      if (!currentSubscription?.stripeSubscriptionId) {
        throw new Error('No subscription ID')
      }
      const result = await getSubscriptionDetails(
        currentSubscription.stripeSubscriptionId
      )
      if (result.error) {
        throw new Error(result.error)
      }
      return result as SubscriptionDetailsResponse
    },
    enabled: !!currentSubscription?.stripeSubscriptionId,
  })

  const handleUpgrade = async (packageName: string, billingType: string) => {
    try {
      setIsLoading(true)
      setSelectedPackage(packageName)

      if (!session?.user?.id) {
        throw new Error('User not authenticated')
      }

      const result = await createCheckoutSession(
        session.user.id,
        packageName,
        billingType
      )

      console.log('result', result)

      if (result.url) {
        window.location.href = result.url
      }
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to create checkout session',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
      setSelectedPackage(null)
    }
  }

  const handleCancelSubscription = async () => {
    if (!currentSubscription?.stripeSubscriptionId) return

    try {
      setIsCanceling(true)
      const result = await cancelSubscription(
        currentSubscription.stripeSubscriptionId
      )

      if (result.error) {
        throw new Error(result.error)
      }

      toast({
        title: 'Success',
        description:
          'Your subscription will be canceled at the end of the billing period.',
      })

      // Refetch subscription data
      void queryClient.invalidateQueries({ queryKey: ['subscription'] })
      void queryClient.invalidateQueries({ queryKey: ['subscription-details'] })
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to cancel subscription',
        variant: 'destructive',
      })
    } finally {
      setIsCanceling(false)
    }
  }

  if (isLoadingSubscription) {
    return (
      <div className='flex justify-center items-center min-h-[50vh]'>
        <Spinner size={32} />
      </div>
    )
  }

  return (
    <div className='container mx-auto p-6 pb-20'>
      <div className='flex flex-col gap-4 mb-8'>
        <h1 className='text-3xl font-bold'>Subscription & Payments</h1>

        {/* <pre>{JSON.stringify(subscriptionData, null, 2)}</pre> */}
        <p className='text-muted-foreground'>
          {hasActiveSubscription
            ? 'Manage your current subscription or upgrade your plan'
            : 'Choose the package that best suits your learning needs'}
        </p>
      </div>

      {/* Current Subscription Card */}
      {hasActiveSubscription && (
        <Card className='mb-8'>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>Your active learning package</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='font-semibold'>
                    {currentSubscription?.packageName}
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    {currentSubscription?.billingType}
                  </p>
                </div>
                <Badge variant='secondary'>{currentSubscription?.status}</Badge>
              </div>

              {isLoadingDetails ? (
                <div className='flex justify-center py-2'>
                  <Spinner size={16} />
                </div>
              ) : subscriptionDetails?.success &&
                subscriptionDetails?.details ? (
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Next payment:</span>
                    <span className='font-medium'>
                      {format(
                        new Date(subscriptionDetails.details.currentPeriodEnd),
                        'MMMM d, yyyy'
                      )}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Amount:</span>
                    <span className='font-medium'>
                      {subscriptionDetails.details.nextPaymentAmount}{' '}
                      {subscriptionDetails.details.currency}
                    </span>
                  </div>
                  {subscriptionDetails.details.cancelAtPeriodEnd && (
                    <p className='text-yellow-600 mt-2'>
                      Your subscription will end on{' '}
                      {format(
                        new Date(subscriptionDetails.details.currentPeriodEnd),
                        'MMMM d, yyyy'
                      )}
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant='destructive'
              onClick={handleCancelSubscription}
              disabled={
                isCanceling || subscriptionDetails?.details?.cancelAtPeriodEnd
              }
              className='w-full'
            >
              {isCanceling ? (
                <>
                  <Spinner size={16} className='mr-2' />
                  Canceling...
                </>
              ) : subscriptionDetails?.details?.cancelAtPeriodEnd ? (
                'Cancellation Scheduled'
              ) : (
                'Cancel Subscription'
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Package Cards */}
      <div className='grid gap-6 md:grid-cols-3'>
        {packages.packages.map((pkg: Package) => (
          <Card key={pkg.packageName} className='relative'>
            {hasActiveSubscription &&
              currentSubscription?.packageName === pkg.packageName && (
                <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
                  <Badge variant='default'>Current Plan</Badge>
                </div>
              )}
            <CardHeader>
              <CardTitle>{pkg.packageName}</CardTitle>
              <CardDescription>{pkg.numberOfLessons}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <div className='text-2xl font-bold'>
                  {pkg.monthlyCost} USD
                  <span className='text-sm font-normal text-muted-foreground'>
                    /month
                  </span>
                </div>
                <p className='text-sm text-muted-foreground'>
                  {pkg.lessonDuration} per lesson
                </p>
              </div>

              {/* Standard Benefits */}
              <div>
                <h4 className='font-semibold mb-2'>
                  Standard Package Includes:
                </h4>
                <ul className='space-y-2'>
                  {pkg.billingOptions[0].benefits.map((benefit, idx) => (
                    <li key={idx} className='flex items-start gap-2'>
                      <Check className='h-4 w-4 text-green-500 mt-1 flex-shrink-0' />
                      <span className='text-sm'>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Premium Benefits */}
              <div>
                <h4 className='font-semibold mb-2'>Premium Package Adds:</h4>
                <ul className='space-y-2'>
                  {pkg.billingOptions[1].benefits
                    .filter((b) => !pkg.billingOptions[0].benefits.includes(b))
                    .map((benefit, idx) => (
                      <li key={idx} className='flex items-start gap-2'>
                        <Check className='h-4 w-4 text-green-500 mt-1 flex-shrink-0' />
                        <span className='text-sm'>{benefit}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className='flex flex-col gap-2'>
              <Button
                className='w-full'
                onClick={() => handleUpgrade(pkg.packageName, 'standard')}
                disabled={
                  (isLoading && selectedPackage === pkg.packageName) ||
                  (hasActiveSubscription &&
                    currentSubscription?.packageName === pkg.packageName)
                }
              >
                {isLoading && selectedPackage === pkg.packageName ? (
                  <Spinner size={16} className='mr-2' />
                ) : (
                  <CreditCard className='h-4 w-4 mr-2' />
                )}
                Get Standard
              </Button>
              <Button
                variant='outline'
                className='w-full'
                onClick={() => handleUpgrade(pkg.packageName, 'premium')}
                disabled={
                  (isLoading && selectedPackage === pkg.packageName) ||
                  (hasActiveSubscription &&
                    currentSubscription?.packageName === pkg.packageName)
                }
              >
                {isLoading && selectedPackage === pkg.packageName ? (
                  <Spinner size={16} className='mr-2' />
                ) : (
                  <CreditCard className='h-4 w-4 mr-2' />
                )}
                Get Premium
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
