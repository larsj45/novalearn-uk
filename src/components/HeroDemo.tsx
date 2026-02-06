'use client'

import { useState } from 'react'
import { Loader2, Sparkles, AlertCircle } from 'lucide-react'

interface DemoResult {
  score: number
  model: string | null
  verdict: string
  isAI: boolean
}

export default function HeroDemo() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DemoResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyze = async () => {
    if (text.trim().length < 50) {
      setError('Please enter at least 50 characters')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/demo-detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 2000) })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error during analysis')
        return
      }

      setResult(data)
    } catch {
      setError('Connection error')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-500'
    if (score >= 50) return 'text-yellow-500'
    return 'text-green-500'
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--accent)]" />
          <span className="text-gray-800 font-semibold">Try it now</span>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Free</span>
      </div>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here for instant analysis... (min. 50 characters)"
        className="w-full h-32 p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
        maxLength={2000}
      />
      
      {/* Example buttons */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <span className="text-xs text-gray-400">Try:</span>
        <button 
          onClick={() => setText("I love exploring new places. Every trip brings me unique memories and different perspectives on the world around me.")}
          className="text-xs px-3 py-1 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors"
        >
          Human
        </button>
        <button 
          onClick={() => setText("Artificial intelligence represents a major technological advancement that is transforming numerous sectors of our modern society.")}
          className="text-xs px-3 py-1 bg-red-50 text-red-700 rounded-full hover:bg-red-100 transition-colors"
        >
          ChatGPT
        </button>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <span className="text-gray-400 text-sm">{text.length}/2000</span>
        <button
          onClick={analyze}
          disabled={loading || text.trim().length < 50}
          className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analysing...
            </>
          ) : (
            '🔍 Scan'
          )}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {result && (
        <div className="mt-4 p-5 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                {result.score}%
              </div>
              <div className="text-gray-600 text-sm mt-1 font-medium">
                {result.verdict}
              </div>
            </div>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${result.isAI ? 'bg-red-100' : 'bg-green-100'}`}>
              {result.isAI ? (
                <span className="text-2xl">🤖</span>
              ) : (
                <span className="text-2xl">👤</span>
              )}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <a 
              href="/signup" 
              className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors text-sm font-semibold"
            >
              Create an account for full analysis
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
