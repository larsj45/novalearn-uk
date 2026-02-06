import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM_EMAIL = 'NovaLearn <noreply@novalearn.co.uk>'

export interface EmailParams {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailParams) {
  if (!resend) {
    console.warn('Resend not configured, skipping email:', subject)
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text,
    })

    if (error) {
      console.error('Email send error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data?.id }
  } catch (err) {
    console.error('Email send exception:', err)
    return { success: false, error: 'Failed to send email' }
  }
}

// ============ EMAIL TEMPLATES ============

export function welcomeEmail(name: string) {
  const firstName = name.split(' ')[0] || 'there'
  
  return {
    subject: `Welcome to NovaLearn, ${firstName}! 🎉`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #fef9ef; margin: 0; padding: 40px 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0d9488 0%, #115e59 100%); padding: 32px; text-align: center;">
      <img src="https://novalearn.co.uk/logo/logo-white.png" alt="NovaLearn" style="height: 40px; width: auto;" />
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 32px;">
      <h2 style="color: #1a1a2e; margin: 0 0 16px 0; font-size: 22px;">
        Welcome, ${firstName}! 👋
      </h2>
      
      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 24px 0;">
        Thank you for creating your NovaLearn account. You now have access to the most accurate AI detector on the market, verified by the University of Maryland.
      </p>
      
      <div style="background: #fef3c7; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <h3 style="color: #92400e; margin: 0 0 12px 0; font-size: 16px;">🎁 Your free trial includes:</h3>
        <ul style="color: #78350f; margin: 0; padding-left: 20px; line-height: 1.8;">
          <li>50 analyses per month</li>
          <li>99.9% accuracy</li>
          <li>AI model identification</li>
          <li>7-day history</li>
        </ul>
      </div>
      
      <a href="https://novalearn.co.uk/dashboard" style="display: inline-block; background: #e85d04; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; margin: 16px 0;">
        Start my first analysis →
      </a>
      
      <p style="color: #9ca3af; font-size: 14px; margin: 32px 0 0 0;">
        Questions? Reply directly to this email.
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        NovaLearn Ltd · United Kingdom<br>
        <a href="https://novalearn.co.uk" style="color: #0d9488;">novalearn.co.uk</a>
      </p>
    </div>
  </div>
</body>
</html>
    `,
    text: `Welcome to NovaLearn, ${firstName}!

Thank you for creating your account. You now have access to the most accurate AI detector on the market.

Your free trial includes:
- 50 analyses per month
- 99.9% accuracy
- AI model identification
- 7-day history

Get started here: https://novalearn.co.uk/dashboard

NovaLearn - novalearn.co.uk`
  }
}

export function subscriptionConfirmedEmail(name: string, plan: string) {
  const firstName = name.split(' ')[0] || 'there'
  const planDetails: Record<string, { name: string; features: string[] }> = {
    pro: {
      name: 'Professional',
      features: ['1,000 analyses/month', 'API access', 'PDF/CSV export', 'Email support', '30-day history']
    },
    university: {
      name: 'University',
      features: ['10,000 analyses/month', 'Unlimited API', 'LMS integration', 'Admin dashboard', 'Priority support']
    },
    enterprise: {
      name: 'Enterprise',
      features: ['Unlimited analyses', 'White-label API', 'Account manager', '99.9% SLA', 'Custom features']
    }
  }
  
  const details = planDetails[plan] || planDetails.pro
  
  return {
    subject: `Your ${details.name} subscription is active! 🚀`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #fef9ef; margin: 0; padding: 40px 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0d9488 0%, #115e59 100%); padding: 32px; text-align: center;">
      <img src="https://novalearn.co.uk/logo/logo-white.png" alt="NovaLearn" style="height: 40px; width: auto;" />
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 32px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 48px;">🎉</span>
      </div>
      
      <h2 style="color: #1a1a2e; margin: 0 0 16px 0; font-size: 22px; text-align: center;">
        Thank you, ${firstName}!
      </h2>
      
      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
        Your <strong>${details.name}</strong> subscription is now active.
      </p>
      
      <div style="background: #ecfdf5; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <h3 style="color: #065f46; margin: 0 0 12px 0; font-size: 16px;">✅ Your plan includes:</h3>
        <ul style="color: #047857; margin: 0; padding-left: 20px; line-height: 1.8;">
          ${details.features.map(f => `<li>${f}</li>`).join('\n          ')}
        </ul>
      </div>
      
      <a href="https://novalearn.co.uk/dashboard" style="display: block; text-align: center; background: #e85d04; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; margin: 24px 0;">
        Go to my dashboard →
      </a>
      
      <p style="color: #9ca3af; font-size: 14px; margin: 32px 0 0 0; text-align: center;">
        Manage your subscription in your account settings.
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        NovaLearn Ltd · United Kingdom<br>
        <a href="https://novalearn.co.uk" style="color: #0d9488;">novalearn.co.uk</a>
      </p>
    </div>
  </div>
</body>
</html>
    `,
    text: `Thank you ${firstName}!

Your ${details.name} subscription is now active.

Your plan includes:
${details.features.map(f => `- ${f}`).join('\n')}

Go to your dashboard: https://novalearn.co.uk/dashboard

NovaLearn - novalearn.co.uk`
  }
}

export function upgradeReminderEmail(name: string, usagePercent: number) {
  const firstName = name.split(' ')[0] || 'there'
  
  return {
    subject: `${firstName}, you've used ${usagePercent}% of your analyses 📊`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #fef9ef; margin: 0; padding: 40px 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0d9488 0%, #115e59 100%); padding: 32px; text-align: center;">
      <img src="https://novalearn.co.uk/logo/logo-white.png" alt="NovaLearn" style="height: 40px; width: auto;" />
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 32px;">
      <h2 style="color: #1a1a2e; margin: 0 0 16px 0; font-size: 22px;">
        You're using NovaLearn well! 🎯
      </h2>
      
      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 24px 0;">
        ${firstName}, you've already used <strong>${usagePercent}%</strong> of your free analyses this month.
      </p>
      
      <!-- Progress bar -->
      <div style="background: #e5e7eb; border-radius: 9999px; height: 12px; margin: 24px 0;">
        <div style="background: ${usagePercent >= 80 ? '#ef4444' : '#e85d04'}; width: ${usagePercent}%; height: 100%; border-radius: 9999px;"></div>
      </div>
      
      <div style="background: #fef3c7; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <h3 style="color: #92400e; margin: 0 0 12px 0; font-size: 16px;">🚀 Upgrade to Pro for:</h3>
        <ul style="color: #78350f; margin: 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>1,000 analyses/month</strong> (instead of 50)</li>
          <li>API access</li>
          <li>PDF/CSV export</li>
          <li>Priority support</li>
        </ul>
        <p style="color: #78350f; margin: 16px 0 0 0; font-weight: 600;">
          Only £21/month
        </p>
      </div>
      
      <a href="https://novalearn.co.uk/dashboard?upgrade=true" style="display: block; text-align: center; background: #e85d04; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; margin: 24px 0;">
        Upgrade to Pro →
      </a>
    </div>
    
    <!-- Footer -->
    <div style="background: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        NovaLearn Ltd · United Kingdom<br>
        <a href="https://novalearn.co.uk" style="color: #0d9488;">novalearn.co.uk</a>
      </p>
    </div>
  </div>
</body>
</html>
    `,
    text: `${firstName}, you've used ${usagePercent}% of your analyses!

Upgrade to Pro for 1,000 analyses/month: https://novalearn.co.uk/dashboard?upgrade=true

NovaLearn - novalearn.co.uk`
  }
}
