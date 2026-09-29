import nodemailer from "nodemailer";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface PasswordResetEmailParams {
  toEmail: string;
  recipientName: string;
  resetUrl: string;
}

/**
 * Creates and returns a Nodemailer Transporter using environment configurations
 */
function getEmailTransporter() {

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === "production",
    },
  });
}

/**
 * Sends an email using Nodemailer (SMTP) or falls back to mock logger in development
 */
export async function sendEmail(
  options: SendEmailOptions
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const emailFrom =
    options.from ||
    process.env.EMAIL_FROM ||
    `"ISKCON Vartak Nagar" <${process.env.SMTP_USER || "noreply@iskcon-tvn.org"}>`;

  const transporter = getEmailTransporter();

  // If SMTP is not yet configured, log mock dispatch for local development
  if (!transporter) {
    if (process.env.NODE_ENV !== "production") {
      console.info(
        `[Email Service (Mock)] Sent to: ${options.to} | Subject: ${options.subject}`
      );
    }
    return {
      success: true,
      messageId: `mock-${Date.now()}`,
    };
  }

  try {
    const info = await transporter.sendMail({
      from: emailFrom,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (err: any) {
    console.error("[Email Service] Nodemailer delivery failure:", err);
    return {
      success: false,
      error: err.message || "Failed to dispatch email",
    };
  }
}

/**
 * Sends a secure password reset link to an administrator
 */
export async function sendPasswordResetEmail({
  toEmail,
  recipientName,
  resetUrl,
}: PasswordResetEmailParams): Promise<{ success: boolean; error?: string }> {
  const subject = "Reset Your ISKCON Vartak Nagar Admin Password";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #faf7f2; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { background: #0f172a; padding: 28px; text-align: center; border-bottom: 3px solid #d97706; }
          .header h1 { margin: 0; color: #f8fafc; font-size: 20px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
          .header p { margin: 6px 0 0; color: #fbbf24; font-size: 13px; font-weight: 500; }
          .content { padding: 32px 28px; }
          .content h2 { margin-top: 0; font-size: 18px; color: #0f172a; }
          .content p { font-size: 14px; line-height: 1.6; color: #475569; margin: 16px 0; }
          .button-wrap { text-align: center; margin: 32px 0; }
          .btn { background-color: #d97706; color: #ffffff !important; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block; }
          .notice { font-size: 12px; color: #64748b; background: #f8fafc; padding: 14px; border-radius: 6px; border-left: 3px solid #cbd5e1; }
          .footer { padding: 20px 28px; background: #f8fafc; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ISKCON Vartak Nagar</h1>
            <p>Admin Portal Security</p>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hare Krishna ${recipientName || "Devotee"},</p>
            <p>We received a request to reset the password for your ISKCON Vartak Nagar Admin account. Click the button below to establish a new password:</p>
            <div class="button-wrap">
              <a href="${resetUrl}" class="btn" target="_blank">Reset Password</a>
            </div>
            <p>This single-use link is valid for <strong>1 hour</strong>. If you did not make this request, you can safely ignore this email.</p>
            <div class="notice">
              For security, after completing your password reset, any other active login sessions on other devices will be automatically revoked.
            </div>
          </div>
          <div class="footer">
            ISKCON Vartak Nagar, Thane (W) &bull; Hare Krishna Land
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `Hare Krishna ${recipientName || "Devotee"},\n\nWe received a request to reset your ISKCON Vartak Nagar Admin password.\n\nPlease visit the following link to reset your password:\n${resetUrl}\n\nThis link will expire in 1 hour. If you did not request this, please disregard this message.`;

  return sendEmail({
    to: toEmail,
    subject,
    html,
    text,
  });
}

export interface VolunteerConfirmationEmailParams {
  toEmail?: string;
  fullName: string;
  phone: string;
  sevaInterest: string;
  applicationNumber: string;
}

export interface VolunteerAdminNotificationParams {
  adminEmail?: string;
  fullName: string;
  phone: string;
  email?: string;
  sevaInterest: string;
  applicationNumber: string;
  preferredContactMethod?: string;
}

/**
 * Sends a welcome/confirmation email to a prospective volunteer
 */
export async function sendVolunteerConfirmationEmail({
  toEmail,
  fullName,
  phone,
  sevaInterest,
  applicationNumber,
}: VolunteerConfirmationEmailParams): Promise<{ success: boolean; error?: string }> {
  if (!toEmail) {
    return { success: true };
  }

  const subject = `🙏 Thank you for volunteering with ISKCON Vartak Nagar [${applicationNumber}]`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #faf7f2; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
          .header { background: #0f172a; padding: 32px 24px; text-align: center; border-bottom: 3px solid #d97706; }
          .header h1 { margin: 0; color: #f8fafc; font-size: 22px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
          .header p { margin: 6px 0 0; color: #fbbf24; font-size: 13px; font-weight: 500; }
          .content { padding: 32px 28px; }
          .content h2 { margin-top: 0; font-size: 20px; color: #0f172a; }
          .content p { font-size: 14px; line-height: 1.65; color: #475569; margin: 16px 0; }
          .badge-card { background: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; padding: 18px; margin: 24px 0; }
          .badge-card .title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #92400e; font-weight: 700; margin-bottom: 4px; }
          .badge-card .id-text { font-family: monospace; font-size: 18px; font-weight: 700; color: #78350f; }
          .detail-row { display: flex; justify-content: space-between; border-bottom: 1px dashed #e2e8f0; padding: 8px 0; font-size: 13px; }
          .detail-label { color: #64748b; }
          .detail-val { font-weight: 600; color: #0f172a; }
          .footer { padding: 24px 28px; background: #f8fafc; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ISKCON Vartak Nagar</h1>
            <p>Seva &amp; Community Outreach</p>
          </div>
          <div class="content">
            <h2>🙏 Hare Krishna ${fullName || "Devotee"},</h2>
            <p>Thank you for expressing your sincere interest in serving the Supreme Lord and community through ISKCON Vartak Nagar, Thane. We have successfully received your volunteer seva inquiry.</p>
            
            <div class="badge-card">
              <div class="title">Application Reference Number</div>
              <div class="id-text">${applicationNumber}</div>
            </div>

            <div style="margin: 20px 0;">
              <div class="detail-row">
                <span class="detail-label">Preferred Seva:</span>
                <span class="detail-val">${sevaInterest}</span>
              </div>
              <div class="detail-row" style="border-bottom: none;">
                <span class="detail-label">Contact Number:</span>
                <span class="detail-val">${phone}</span>
              </div>
            </div>

            <p>Our volunteer seva coordinator will reach out to you shortly via WhatsApp or Phone to discuss active schedules and welcome you to the temple family.</p>

            <p style="margin-top: 24px; font-style: italic; color: #64748b;">
              "In this world there is no work greater than the service of the Lord and His devotees." &mdash; Srila Prabhupada
            </p>
          </div>
          <div class="footer">
            ISKCON Vartak Nagar, Thane (W) &bull; Devotional Seva Department
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `Hare Krishna ${fullName},\n\nThank you for volunteering with ISKCON Vartak Nagar!\n\nApplication ID: ${applicationNumber}\nPreferred Seva: ${sevaInterest}\nContact: ${phone}\n\nOur volunteer coordinator will contact you shortly.\n\nHare Krishna!\nISKCON Vartak Nagar`;

  return sendEmail({
    to: toEmail,
    subject,
    html,
    text,
  });
}

/**
 * Sends notification to temple admin when a new volunteer registers
 */
export async function sendVolunteerAdminNotificationEmail({
  adminEmail,
  fullName,
  phone,
  email,
  sevaInterest,
  applicationNumber,
  preferredContactMethod = "WhatsApp",
}: VolunteerAdminNotificationParams): Promise<{ success: boolean; error?: string }> {
  const targetEmail =
    adminEmail || process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER;

  if (!targetEmail) {
    return { success: true };
  }

  const subject = `New Volunteer Application: ${fullName} [${applicationNumber}]`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #faf7f2; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; }
          .header { background: #0f172a; padding: 24px; text-align: center; border-bottom: 3px solid #d97706; }
          .header h1 { margin: 0; color: #f8fafc; font-size: 18px; font-weight: 600; text-transform: uppercase; }
          .content { padding: 28px; }
          .badge { display: inline-block; background: #fef3c7; color: #78350f; font-weight: 700; padding: 4px 10px; border-radius: 6px; font-size: 13px; font-family: monospace; }
          .detail-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          .detail-table td { padding: 10px 8px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
          .detail-table td.label { color: #64748b; width: 40%; }
          .detail-table td.val { font-weight: 600; color: #0f172a; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Volunteer Application Received</h1>
          </div>
          <div class="content">
            <p>A new devotee has registered for volunteer seva on the ISKCON Vartak Nagar website:</p>
            <table class="detail-table">
              <tr>
                <td class="label">Application ID</td>
                <td class="val"><span class="badge">${applicationNumber}</span></td>
              </tr>
              <tr>
                <td class="label">Full Name</td>
                <td class="val">${fullName}</td>
              </tr>
              <tr>
                <td class="label">Phone / WhatsApp</td>
                <td class="val">${phone}</td>
              </tr>
              <tr>
                <td class="label">Email</td>
                <td class="val">${email || "Not provided"}</td>
              </tr>
              <tr>
                <td class="label">Preferred Seva</td>
                <td class="val" style="color: #d97706;">${sevaInterest}</td>
              </tr>
              <tr>
                <td class="label">Contact Preference</td>
                <td class="val">${preferredContactMethod}</td>
              </tr>
            </table>
            <p style="margin-top: 24px; font-size: 13px; color: #64748b;">
              Please log in to the ISKCON Vartak Nagar Admin Panel under <strong>Volunteers</strong> to assign a coordinator and update the contact status.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: targetEmail,
    subject,
    html,
    text: `New Volunteer: ${fullName}\nPhone: ${phone}\nSeva: ${sevaInterest}\nID: ${applicationNumber}`,
  });
}

