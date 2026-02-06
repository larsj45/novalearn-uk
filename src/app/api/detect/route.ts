import { NextRequest, NextResponse } from 'next/server'
import { detectAI } from '@/lib/pangram'
import { createClient } from '@supabase/supabase-js'

const DAILY_LIMITS: Record<string, number> = {
  free: 5,
  pro: 100,
  enterprise: 10000,
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: profile } = await serviceSupabase
      .from('profiles')
      .select('plan, scans_today, scans_reset_at')
      .eq('id', user.id)
      .single()

    const plan = profile?.plan || 'free'
    const limit = DAILY_LIMITS[plan] || 5

    const now = new Date()
    const resetAt = profile?.scans_reset_at ? new Date(profile.scans_reset_at) : null
    let scansToday = profile?.scans_today || 0

    if (!resetAt || now.toDateString() !== resetAt.toDateString()) {
      scansToday = 0
      await serviceSupabase
        .from('profiles')
        .update({ scans_today: 0, scans_reset_at: now.toISOString() })
        .eq('id', user.id)
    }

    if (scansToday >= limit) {
      return NextResponse.json({
        error: 'Limite quotidienne atteinte. Passez au plan supérieur pour plus d\'analyses.',
        scans_remaining: 0,
      }, { status: 429 })
    }

    const body = await request.json()
    const { text } = body

    if (!text || typeof text !== 'string' || text.trim().length < 50) {
      return NextResponse.json({ error: 'Le texte doit contenir au moins 50 caractères.' }, { status: 400 })
    }

    const result = await detectAI(text.trim())

    await serviceSupabase
      .from('profiles')
      .update({ scans_today: scansToday + 1 })
      .eq('id', user.id)

    await serviceSupabase.from('scans').insert({
      user_id: user.id,
      text_snippet: text.trim().substring(0, 200),
      ai_score: result.ai_likelihood,
      detected_model: result.detected_model || null,
      full_result: result,
    })

    return NextResponse.json({
      ...result,
      scans_remaining: limit - scansToday - 1,
    })
  } catch (error: unknown) {
    console.error('Detection error:', error)
    const message = error instanceof Error ? error.message : 'Internal error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
