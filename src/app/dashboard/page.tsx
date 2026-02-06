'use client'

import { useState } from 'react'
import DetectionResult from '@/components/DetectionResult'
import { FileSearch, Loader2 } from 'lucide-react'

interface DetectionResponse {
  ai_likelihood: number
  detected_model?: string
  sentences?: Array<{ text: string; ai_likelihood: number; detected_model?: string }>
  scans_remaining?: number
}

export default function DashboardPage() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DetectionResponse | null>(null)
  const [error, setError] = useState('')
  const [scansRemaining, setScansRemaining] = useState<number | null>(null)

  const handleAnalyze = async () => {
    if (!text.trim() || text.trim().length < 50) {
      setError('Veuillez entrer au moins 50 caractères pour une analyse fiable.')
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
        throw new Error(data.error || 'Erreur lors de l\'analyse')
      }

      setResult(data)
      if (data.scans_remaining !== undefined) {
        setScansRemaining(data.scans_remaining)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--navy)]">Analyseur de contenu IA</h1>
          <p className="text-gray-500 mt-1">Collez votre texte pour détecter le contenu généré par IA</p>
        </div>
        {scansRemaining !== null && (
          <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200">
            <span className="font-semibold text-[var(--navy)]">{scansRemaining}</span> analyses restantes
          </div>
        )}
      </div>

      <div className="card mb-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Collez ici le texte à analyser (minimum 50 caractères)..."
          className="w-full h-48 resize-y border border-gray-200 rounded-lg p-4 text-sm focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 outline-none transition"
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-400">{text.length} caractères</span>
          <button
            onClick={handleAnalyze}
            disabled={loading || text.trim().length < 50}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <FileSearch className="w-4 h-4" />
                Analyser
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
