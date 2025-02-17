import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { handleSubscriptionChange } from '@/actions/stripe-actions'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = (await headers()).get('stripe-signature')

    if (!signature) {
      return new NextResponse('No signature', { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    // Handle subscription events
    if (
      event.type === 'customer.subscription.created' ||
      event.type === 'customer.subscription.updated' ||
      event.type === 'customer.subscription.deleted'
    ) {
      const subscription = event.data.object as Stripe.Subscription
      await handleSubscriptionChange(
        subscription.id,
        subscription.customer as string,
        subscription.status
      )
    }

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error('Error in webhook:', error)
    return new NextResponse('Webhook error', { status: 400 })
  }
}
