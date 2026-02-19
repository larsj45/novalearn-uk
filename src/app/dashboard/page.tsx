'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import DetectionResult from '@/components/DetectionResult'
import { FileSearch, Loader2, CheckCircle } from 'lucide-react'

interface DetectionResponse {
  ai_likelihood: number
  detected_model?: string
  sentences?: Array<{ text: string; ai_likelihood: number; detected_model?: string }>
  scans_remaining?: number
}

declare function gtag(...args: unknown[]): void

function ConversionTracker({ onSuccess }: { onSuccess: () => void }) {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      // Fire Google Ads purchase conversion — NovaLearn UK
      // ⚠️ Replace CONVERSION_LABEL after creating conversion action in Google Ads
      if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
          send_to: 'AW-17964304856/CONVERSION_LABEL',
          transaction_id: '',
        })
      }
      onSuccess()
      router.replace('/dashboard', { scroll: false })
    }
  }, [searchParams, onSuccess, router])

  return null
}

export default function DashboardPage() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DetectionResponse | null>(null)
  const [error, setError] = useState('')
  const [scansRemaining, setScansRemaining] = useState<number | null>(null)
  const [showSuccessBanner, setShowSuccessBanner] = useState(false)

  const handleAnalyze = async () => {
    if (!text.trim() || text.trim().length < 50) {
      setError('Please enter at least 50 characters for a reliable analysis.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const { supabase } = await import('@/lib/supabase')
      const { data: { session } } = await supabase.auth.getSession()

      const response = await fetch('/api/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
        body: JSON.stringify({ text: text.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error during analysis')
      }

      setResult(data)
      if (data.scans_remaining !== undefined) {
        setScansRemaining(data.scans_remaining)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <Suspense fallback={null}>
        <ConversionTracker onSuccess={() => setShowSuccessBanner(true)} />
      </Suspense>

      {showSuccessBanner && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded-xl mb-6">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span>
            <strong>Subscription activated successfully!</strong> Your additional analyses are now available.
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--navy)]">AI Content Detector</h1>
          <p className="text-gray-500 mt-1">Paste your text to detect AI-generated content</p>
        </div>
        {scansRemaining !== null && (
          <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200">
            <span className="font-semibold text-[var(--navy)]">{scansRemaining}</span> analyses remaining
          </div>
        )}
      </div>

      <div className="card mb-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste text here to analyse (minimum 50 characters)..."
          className="w-full h-48 resize-y border border-gray-200 rounded-lg p-4 text-sm focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 outline-none transition"
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-400">{text.length} characters</span>
          <button
            onClick={handleAnalyze}
            disabled={loading || text.trim().length < 50}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analysing...
              </>
            ) : (
              <>
                <FileSearch className="w-4 h-4" />
                Analyse
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm p-4 rounded-lg mb-6">{error}</div>
      )}

      {result && (
        <div className="card">
          <DetectionResult
            score={Math.round(result.ai_likelihood * 100)}
            detectedModel={result.detected_model}
            sentences={result.sentences?.map(s => ({
              ...s,
              ai_likelihood: Math.round(s.ai_likelihood * 100),
            }))}
          />
        </div>
      )}
    </div>
  )
}
