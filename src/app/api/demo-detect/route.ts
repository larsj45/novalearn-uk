import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiter (resets on deploy)
const rateLimit = new Map<string, { count: number; resetAt: number }>()

const DAILY_LIMIT = 3
const DAY_MS = 24 * 60 * 60 * 1000

function getRateLimitInfo(ip: string) {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  
  if (!entry || now > entry.resetAt) {
    return { count: 0, resetAt: now + DAY_MS }
  }
  
  return entry
}

function incrementRateLimit(ip: string) {
  const info = getRateLimitInfo(ip)
  rateLimit.set(ip, { count: info.count + 1, resetAt: info.resetAt })
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ip = forwardedFor?.split(',')[0]?.trim() || 'unknown'
    
    // Check rate limit
    const limitInfo = getRateLimitInfo(ip)
    if (limitInfo.count >= DAILY_LIMIT) {
      return NextResponse.json(
        { error: 'Daily limit reached. Create a free account to continue.' },
        { status: 429 }
      )
    }
    
    const { text } = await request.json()
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text required' }, { status: 400 })
    }
    
    if (text.trim().length < 50) {
      return NextResponse.json({ error: 'Minimum 50 characters required' }, { status: 400 })
    }
    
    // Call Pangram API v3
    const pangramKey = process.env.PANGRAM_API_KEY
    if (!pangramKey) {
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 })
    }
    
    const pangramRes = await fetch('https://text.api.pangramlabs.com/v3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': pangramKey
      },
      body: JSON.stringify({ text: text.slice(0, 2000) })
    })
    
    if (!pangramRes.ok) {
      console.error('Pangram API error:', await pangramRes.text())
      return NextResponse.json({ error: 'Erreur d\'analyse' }, { status: 500 })
    }
    
    const pangramData = await pangramRes.json()
    
    // Increment rate limit on success
    incrementRateLimit(ip)
    
    // Return simplified result for demo (v3 API format)
    const aiScore = Math.round((pangramData.fraction_ai || 0) * 100)
    return NextResponse.json({
      score: aiScore,
      model: pangramData.prediction_short === 'AI' ? 'IA Générative' : null,
      verdict: pangramData.headline || (aiScore >= 50 ? 'Contenu IA détecté' : 'Contenu humain'),
      isAI: aiScore >= 50,
      remaining: DAILY_LIMIT - limitInfo.count - 1
    })
    
  } catch (error) {
    console.error('Demo detect error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
