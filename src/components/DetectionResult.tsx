'use client'

import { useEffect, useRef } from 'react'

interface DetectionResultProps {
  score: number
  detectedModel?: string
  sentences?: Array<{
    text: string
    ai_likelihood: number
    detected_model?: string
  }>
}

function getScoreColor(score: number) {
  if (score < 30) return { color: '#10b981', label: 'Probablement humain', bg: 'bg-emerald-50' }
  if (score < 60) return { color: '#f59e0b', label: 'Mixte / Incertain', bg: 'bg-amber-50' }
  return { color: '#ef4444', label: 'Probablement IA', bg: 'bg-red-50' }
}

function ScoreRing({ score }: { score: number }) {
  const circleRef = useRef<SVGCircleElement>(null)
  const { color } = getScoreColor(score)

  useEffect(() => {
    if (circleRef.current) {
      const offset = 283 - (283 * score) / 100
      circleRef.current.style.strokeDashoffset = String(offset)
    }
  }, [score])

  return (
    <div className="relative w-40 h-40">
      <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <circle
          ref={circleRef}
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          className="score-ring"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>{score}%</span>
        <span className="text-xs text-gray-500">Score IA</span>
      </div>
    </div>
  )
}

export default function DetectionResult({ score, detectedModel, sentences }: DetectionResultProps) {
  const { label, bg } = getScoreColor(score)

  return (
    <div className="space-y-6">
      {/* Main Score */}
      <div className={`${bg} rounded-xl p-8 flex flex-col sm:flex-row items-center gap-8`}>
        <ScoreRing score={score} />
        <div>
          <h3 className="text-2xl font-bold text-[var(--navy)]">{label}</h3>
          <p className="text-gray-600 mt-1">
            Probabilité de contenu généré par IA : <strong>{score}%</strong>
          </p>
          {detectedModel && (
            <p className="text-gray-500 mt-2 text-sm">
              Modèle détecté : <span className="font-semibold text-[var(--navy)]">{detectedModel}</span>
            </p>
          )}
        </div>
      </div>

      {/* Sentence Breakdown */}
      {sentences && sentences.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-[var(--navy)] mb-4">Analyse par section</h4>
          <div className="space-y-2">
            {sentences.map((sentence, i) => {
              const sentenceInfo = getScoreColor(sentence.ai_likelihood)
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-100"
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                    style={{ backgroundColor: sentenceInfo.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">{sentence.text}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-medium" style={{ color: sentenceInfo.color }}>
                        {sentence.ai_likelihood}% IA
                      </span>
                      {sentence.detected_model && (
                        <span className="text-xs text-gray-400">
                          {sentence.detected_model}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
