import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEnquiryNotification(
  tradeEmail: string,
  tradeName: string,
  enquiry: {
    clientName: string
    clientEmail: string
    clientPhone: string
    jobDescription: string
  }
) {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: tradeEmail,
      subject: 'New Job Enquiry - LocalTrades',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Job Enquiry</h2>
          <p>Hi ${tradeName},</p>
          <p>You have received a new job enquiry through LocalTrades.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Client Details</h3>
            <p><strong>Name:</strong> ${enquiry.clientName}</p>
            <p><strong>Email:</strong> ${enquiry.clientEmail}</p>
            <p><strong>Phone:</strong> ${enquiry.clientPhone}</p>
            
            <h3>Job Description</h3>
            <p>${enquiry.jobDescription}</p>
          </div>
          
          <p>Log in to your dashboard to respond to this enquiry.</p>
          
          <a href="${process.env.NEXTAUTH_URL}/dashboard" 
             style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 8px; margin: 20px 0;">
            View Dashboard
          </a>
          
          <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
            LocalTrades - Connecting local trades with customers
          </p>
        </div>
      `
    })
  } catch (error) {
    console.error('Failed to send enquiry notification:', error)
  }
}

export async function sendWelcomeEmail(email: string, name: string, role: string) {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: 'Welcome to LocalTrades',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to LocalTrades!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for joining LocalTrades${role === 'TRADE' ? ' as a trade professional' : ''}.</p>
          
          ${role === 'TRADE' ? `
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Getting Started</h3>
              <p>Your profile is now live! Here's what happens next:</p>
              <ul>
                <li>You'll receive your first 3 enquiries for free</li>
                <li>After that, subscribe to continue receiving enquiries</li>
                <li>Respond to enquiries through your dashboard</li>
                <li>Build your reputation with verified work</li>
              </ul>
            </div>
          ` : `
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Find Local Trades</h3>
              <p>You can now search for verified local tradespeople in your area.</p>
              <p>Simply enter your postcode and the type of work you need.</p>
            </div>
          `}
          
          <a href="${process.env.NEXTAUTH_URL}/dashboard" 
             style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 8px; margin: 20px 0;">
            Go to Dashboard
          </a>
          
          <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
            LocalTrades - Connecting local trades with customers
          </p>
        </div>
      `
    })
  } catch (error) {
    console.error('Failed to send welcome email:', error)
  }
}
