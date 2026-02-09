'use client'

import { Check } from 'lucide-react'

interface PricingCardProps {
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  cta: string
  href: string
  popular?: boolean
}

export default function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  href,
  popular = false,
}: PricingCardProps) {
  return (
    <div className={`card relative ${popular ? 'border-2 border-[var(--accent)] scale-105' : 'border border-gray-200'}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-white text-xs font-bold px-4 py-1 rounded-full">
          POPULAR
        </div>
      )}
      <h3 className="text-xl font-bold text-[var(--navy)]">{name}</h3>
      <p className="text-gray-500 text-sm mt-1">{description}</p>
      <div className="mt-6 mb-6">
        <span className="text-4xl font-bold text-[var(--navy)]">{price}</span>
        {period && <span className="text-gray-500 ml-1">/{period}</span>}
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
            <Check className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <a
        href={href}
        className={`block text-center py-3 rounded-lg font-semibold transition ${
          popular ? 'btn-primary w-full' : 'btn-secondary w-full'
        }`}
      >
        {cta}
      </a>
    </div>
  )
}
