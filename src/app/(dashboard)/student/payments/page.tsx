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
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
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
import packagesData from '@/app/data/packages.json'

// interface Subscription {
//   id: string
//   status: string
//   createdAt: Date
//   updatedAt: Date
//   studentId: string
//   packageName: string
//   billingType: string
//   stripeCustomerId: string | null
//   stripeSubscriptionId: string | null
// }

// interface SubscriptionResponse {
//   subscription: Subscription | null
//   error?: string
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
  const [isCanceling, setIsCanceling] = useState(false)
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

  // const hasActiveSubscription = Boolean(
  //   subscriptionData?.status === 'HAS_SUBSCRIPTION' &&
  //     subscriptionData?.subscription
  // )
  const currentSubscription = subscriptionData?.subscription
  console.log('subscriptionData', currentSubscription)

  // Add new state and query for subscription details
  const {
    data: subscriptionDetails,
    // isLoading: isLoadingDetails,
    error: subscriptionDetailsError,
  } = useQuery({
    queryKey: [
      'subscription-details',
      currentSubscription?.stripeSubscriptionId,
    ],
    queryFn: async () => {
      console.log(
        'Fetching subscription details for ID:',
        currentSubscription?.stripeSubscriptionId
      )

      if (!currentSubscription?.stripeSubscriptionId) {
        console.error('No subscription ID available')
        throw new Error('No subscription ID available')
      }

      try {
        const result = await getSubscriptionDetails(
          currentSubscription.stripeSubscriptionId
        )

        console.log('Subscription details result:', result)

        if (result.error) {
          console.error('Error from getSubscriptionDetails:', result.error)
          throw new Error(result.error)
        }

        if (!result.success || !result.details) {
          console.error('Invalid response format:', result)
          throw new Error('Invalid response format from subscription details')
        }

        return result as SubscriptionDetailsResponse
      } catch (error) {
        console.error('Error fetching subscription details:', error)
        throw error
      }
    },
    enabled: !!currentSubscription?.stripeSubscriptionId,
    retry: 1, // Only retry once on failure
  })

  // Add error display in the UI
  useEffect(() => {
    if (subscriptionDetailsError) {
      toast({
        title: 'Error',
        description:
          subscriptionDetailsError instanceof Error
            ? subscriptionDetailsError.message
            : 'Failed to fetch subscription details',
        variant: 'destructive',
      })
    }
  }, [subscriptionDetailsError])

  // Transform packages data for display
  const packages = packagesData.packages.map((pkg) => ({
    packageName: pkg.packageName,
    plans: [
      {
        name: 'Standard',
        price: parseFloat(pkg.monthlyCost.split(' - ')[0]),
        interval: 'month',
        features: pkg.billingOptions[0].benefits,
        isPopular: pkg.packageName === 'Intermediate Package',
      },
      {
        name: 'Premium',
        price: parseFloat(pkg.monthlyCost.split(' - ')[1]),
        interval: 'month',
        features: pkg.billingOptions[1].benefits,
        isPopular: pkg.packageName === 'Intermediate Package',
      },
    ],
  }))

  const handleUpgrade = async (packageName: string, billingType: string) => {
    try {
      if (!session?.user?.id) {
        toast({
          title: 'Error',
          description: 'Please sign in to upgrade your subscription',
          variant: 'destructive',
        })
        return
      }

      setIsLoading(true)
      setSelectedPackage(packageName)

      console.log('Creating checkout session for:', {
        userId: session.user.id,
        packageName,
        billingType,
      })

      const result = await createCheckoutSession(
        session.user.id,
        packageName,
        billingType.toLowerCase()
      )

      console.log('Checkout session result:', result)

      if (result.error) {
        throw new Error(result.error)
      }

      if (result.url) {
        window.location.href = result.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      console.error('Error in handleUpgrade:', error)
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
    <div className='container mx-auto py-10'>
      <div className='space-y-6'>
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold'>Choose Your Plan</h1>
          <p className='text-muted-foreground'>
            Select the perfect learning package for your needs
          </p>
        </div>

        <div className='grid gap-8'>
          {packages.map((pkg) => (
            <div key={pkg.packageName} className='space-y-4'>
              <h2 className='text-2xl font-semibold text-center'>
                {pkg.packageName}
              </h2>
              <div className='grid md:grid-cols-2 gap-8'>
                {pkg.plans.map((plan) => (
                  <Card
                    key={plan.name}
                    className={cn(
                      'relative',
                      subscriptionData?.subscription?.packageName ===
                        pkg.packageName &&
                        subscriptionData?.subscription?.billingType.toLowerCase() ===
                          plan.name.toLowerCase()
                        ? 'border-primary'
                        : ''
                    )}
                  >
                    {/* {plan.isPopular && (
                      <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
                        <Badge className='bg-primary text-white'>
                          Most Popular
                        </Badge>
                      </div>
                    )} */}
                    {subscriptionData?.subscription?.packageName ===
                      pkg.packageName &&
                      subscriptionData?.subscription?.billingType.toLowerCase() ===
                        plan.name.toLowerCase() && (
                        <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
                          <Badge className='bg-green-500 text-white'>
                            Current Plan
                          </Badge>
                        </div>
                      )}
                    <CardHeader>
                      <CardTitle className='flex items-baseline justify-between'>
                        <span>{plan.name}</span>
                        <span className='text-3xl font-bold'>
                          ${plan.price}
                          <span className='text-sm font-normal text-muted-foreground'>
                            /mo
                          </span>
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className='space-y-2'>
                        {plan.features.map((feature, i) => (
                          <li key={i} className='flex items-center gap-2'>
                            <Check className='h-4 w-4 text-primary' />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className='w-full hover:bg-opal hover:text-eastern-blue-400'
                        // variant={plan.isPopular ? 'default' : 'outline'}
                        variant='default'
                        disabled={
                          isLoading ||
                          (subscriptionData?.subscription?.packageName ===
                            pkg.packageName &&
                            subscriptionData?.subscription?.billingType.toLowerCase() ===
                              plan.name.toLowerCase())
                        }
                        onClick={() =>
                          handleUpgrade(pkg.packageName, plan.name)
                        }
                      >
                        {isLoading && selectedPackage === pkg.packageName ? (
                          <Spinner size={16} className='mr-2' />
                        ) : subscriptionData?.subscription?.packageName ===
                            pkg.packageName &&
                          subscriptionData?.subscription?.billingType.toLowerCase() ===
                            plan.name.toLowerCase() ? (
                          'Current Plan'
                        ) : (
                          'Upgrade'
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {subscriptionData?.subscription && (
          <Card className='mt-8'>
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
              <CardDescription>
                Your current plan and billing details
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex justify-between items-center'>
                <div>
                  <p className='font-medium'>
                    {subscriptionData.subscription.packageName} -{' '}
                    {subscriptionData.subscription.billingType} Plan
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {subscriptionDetails?.details?.currentPeriodEnd ? (
                      <>
                        Next billing date:{' '}
                        {format(
                          subscriptionDetails.details.currentPeriodEnd,
                          'PPP'
                        )}
                      </>
                    ) : (
                      'Loading billing details...'
                    )}
                  </p>
                </div>
                <Button
                  variant='destructive'
                  disabled={isCanceling}
                  onClick={handleCancelSubscription}
                >
                  {isCanceling ? <Spinner size={16} className='mr-2' /> : null}
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
