'use server'

import Stripe from 'stripe'
import db from '@/lib/db'
// import { priceMap } from '@/app/data/packages'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
})

export async function createCheckoutSession(
  userId: string,
  packageName: string,
  billingType: string
) {
  try {
    // Get the student record
    const student = await db.student.findFirst({
      where: { userId },
      include: { subscription: true },
    })

    if (!student) {
      return { error: 'Student not found' }
    }

    // Get or create Stripe customer
    let customerId = student.subscription?.stripeCustomerId

    if (!customerId) {
      const user = await db.user.findUnique({
        where: { id: userId },
      })

      if (!user || !user.email) {
        return { error: 'User email not found' }
      }

      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          name: user.name,
          userId,
          studentId: student.id,
        },
      })
      customerId = customer.id

      // Create or update subscription record
      await db.subscription.upsert({
        where: { studentId: student.id },
        create: {
          studentId: student.id,
          packageName,
          billingType,
          status: 'pending',
          stripeCustomerId: customerId,
          stripeSubscriptionId: null, // Will be updated after successful payment
        },
        update: {
          packageName,
          billingType,
          status: 'pending',
          stripeCustomerId: customerId,
        },
      })
    }

    // Get price ID based on package and billing type
    const priceId = getPriceId(packageName, billingType)

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/student/payments?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/student/payments?canceled=true`,
      metadata: {
        userId,
        studentId: student.id,
        packageName,
        billingType,
      },
    })

    // After successful session creation, update the subscription with session ID
    if (session.id) {
      await db.subscription.update({
        where: { studentId: student.id },
        data: {
          stripeSubscriptionId: session.id,
        },
      })
    }

    return { url: session.url }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create checkout session',
    }
  }
}

export async function handleSubscriptionChange(
  subscriptionId: string,
  customerId: string,
  status: string
) {
  try {
    const customer = (await stripe.customers.retrieve(
      customerId
    )) as Stripe.Customer
    const studentId = customer.metadata?.studentId

    if (!studentId) {
      throw new Error('Student ID not found in customer metadata')
    }

    // Update or create subscription record
    await db.subscription.upsert({
      where: { studentId },
      create: {
        id: subscriptionId,
        studentId,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        status,
        packageName: customer.metadata.packageName || 'default',
        billingType: customer.metadata.billingType || 'standard',
      },
      update: {
        status,
        stripeSubscriptionId: subscriptionId,
      },
    })
  } catch (error) {
    console.error('Error handling subscription change:', error)
    throw error
  }
}

function getPriceId(packageName: string, billingType: string): string {
  const priceMap = {
    'Beginner Package': {
      standard: process.env.STRIPE_BEGINNER_STANDARD_PRICE_ID,
      premium: process.env.STRIPE_BEGINNER_PREMIUM_PRICE_ID,
    },
    'Intermediate Package': {
      standard: process.env.STRIPE_INTERMEDIATE_STANDARD_PRICE_ID,
      premium: process.env.STRIPE_INTERMEDIATE_PREMIUM_PRICE_ID,
    },
    'Advanced Package': {
      standard: process.env.STRIPE_ADVANCED_STANDARD_PRICE_ID,
      premium: process.env.STRIPE_ADVANCED_PREMIUM_PRICE_ID,
    },
  }

  const price =
    priceMap[packageName as keyof typeof priceMap]?.[
      billingType as 'standard' | 'premium'
    ]

  if (!price) {
    throw new Error(
      `Invalid package name (${packageName}) or billing type (${billingType})`
    )
  }

  return price
}

export async function getSubscription(userId: string) {
  console.log(userId)
  if (!userId) {
    return {
      status: 'NO_SUBSCRIPTION',
      subscription: null,
      error: 'User ID is required',
    }
  }

  try {
    const student = await db.student.findFirst({
      where: { userId },
      include: { subscription: true },
    })

    if (!student) {
      return {
        status: 'NO_SUBSCRIPTION',
        subscription: null,
        error: 'Student record not found',
      }
    }
    console.log('student', student)
    // Return null if no subscription exists
    if (!student.subscription) {
      return {
        status: 'NO_SUBSCRIPTION',
        subscription: null,
      }
    }

    return {
      status: 'HAS_SUBSCRIPTION',
      subscription: student.subscription,
    }
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return {
      status: 'NO_SUBSCRIPTION',
      subscription: null,
      error:
        error instanceof Error ? error.message : 'Failed to fetch subscription',
    }
  }
}

export async function retrieveStripeCheckoutSession(sessionId: string) {
  if (!sessionId) {
    return { success: false, error: 'No session ID provided.' }
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return { success: true, session }
  } catch (error) {
    console.error('Error retrieving checkout session:', error)
    throw error
  }

  // const user = await currentUser()
  // if (!user) {
  //   return { success: false, error: 'You need to sign in first.' }
  // }

  // const session = await stripe.checkout.sessions.retrieve(sessionId, {
  //   expand: ['subscription']
  // })
}

// Add function to handle successful payment
export async function handleSuccessfulPayment(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    })

    if (!session?.metadata?.studentId) {
      throw new Error('No student ID in session metadata')
    }

    // Update subscription record with active status and subscription ID
    await db.subscription.update({
      where: { studentId: session.metadata.studentId },
      data: {
        status: 'active',
        stripeSubscriptionId:
          typeof session.subscription === 'string'
            ? null
            : session.subscription?.id || null,
        packageName: session.metadata.packageName,
        billingType: session.metadata.billingType,
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Error handling successful payment:', error)
    return {
      error:
        error instanceof Error ? error.message : 'Failed to process payment',
    }
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    // Cancel the subscription at period end
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })

    // Update the subscription status in the database
    if (subscription.customer) {
      const customer = (await stripe.customers.retrieve(
        subscription.customer as string,
        { expand: ['metadata'] }
      )) as Stripe.Customer
      const studentId = customer.metadata?.studentId

      if (studentId) {
        await db.subscription.update({
          where: { studentId },
          data: {
            status: 'canceling',
          },
        })
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error canceling subscription:', error)
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Failed to cancel subscription',
    }
  }
}

export async function getSubscriptionDetails(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    return {
      success: true,
      details: {
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        status: subscription.status,
        nextPaymentAmount: subscription.items.data[0]?.price.unit_amount
          ? (subscription.items.data[0].price.unit_amount / 100).toFixed(2)
          : null,
        currency: subscription.currency.toUpperCase(),
      },
    }
  } catch (error) {
    console.error('Error retrieving subscription details:', error)
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Failed to retrieve subscription details',
    }
  }
}

export async function getPayments() {
  try {
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100,
      expand: ['data.customer'],
    })

    // Extract just the customer IDs from the customer objects
    const customerIds = [
      ...new Set(
        paymentIntents.data
          .map((pi) => {
            const customer = pi.customer as Stripe.Customer
            return customer?.id
          })
          .filter((id): id is string => Boolean(id))
      ),
    ]

    // console.log('Number of unique customerIds:', customerIds.length)

    if (customerIds.length === 0) {
      return { payments: [] }
    }

    // Get all subscriptions for these customers
    const subscriptions = await db.subscription.findMany({
      where: {
        stripeCustomerId: {
          in: customerIds,
          not: null,
        },
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
    })

    // console.log('Number of subscriptions found:', subscriptions.length)

    // Create a map of customer IDs to user details
    const customerMap = new Map(
      subscriptions.map((sub) => [
        sub.stripeCustomerId,
        {
          name: sub.student.user.name,
          email: sub.student.user.email,
          packageName: sub.packageName,
          billingType: sub.billingType,
        },
      ])
    )

    const payments = paymentIntents.data.map((payment) => {
      const customer = payment.customer as Stripe.Customer
      return {
        id: payment.id,
        amount: payment.amount / 100,
        currency: payment.currency.toUpperCase(),
        status: payment.status,
        created: new Date(payment.created * 1000),
        customerDetails: customerMap.get(customer?.id || '') || null,
      }
    })
    // console.log('payments', payments)
    return { payments }
  } catch (error) {
    console.error('Error fetching payments:', error)
    return {
      error:
        error instanceof Error ? error.message : 'Failed to fetch payments',
    }
  }
}
