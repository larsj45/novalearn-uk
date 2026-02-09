import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

  if (code) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to the confirmed page
  if (type === 'signup' || type === 'email') {
    return NextResponse.redirect(new URL('/confirmed', requestUrl.origin))
  }

  if (type === 'recovery') {
    return NextResponse.redirect(new URL('/dashboard/account', requestUrl.origin))
  }

  return NextResponse.redirect(new URL('/confirmed', requestUrl.origin))
}
