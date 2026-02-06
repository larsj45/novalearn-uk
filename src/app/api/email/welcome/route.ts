import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail, welcomeEmail } from '@/lib/email'

// This endpoint is called after successful signup
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.email) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user profile for name
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: profile } = await serviceSupabase
      .from('profiles')
      .select('full_name, welcome_email_sent')
      .eq('id', user.id)
      .single()

    // Don't send if already sent
    if (profile?.welcome_email_sent) {
      return NextResponse.json({ message: 'Email déjà envoyé' })
    }

    const name = profile?.full_name || user.email.split('@')[0]
    const email = welcomeEmail(name)

    const result = await sendEmail({
      to: user.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
    })

    if (result.success) {
      // Mark welcome email as sent
      await serviceSupabase
        .from('profiles')
        .update({ welcome_email_sent: true })
        .eq('id', user.id)
    }

    return NextResponse.json({ success: result.success })
  } catch (error) {
    console.error('Welcome email error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
