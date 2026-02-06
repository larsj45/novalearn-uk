'use client'

import { useEffect, useState } from 'react'
import { CreditCard, User } from 'lucide-react'

export default function AccountPage() {
  const [user, setUser] = useState<{ email: string; full_name: string; plan: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    loadUser()
  }, [])

  async function loadUser() {
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, plan')
        .eq('id', authUser.id)
        .single()

      setUser({
        email: authUser.email || '',
        full_name: profile?.full_name || '',
        plan: profile?.plan || 'free',
      })
    } catch {
      console.error('Failed to load user')
    } finally {
      setLoading(false)
    }
  }

  async function openBillingPortal() {
    setPortalLoading(true)
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data: { session } } = await supabase.auth.getSession()

      const response = await fetch('/api/billing-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      console.error('Failed to open billing portal')
    } finally {
      setPortalLoading(false)
    }
  }

  const planLabels: Record<string, string> = {
    free: 'Gratuit',
    pro: 'Pro',
    enterprise: 'Entreprise',
  }

  if (loading) {
    return <div className="card text-center text-gray-500 py-12">Chargement...</div>
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-[var(--navy)]">Paramètres du compte</h1>

      {/* Profile */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-[var(--accent)]" />
          <h2 className="text-lg font-semibold text-[var(--navy)]">Profil</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">Nom</label>
            <p className="font-medium text-[var(--navy)]">{user?.full_name || '—'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="font-medium text-[var(--navy)]">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Plan */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-5 h-5 text-[var(--accent)]" />
          <h2 className="text-lg font-semibold text-[var(--navy)]">Abonnement</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-[var(--navy)]">
              Plan {planLabels[user?.plan || 'free']}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {user?.plan === 'free'
                ? '5 analyses par jour'
                : user?.plan === 'pro'
                ? '100 analyses par jour'
                : 'Analyses illimitées'}
            </p>
          </div>
          <div className="flex gap-3">
            {user?.plan === 'free' ? (
              <a href="/signup?plan=pro" className="btn-primary text-sm">
                Passer au Pro
              </a>
            ) : (
              <button
                onClick={openBillingPortal}
                disabled={portalLoading}
                className="btn-secondary text-sm"
              >
                {portalLoading ? 'Chargement...' : 'Gérer l\'abonnement'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
