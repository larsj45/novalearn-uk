'use client'

import { useState } from 'react'
import { Check, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const creditPacks = [
  { quantity: 1, price: '£0.50', label: '1 analysis', icon: '1x' },
  { quantity: 10, price: '£5', label: '10 analyses', icon: '10x', popular: true },
  { quantity: 50, price: '£25', label: '50 analyses', icon: '50x' },
]

const plans = [
  {
    id: 'pro',
    name: 'Professional',
    price: '£21',
    period: '/month',
    description: 'For teachers and consultants',
    features: [
      '1,000 analyses per month',
      'API access (500 calls)',
      'PDF/CSV export',
      'Email support',
      '30-day history',
    ],
    popular: true,
  },
  {
    id: 'university',
    name: 'University',
    price: '£129',
    period: '/month',
    description: 'For educational institutions',
    features: [
      '10,000 analyses per month',
      'Unlimited API',
      'LMS integration',
      'Admin dashboard',
      'Priority support',
      'Custom reports',
    ],
    popular: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '£429',
    period: '/month',
    description: 'For national organisations',
    features: [
      'Unlimited analyses',
      'White-label API',
      'Dedicated account manager',
      '99.9% SLA',
      'Custom features',
      'Bespoke billing',
    ],
    popular: false,
  },
]

export default function UpgradePage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [creditLoading, setCreditLoading] = useState<number | null>(null)

  async function handleBuyCredits(quantity: number) {
    setCreditLoading(quantity)
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        window.location.href = '/login'
        return
      }

      const response = await fetch('/api/checkout-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ quantity }),
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Failed to start checkout. Please try again.')
      }
    } catch {
      alert('Failed to start checkout. Please try again.')
    } finally {
      setCreditLoading(null)
    }
  }

  async function handleUpgrade(planId: string) {
    if (planId === 'enterprise') {
      window.location.href = 'mailto:hello@novalearn.co.uk?subject=Enterprise%20Plan%20Enquiry'
      return
    }

    setLoading(planId)
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        window.location.href = '/login'
        return
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ plan: planId }),
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Failed to start checkout. Please try again.')
      }
    } catch {
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <Link href="/dashboard/account" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[var(--navy)] mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Account
        </Link>
        <h1 className="text-2xl font-bold text-[var(--navy)]">Purchase Credits</h1>
        <p className="text-gray-500 mt-1">Pay per analysis at £0.50 each. No subscription required.</p>
      </div>

      {/* Credit Packs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {creditPacks.map((pack) => (
          <div
            key={pack.quantity}
            className={`card relative text-center ${pack.popular ? 'ring-2 ring-[var(--accent)]' : ''}`}
          >
            {pack.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-white text-xs font-semibold px-3 py-1 rounded-full">
                POPULAR
              </div>
            )}
            <div className="text-3xl font-bold text-[var(--navy)] mb-2">{pack.icon}</div>
            <p className="text-sm text-gray-500 mb-1">{pack.label}</p>
            <p className="text-2xl font-bold text-[var(--navy)] mb-4">{pack.price}</p>
            <button
              onClick={() => handleBuyCredits(pack.quantity)}
              disabled={creditLoading !== null}
              className={`w-full py-3 rounded-xl font-semibold transition ${
                pack.popular
                  ? 'btn-primary'
                  : 'bg-gray-100 text-[var(--navy)] hover:bg-gray-200'
              } disabled:opacity-50`}
            >
              {creditLoading === pack.quantity ? 'Loading...' : 'Buy'}
            </button>
          </div>
        ))}
      </div>

      {/* Subscription Plans */}
      <div className="border-t border-gray-200 pt-8 mb-8">
        <h2 className="text-xl font-bold text-[var(--navy)] mb-2">Subscription Plans</h2>
        <p className="text-gray-500 mb-6">For teams and institutions needing regular, high-volume analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`card relative ${plan.popular ? 'ring-2 ring-[var(--accent)]' : ''}`}
          >
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-[var(--navy)]">{plan.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
              <div className="mt-4">
                <span className="text-3xl font-bold text-[var(--navy)]">{plan.price}</span>
                <span className="text-gray-500">{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-[var(--success)] flex-shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade(plan.id)}
              disabled={loading !== null}
              className={`w-full py-3 rounded-xl font-semibold transition bg-gray-100 text-[var(--navy)] hover:bg-gray-200 disabled:opacity-50`}
            >
              {loading === plan.id
                ? 'Loading...'
                : plan.id === 'enterprise'
                ? 'Contact Us'
                : `Choose ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      <div className="text-center mt-8 text-sm text-gray-400">
        Credits never expire. Subscriptions billed monthly, cancel anytime. Powered by Stripe.
      </div>
    </div>
  )
}
