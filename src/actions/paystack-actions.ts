'use server'

import axios from 'axios'
import db from '@/lib/db'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
// const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
const PAYSTACK_BASE_URL = 'https://api.paystack.co'

const planCodeMap = {
  'Beginner Package': {
    standard: process.env.PAYSTACK_BEGINNER_STANDARD_CODE,
    premium: process.env.PAYSTACK_BEGINNER_PREMIUM_CODE,
  },
  'Intermediate Package': {
    standard: process.env.PAYSTACK_INTERMEDIATE_STANDARD_CODE,
    premium: process.env.PAYSTACK_INTERMEDIATE_PREMIUM_CODE,
  },
  'Advanced Package': {
    standard: process.env.PAYSTACK_ADVANCED_STANDARD_CODE,
    premium: process.env.PAYSTACK_ADVANCED_PREMIUM_CODE,
  },
}

export async function initializePaystackTransaction(
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

    // Get user details
    const user = await db.user.findUnique({
      where: { id: userId },
    })

    if (!user || !user.email) {
      return { error: 'User email not found' }
    }

    // Get Paystack plan code
    const planCode =
      planCodeMap[packageName as keyof typeof planCodeMap]?.[
        billingType as 'standard' | 'premium'
      ]
    console.log(planCode, packageName, billingType)
    if (!planCode) {
      throw new Error('Invalid package or billing type')
    }

    // Create a unique reference for the transaction
    const reference = `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create or get Paystack customer
    let customerCode = student.subscription?.paystackCustomerCode
    let customerId = student.subscription?.paystackCustomerId

    if (!customerCode) {
      const customerResponse = await axios.post(
        `${PAYSTACK_BASE_URL}/customer`,
        {
          email: user.email,
          first_name: user.name?.split(' ')[0],
          last_name: user.name?.split(' ')[1] || '',
          metadata: {
            userId,
            studentId: student.id,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      )

      customerCode = customerResponse.data.data.customer_code
      customerId = customerResponse.data.data.id
    }

    // Create or update subscription record
    await db.subscription.upsert({
      where: { studentId: student.id },
      create: {
        studentId: student.id,
        packageName,
        billingType,
        status: 'pending',
        paystackCustomerCode: customerCode,
        paystackCustomerId: customerId,
        paystackSubscriptionCode: null, // Will be updated after successful payment
      },
      update: {
        packageName,
        billingType,
      },
    })

    // Initialize the transaction
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email: user.email,
        plan: planCode,
        amount: 10200000,
        reference,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/student/payments`,
        webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/paystack/webhook`,
        metadata: {
          userId,
          studentId: student.id,
          packageName,
          billingType,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return {
      url: response.data.data.authorization_url,
      reference: response.data.data.reference,
    }
  } catch (error) {
    console.error('Error initializing Paystack transaction:', error)
    return {
      error:
        error instanceof Error ? error.message : 'Failed to initialize payment',
    }
  }
}

// function calculateAmount(packageName: string, billingType: string): number {
//   const packagePrices = {
//     basic: 5000,
//     standard: 10000,
//     premium: 15000,
//   }

//   const basePrice =
//     packagePrices[packageName as keyof typeof packagePrices] || 0
//   const yearlyDiscount = billingType === 'yearly' ? 0.8 : 1
//   const months = billingType === 'yearly' ? 12 : 1

//   return basePrice * yearlyDiscount * months
// }

export async function verifyPaystackTransaction(reference: string) {
  try {
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    )

    const transaction = response.data.data

    if (transaction.status === 'success') {
      // Get the customer ID from the transaction
      const customerId = transaction.customer.id

      // Get the subscription details for this customer
      const subscriptionResponse = await axios.get(
        `${PAYSTACK_BASE_URL}/subscription?customer=${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          },
        }
      )

      const subscriptions = subscriptionResponse.data.data
      const latestSubscription = subscriptions[0] // Get the most recent subscription

      console.log('lastest sub: ', latestSubscription)

      if (latestSubscription) {
        // Update the subscription record with active status and subscription code
        await db.subscription.update({
          where: {
            paystackCustomerId: customerId,
            studentId: transaction.metadata.studentId,
          },
          data: {
            status: 'active',
            paystackSubscriptionCode: latestSubscription.subscription_code,
            paystackEmailToken: latestSubscription.email_token,
          },
        })
      }

      return {
        success: true,
        data: transaction,
        subscription: latestSubscription,
      }
    }

    return {
      success: false,
      data: transaction,
    }
  } catch (error) {
    console.error('Error verifying Paystack transaction:', error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to verify payment',
    }
  }
}

export async function cancelPaystackSubscription(
  subscriptionCode: string,
  emailCode: string
) {
  try {
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/subscription/disable`,
      {
        code: subscriptionCode,
        token: emailCode,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return {
      success: true,
      message: 'Subscription cancelled successfully',
      data: response.data.data,
    }
  } catch (error) {
    console.error('Error cancelling subscription:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to cancel subscription',
      data: null,
    }
  }
}

export async function getSubscription(userId: string) {
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
    // console.log('student', student)
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

export async function getPaystackSubscriptionDetails(subscriptionCode: string) {
  try {
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/subscription/${subscriptionCode}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    )

    const subscription = response.data.data
    // console.log('subscription details:- ', subscription)
    return {
      success: true,
      details: {
        currentPeriodEnd: new Date(subscription.next_payment_date),
        cancelAtPeriodEnd: subscription.status === 'cancelled',
        status: subscription.status,
        nextPaymentAmount: subscription.amount
          ? (subscription.amount / 100).toFixed(2)
          : null,
        currency: subscription.plan.currency,
        plan: {
          name: subscription.plan.name,
          amount: subscription.plan.amount
            ? (subscription.plan.amount / 100).toFixed(2)
            : null,
          interval: subscription.plan.interval,
        },
      },
    }
  } catch (error) {
    console.error('Error retrieving Paystack subscription details:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to retrieve subscription details',
    }
  }
}
