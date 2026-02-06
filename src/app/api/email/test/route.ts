import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, welcomeEmail } from '@/lib/email'

// TEMPORARY test endpoint - remove after testing!
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')
  
  if (!email) {
    return NextResponse.json({ error: 'Missing email parameter' }, { status: 400 })
  }

  // Basic validation
  if (!email.includes('@') || !email.includes('.')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const name = email.split('@')[0]
  const template = welcomeEmail(name)

  const result = await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  })

  return NextResponse.json(result)
}
