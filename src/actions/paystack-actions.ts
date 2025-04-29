'use server'

import axios from 'axios'

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
  packageName: string,
  billingType: string
) {
  try {
    // Calculate the amount based on package and billing type
    // const amount = calculateAmount(packageName, billingType)

    // Get Paystack plan code
    const planCode =
      planCodeMap[packageName as keyof typeof planCodeMap]?.[
        billingType as 'standard' | 'premium'
      ]
    console.log(planCode)
    if (!planCode) {
      throw new Error('Invalid package or billing type')
    }

    // Create a unique reference for the transaction
    const reference = `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Initialize the transaction
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email: 'you@test.com', // Replace with actual user email
        plan: planCode,
        amount: 10200000,
        reference,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/student/paystack-test/callback`,
        webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/paystack/webhook`,
        metadata: {
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
    throw new Error('Failed to initialize payment')
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

    return {
      success: response.data.data.status === 'success',
      data: response.data.data,
    }
  } catch (error) {
    console.error('Error verifying Paystack transaction:', error)
    throw new Error('Failed to verify payment')
  }
}

export async function cancelPaystackSubscription(subscriptionCode: string) {
  try {
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/subscription/disable`,
      {
        code: subscriptionCode,
        token: PAYSTACK_SECRET_KEY,
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
    throw new Error('Failed to cancel subscription')
  }
}
