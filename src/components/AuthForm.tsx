'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AuthFormProps {
  mode: 'login' | 'signup' | 'reset'
}

async function redirectToCheckout(token: string, plan: string) {
  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ plan }),
    })
    const data = await response.json()
    if (data.url) {
      window.location.href = data.url
      return true
    }
  } catch {
    // Fall through to dashboard if checkout fails
  }
  return false
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [planParam, setPlanParam] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setPlanParam(params.get('plan'))
  }, [])

  const planLabels: Record<string, string> = {
    starter: 'Starter — £21/month',
    pro: 'Pro — £129/month',
    university: 'University — £429/month',
    enterprise: 'Enterprise',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { supabase } = await import('@/lib/supabase')

      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        // If coming from a pricing page, redirect to checkout
        const params = new URLSearchParams(window.location.search)
        const plan = params.get('plan')
        if (plan && data.session?.access_token) {
          const redirected = await redirectToCheckout(data.session.access_token, plan)
          if (redirected) return
        }
        window.location.href = '/dashboard'
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        })
        if (error) throw error
        if (data.session) {
          // If a plan was selected, redirect to Stripe checkout
          if (planParam && planParam !== 'free') {
            setSuccess('Account created! Redirecting to payment...')
            const redirected = await redirectToCheckout(data.session.access_token, planParam)
            if (redirected) return
          }
          window.location.href = '/dashboard'
        } else {
          setSuccess('Check your email to confirm your registration.')
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/dashboard/account`,
        })
        if (error) throw error
        setSuccess('A reset link has been sent to your email address.')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const titles = {
    login: 'Login',
    signup: 'Create Account',
    reset: 'Reset Password',
  }

  const subtitles = {
    login: planParam && planLabels[planParam]
      ? `Login to activate the ${planLabels[planParam]} plan`
      : 'Access your AI detection dashboard',
    signup: planParam && planLabels[planParam]
      ? `Create your account to activate ${planLabels[planParam]}`
      : 'Start detecting AI content for free',
    reset: 'Enter your email to receive a reset link',
  }

  return (
    <div className="min-h-screen bg-[var(--bg-light)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-6">
            <span className="text-2xl font-bold text-[var(--navy)]">✦ NOVALEARN</span>
          </Link>
          <h1 className="text-2xl font-bold text-[var(--navy)]">{titles[mode]}</h1>
          <p className="text-gray-500 mt-2">{subtitles[mode]}</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">{error}</div>
          )}
          {success && (
            <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg">{success}</div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input"
                placeholder="John Smith"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="you@email.com"
              required
            />
          </div>

          {mode !== 'reset' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 rounded-xl disabled:opacity-50"
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Login' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-500">
          {mode === 'login' && (
            <>
              <Link href="/reset-password" className="text-[var(--accent)] hover:underline">
                Forgot password?
              </Link>
              <span className="mx-2">·</span>
              <Link
                href={planParam ? `/signup?plan=${planParam}` : '/signup'}
                className="text-[var(--accent)] hover:underline"
              >
                Create account
              </Link>
            </>
          )}
          {mode === 'signup' && (
            <>
              Already have an account?{' '}
              <Link
                href={planParam ? `/login?plan=${planParam}` : '/login'}
                className="text-[var(--accent)] hover:underline"
              >
                Login
              </Link>
            </>
          )}
          {mode === 'reset' && (
            <Link href="/login" className="text-[var(--accent)] hover:underline">
              Back to login
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
