import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { 
  sendEmail, 
  upgradeReminderEmail, 
  trialExpiringEmail,
  trialEndedEmail 
} from '@/lib/email'

// Verify cron secret to prevent unauthorized access
const CRON_SECRET = process.env.CRON_SECRET

export async function GET(request: NextRequest) {
  // Verify authorization
  const authHeader = request.headers.get('Authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const results = {
    upgradeReminders: 0,
    trialExpiring: 0,
    trialEnded: 0,
    errors: [] as string[]
  }

  try {
    // ============ 1. UPGRADE REMINDERS (>80% usage) ============
    const { data: highUsageUsers } = await supabase
      .from('profiles')
      .select('id, email, full_name, monthly_usage, monthly_limit, upgrade_reminder_sent')
      .is('subscription_status', null) // Free users only
      .eq('upgrade_reminder_sent', false)

    for (const user of highUsageUsers || []) {
      const usagePercent = Math.round((user.monthly_usage / user.monthly_limit) * 100)
      
      if (usagePercent >= 80) {
        const email = upgradeReminderEmail(user.full_name || user.email, usagePercent)
        const result = await sendEmail({
          to: user.email,
          subject: email.subject,
          html: email.html,
          text: email.text,
        })

        if (result.success) {
          await supabase
            .from('profiles')
            .update({ upgrade_reminder_sent: true })
            .eq('id', user.id)
          results.upgradeReminders++
        } else {
          results.errors.push(`Upgrade reminder failed for ${user.email}: ${result.error}`)
        }
      }
    }

    // ============ 2. TRIAL EXPIRING (7, 3, 1 days) ============
    const now = new Date()
    const { data: trialUsers } = await supabase
      .from('profiles')
      .select('id, email, full_name, trial_ends_at, trial_reminder_days_sent')
      .is('subscription_status', null)
      .not('trial_ends_at', 'is', null)
      .gt('trial_ends_at', now.toISOString())

    for (const user of trialUsers || []) {
      const trialEnd = new Date(user.trial_ends_at)
      const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      const sentDays = user.trial_reminder_days_sent || []

      // Send reminders at 7, 3, and 1 days
      const reminderDays = [7, 3, 1]
      
      for (const reminderDay of reminderDays) {
        if (daysLeft <= reminderDay && !sentDays.includes(reminderDay)) {
          const email = trialExpiringEmail(user.full_name || user.email, daysLeft)
          const result = await sendEmail({
            to: user.email,
            subject: email.subject,
            html: email.html,
            text: email.text,
          })

          if (result.success) {
            await supabase
              .from('profiles')
              .update({ 
                trial_reminder_days_sent: [...sentDays, reminderDay]
              })
              .eq('id', user.id)
            results.trialExpiring++
          } else {
            results.errors.push(`Trial expiring failed for ${user.email}: ${result.error}`)
          }
          break // Only send one reminder per run
        }
      }
    }

    // ============ 3. TRIAL ENDED ============
    const { data: expiredUsers } = await supabase
      .from('profiles')
      .select('id, email, full_name, trial_ends_at, trial_ended_email_sent')
      .is('subscription_status', null)
      .lt('trial_ends_at', now.toISOString())
      .eq('trial_ended_email_sent', false)

    for (const user of expiredUsers || []) {
      const email = trialEndedEmail(user.full_name || user.email)
      const result = await sendEmail({
        to: user.email,
        subject: email.subject,
        html: email.html,
        text: email.text,
      })

      if (result.success) {
        await supabase
          .from('profiles')
          .update({ trial_ended_email_sent: true })
          .eq('id', user.id)
        results.trialEnded++
      } else {
        results.errors.push(`Trial ended failed for ${user.email}: ${result.error}`)
      }
    }

  } catch (error) {
    console.error('Cron email error:', error)
    results.errors.push(`General error: ${error}`)
  }

  return NextResponse.json({
    success: true,
    ...results,
    timestamp: new Date().toISOString()
  })
}
