import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const signature = req.headers.get('x-paystack-signature')

    // Verify the webhook signature
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(JSON.stringify(body))
      .digest('hex')

    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle different event types
    switch (body.event) {
      case 'subscription.create':
        console.log('New subscription created:', {
          subscriptionCode: body.data.subscription_code,
          customerEmail: body.data.customer.email,
          planCode: body.data.plan.plan_code,
        })
        break

      case 'charge.success':
        console.log('Payment successful:', {
          subscriptionCode: body.data.subscription?.subscription_code,
          customerEmail: body.data.customer?.email,
          amount: body.data.amount,
          reference: body.data.reference,
        })
        break

      default:
        console.log('Unhandled event:', body.event)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
