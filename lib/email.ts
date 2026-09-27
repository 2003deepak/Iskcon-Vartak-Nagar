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
