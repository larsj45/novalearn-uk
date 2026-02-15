'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ShieldCheck, ScanSearch, Bot, ArrowRight, Loader2 } from 'lucide-react'

interface DetectResult {
  score: number
  model: string
  verdict: string
  isAI: boolean
  remaining: number
}

function ScoreRing({ score, isAI }: { score: number; isAI: boolean }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = isAI ? '#ef4444' : 'var(--teal)'

  return (
    <div style={{ position: 'relative', width: 140, height: 140 }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 32, fontWeight: 700, color }}>{score}%</span>
        <span style={{ fontSize: 12, color: '#6b7280' }}>AI probability</span>
      </div>
    </div>
  )
}

export default function TesterPage() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DetectResult | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [error, setError] = useState('')

  const canSubmit = text.length >= 50 && text.length <= 5000 && !loading

  async function handleAnalyse() {
    setError('')
    setResult(null)
    setLoading(true)
    try {
      const res = await fetch('/api/demo-detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        if (data.remaining !== undefined) setRemaining(data.remaining)
        return
      }
      setResult(data)
      setRemaining(data.remaining)
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const features = [
    { icon: ShieldCheck, title: '99.9% accuracy', desc: 'Our model is trained on millions of texts to distinguish human from AI writing.' },
    { icon: ScanSearch, title: 'Sentence-level analysis', desc: 'See exactly which sentences are flagged — not just a single score.' },
    { icon: Bot, title: 'Model detection', desc: 'Identify the specific AI model used: GPT-4, Claude, Gemini, and more.' },
  ]

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: 'var(--bg-light)' }}>
        {/* Hero */}
        <section style={{ textAlign: 'center', padding: '80px 20px 40px' }}>
          <span style={{
            display: 'inline-block', background: 'var(--teal)', color: '#fff',
            fontSize: 13, fontWeight: 600, borderRadius: 20, padding: '4px 14px', marginBottom: 16,
          }}>
            Free Test — No Account Required
          </span>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: 'var(--navy)', margin: '0 0 12px' }}>
            Test AI Detection
          </h1>
          <p style={{ fontSize: 18, color: '#6b7280', maxWidth: 520, margin: '0 auto' }}>
            Paste text and find out if it was AI-generated — in seconds
          </p>
          {remaining !== null && (
            <p style={{ marginTop: 12, fontSize: 14, color: '#6b7280' }}>
              {remaining} free {remaining === 1 ? 'test' : 'tests'} remaining today
            </p>
          )}
        </section>

        {/* Input */}
        <section style={{ maxWidth: 680, margin: '0 auto', padding: '0 20px 40px' }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste your text here (minimum 50 characters)..."
            rows={8}
            maxLength={5000}
            style={{
              width: '100%', padding: 16, borderRadius: 12,
              border: '2px solid #e5e7eb', fontSize: 15, resize: 'vertical',
              fontFamily: 'inherit', outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--teal)')}
            onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <span style={{ fontSize: 13, color: text.length < 50 ? '#ef4444' : '#6b7280' }}>
              {text.length} / 5,000 characters {text.length > 0 && text.length < 50 && '(minimum 50)'}
            </span>
            <button
              className="btn-primary"
              disabled={!canSubmit}
              onClick={handleAnalyse}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? 'pointer' : 'not-allowed',
              }}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? 'Analysing...' : 'Analyse'}
            </button>
          </div>

          {error && (
            <div style={{
              marginTop: 20, padding: 16, borderRadius: 12,
              background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', textAlign: 'center',
            }}>
              {error}
              {remaining === 0 && (
                <div style={{ marginTop: 12 }}>
                  <Link href="/register" className="btn-primary" style={{ fontSize: 14 }}>
                    Create a free account <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Result */}
        {result && (
          <section style={{
            maxWidth: 680, margin: '0 auto 40px', padding: '32px 20px', textAlign: 'center',
            background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            marginLeft: 'auto', marginRight: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <ScoreRing score={result.score} isAI={result.isAI} />
            </div>
            <p style={{
              fontSize: 22, fontWeight: 700,
              color: result.isAI ? '#ef4444' : 'var(--teal)',
            }}>
              {result.verdict}
            </p>
            {result.model && (
              <p style={{ fontSize: 14, color: '#6b7280', marginTop: 8 }}>
                Detected model: <strong>{result.model}</strong>
              </p>
            )}

            {/* CTA */}
            <div style={{
              marginTop: 28, padding: 20, borderRadius: 12,
              background: 'var(--bg-light)', border: '1px solid #e5e7eb',
            }}>
              <p style={{ fontWeight: 600, color: 'var(--navy)', marginBottom: 4 }}>Like NovaLearn?</p>
              <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 14 }}>
                Create a free account to analyse up to 50 texts per month
              </p>
              <Link href="/register" className="btn-primary" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                Sign up free <ArrowRight size={16} />
              </Link>
            </div>
          </section>
        )}

        {/* Feature cards (show when no result) */}
        {!result && !error && (
          <section style={{
            maxWidth: 900, margin: '0 auto', padding: '0 20px 60px',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24,
          }}>
            {features.map(f => (
              <div key={f.title} style={{
                background: '#fff', borderRadius: 16, padding: 28, textAlign: 'center',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: 'var(--bg-light)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                }}>
                  <f.icon size={24} color="var(--teal)" />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
