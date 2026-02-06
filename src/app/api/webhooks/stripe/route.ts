import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { sendEmail, subscriptionConfirmedEmail } from '@/lib/email'

// Map price IDs to plan names
const getPlanFromPriceId = (priceId: string): string => {
  const priceMap: Record<string, string> = {
    [process.env.STRIPE_PRO_PRICE_ID || '']: 'pro',
    [process.env.STRIPE_UNIVERSITY_PRICE_ID || '']: 'university',
    [process.env.STRIPE_ENTERPRISE_PRICE_ID || '']: 'enterprise',
  }
  return priceMap[priceId] || 'pro'
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.supabase_user_id
      const plan = session.metadata?.plan || 'pro'
      if (userId) {
        // Update profile with subscription info
        const { data: profile } = await supabase
          .from('profiles')
          .update({
            plan,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
          })
          .eq('id', userId)
          .select('full_name')
          .single()

        // Send subscription confirmation email
        const customerEmail = session.customer_email || session.customer_details?.email
        if (customerEmail) {
          const name = profile?.full_name || customerEmail.split('@')[0]
          const email = subscriptionConfirmedEmail(name, plan)
          await sendEmail({
            to: customerEmail,
            subject: email.subject,
            html: email.html,
            text: email.text,
          })
        }
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_subscription_id', subscription.id)
        .limit(1)

      if (profiles && profiles[0]) {
        const isActive = ['active', 'trialing'].includes(subscription.status)
        const priceId = subscription.items.data[0]?.price?.id || ''
        const plan = isActive ? getPlanFromPriceId(priceId) : 'free'
        await supabase
          .from('profiles')
          .update({ plan })
          .eq('id', profiles[0].id)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      await supabase
        .from('profiles')
        .update({ plan: 'free', stripe_subscription_id: null })
        .eq('stripe_subscription_id', subscription.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
