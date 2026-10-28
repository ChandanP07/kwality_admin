// lib/email.ts
import nodemailer from 'nodemailer'
import { logger } from './logger';

// Email configuration interface
interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

// Email templates interface
interface EmailTemplate {
  subject: string
  html: string
  text: string
}

// Create email transporter
const createTransporter = () => {
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASSWORD || ''
    }
  }

  return nodemailer.createTransport(config)
}

// Email templates
const emailTemplates = {
  welcomeUser: (userData: { name: string, username: string, password: string, loginUrl: string }): EmailTemplate => ({
    subject: 'Welcome to PrintCare - Your Account Details',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to PrintCare</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .credentials { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 5px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🖨️ PrintCare Management System</h1>
            <p>Welcome to your business management portal</p>
          </div>
          <div class="content">
            <h2>Hello ${userData.name}!</h2>
            <p>Your account has been created successfully. You can now access the PrintCare Management System using the credentials below:</p>
            
            <div class="credentials">
              <h3>🔐 Your Login Credentials</h3>
              <p><strong>Username:</strong> ${userData.username}</p>
              <p><strong>Password:</strong> ${userData.password}</p>
              <p><strong>Login URL:</strong> <a href="${userData.loginUrl}">${userData.loginUrl}</a></p>
            </div>

            <div class="warning">
              <strong>⚠️ Important Security Notice:</strong>
              <ul>
                <li>Please change your password after your first login</li>
                <li>Keep your login credentials secure and confidential</li>
                <li>Do not share your account with others</li>
                <li>Contact support if you suspect unauthorized access</li>
              </ul>
            </div>

            <a href="${userData.loginUrl}" class="button">Login to PrintCare Dashboard</a>

            <h3>🚀 Getting Started</h3>
            <ol>
              <li>Click the login button above or visit the login URL</li>
              <li>Enter your username and password</li>
              <li>Complete your profile setup</li>
              <li>Explore the dashboard and available features</li>
            </ol>

            <p>If you need any assistance, please contact our support team at <a href="mailto:support@printcare.com">support@printcare.com</a> or call us at +91-XXXX-XXXX-XXX.</p>

            <p>Thank you for choosing PrintCare!</p>
            <p><strong>The PrintCare Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this email.</p>
            <p>© 2025 PrintCare Management System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to PrintCare Management System!

      Hello ${userData.name}!

      Your account has been created successfully. Here are your login credentials:

      Username: ${userData.username}
      Password: ${userData.password}
      Login URL: ${userData.loginUrl}

      IMPORTANT SECURITY NOTICE:
      - Please change your password after your first login
      - Keep your login credentials secure and confidential
      - Do not share your account with others
      - Contact support if you suspect unauthorized access

      Getting Started:
      1. Visit ${userData.loginUrl}
      2. Enter your username and password
      3. Complete your profile setup
      4. Explore the dashboard and available features

      For assistance, contact: support@printcare.com

      Thank you for choosing PrintCare!
      The PrintCare Team
    `
  }),

  passwordReset: (userData: { name: string, username: string, password: string, loginUrl: string }): EmailTemplate => ({
    subject: 'PrintCare - Password Reset Successful',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - PrintCare</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .credentials { background: white; padding: 20px; border-left: 4px solid #ff6b6b; margin: 20px 0; border-radius: 5px; }
          .button { display: inline-block; background: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
            <p>Your password has been reset successfully</p>
          </div>
          <div class="content">
            <h2>Hello ${userData.name}!</h2>
            <p>Your password has been reset by an administrator. Please use your new credentials to login:</p>
            
            <div class="credentials">
              <h3>🔑 Your New Login Credentials</h3>
              <p><strong>Username:</strong> ${userData.username}</p>
              <p><strong>New Password:</strong> ${userData.password}</p>
              <p><strong>Login URL:</strong> <a href="${userData.loginUrl}">${userData.loginUrl}</a></p>
            </div>

            <div class="warning">
              <strong>⚠️ Security Recommendations:</strong>
              <ul>
                <li>Change this password immediately after logging in</li>
                <li>Choose a strong, unique password</li>
                <li>Do not share your credentials with anyone</li>
                <li>Contact support if you didn't request this reset</li>
              </ul>
            </div>

            <a href="${userData.loginUrl}" class="button">Login with New Password</a>

            <p>If you didn't request a password reset, please contact our support team immediately at <a href="mailto:support@printcare.com">support@printcare.com</a>.</p>

            <p><strong>The PrintCare Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this email.</p>
            <p>© 2025 PrintCare Management System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Password Reset - PrintCare

      Hello ${userData.name}!

      Your password has been reset by an administrator.

      New Login Credentials:
      Username: ${userData.username}
      New Password: ${userData.password}
      Login URL: ${userData.loginUrl}

      SECURITY RECOMMENDATIONS:
      - Change this password immediately after logging in
      - Choose a strong, unique password
      - Do not share your credentials with anyone
      - Contact support if you didn't request this reset

      If you didn't request this reset, contact: support@printcare.com

      The PrintCare Team
    `
  }),

  resendCredentials: (clientData: { companyName: string, contactPerson: string, username: string, password: string, portalUrl: string }): EmailTemplate => ({
    subject: 'PrintCare - Client Portal Access Credentials',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Client Portal Access - PrintCare</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #20bf6b 0%, #0fb9b1 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .credentials { background: white; padding: 20px; border-left: 4px solid #20bf6b; margin: 20px 0; border-radius: 5px; }
          .button { display: inline-block; background: #20bf6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .features { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🖨️ PrintCare Client Portal</h1>
            <p>Your printing solutions management platform</p>
          </div>
          <div class="content">
            <h2>Dear ${clientData.contactPerson},</h2>
            <p>Greetings from PrintCare! We're resending your client portal access credentials as requested.</p>
            
            <div class="credentials">
              <h3>🔐 Portal Access Details</h3>
              <p><strong>Company:</strong> ${clientData.companyName}</p>
              <p><strong>Username:</strong> ${clientData.username}</p>
              <p><strong>Password:</strong> ${clientData.password}</p>
              <p><strong>Portal URL:</strong> <a href="${clientData.portalUrl}">${clientData.portalUrl}</a></p>
            </div>

            <div class="features">
              <h3>🚀 What you can do in the portal:</h3>
              <ul>
                <li>Track your printer service requests</li>
                <li>Monitor cartridge orders and deliveries</li>
                <li>View billing history and payments</li>
                <li>Submit new service requests</li>
                <li>Download invoices and reports</li>
                <li>Update your company information</li>
              </ul>
            </div>

            <a href="${clientData.portalUrl}" class="button">Access Client Portal</a>

            <h3>📞 Need Help?</h3>
            <p>Our support team is here to assist you:</p>
            <ul>
              <li><strong>Email:</strong> support@printcare.com</li>
              <li><strong>Phone:</strong> +91-XXXX-XXXX-XXX</li>
              <li><strong>Hours:</strong> Monday - Saturday, 9:00 AM - 6:00 PM</li>
            </ul>

            <p>Thank you for choosing PrintCare for your printing solutions!</p>
            <p><strong>Best regards,<br>The PrintCare Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this email.</p>
            <p>© 2025 PrintCare Management System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      PrintCare Client Portal Access

      Dear ${clientData.contactPerson},

      Greetings from PrintCare! We're resending your client portal access credentials.

      Portal Access Details:
      Company: ${clientData.companyName}
      Username: ${clientData.username}
      Password: ${clientData.password}
      Portal URL: ${clientData.portalUrl}

      Portal Features:
      - Track printer service requests
      - Monitor cartridge orders and deliveries
      - View billing history and payments
      - Submit new service requests
      - Download invoices and reports
      - Update company information

      Need Help?
      Email: support@printcare.com
      Phone: +91-XXXX-XXXX-XXX
      Hours: Monday - Saturday, 9:00 AM - 6:00 PM

      Thank you for choosing PrintCare!
      The PrintCare Team
    `
  }),

  // Aliases for backward compatibility
  userCredentials: (userData: { name: string, username: string, password: string, loginUrl: string }): EmailTemplate => ({
    ...emailTemplates.welcomeUser(userData)
  }),
}

// Send email function
export async function sendEmail(
  to: string | string[],
  templateType: keyof typeof emailTemplates,
  data: any,
  options?: { cc?: string[], bcc?: string[] }
): Promise<boolean> {
  try {
    const transporter = createTransporter()
    const template = emailTemplates[templateType](data)

    const mailOptions = {
      from: `"PrintCare System" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      cc: options?.cc?.join(', '),
      bcc: options?.bcc?.join(', '),
      subject: template.subject,
      text: template.text,
      html: template.html,
    }

    const info = await transporter.sendMail(mailOptions)
    logger.info('Email sent successfully', { messageId: info.messageId });
    return true
  } catch (error) {
    logger.error('Email sending failed', { error: error instanceof Error ? error.message : error })
    return false
  }
}

// Test email connection
export async function testEmailConnection(): Promise<boolean> {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    // console.log('Email connection verified successfully')
    logger.info('Email connection verified');
    return true
  } catch (error) {
    console.error('Email connection failed:', error)
    return false
  }
}

// Send welcome email to new user
export const sendWelcomeEmail = async (
  email: string,
  name: string,
  username: string,
  password: string
): Promise<boolean> => {
  const loginUrl = `${process.env.NEXTAUTH_URL}/login`
  return sendEmail(email, 'welcomeUser', { name, username, password, loginUrl })
}

// Send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  username: string,
  newPassword: string
): Promise<boolean> => {
  const loginUrl = `${process.env.NEXTAUTH_URL}/login`
  return sendEmail(email, 'passwordReset', { name, username, password: newPassword, loginUrl })
}

// Send credentials to client
export const sendClientCredentials = async (
  email: string,
  companyName: string,
  contactPerson: string,
  username: string,
  password: string
): Promise<boolean> => {
  const portalUrl = `${process.env.NEXTAUTH_URL}/client-portal`
  return sendEmail(email, 'resendCredentials', { companyName, contactPerson, username, password, portalUrl })
}