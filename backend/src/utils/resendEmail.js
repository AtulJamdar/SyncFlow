import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an email using Resend
 * @param {Object} options
 * @param {string} options.email - recipient email
 * @param {string} options.subject - email subject
 * @param {string} options.resetUrl - password reset link
 */
const sendEmail = async ({ email, subject, resetUrl }) => {
  try {
    await resend.emails.send({
      from: "SyncFlow <website@resend.dev>",
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            <div style="background-color: #2563eb; color: #ffffff; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 22px;">SyncFlow</h1>
            </div>
            <div style="padding: 30px;">
              <p style="font-size: 16px; color: #111827;">Hi there,</p>
              <p style="font-size: 15px; color: #374151;">
                We received a request to reset your password for your SyncFlow account.
              </p>
              <p style="font-size: 15px; color: #374151;">
                Click the button below to reset your password. This link is valid for <strong>15 minutes</strong>.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}"
                  style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; display: inline-block;">
                  Reset Password
                </a>
              </div>
              <p style="font-size: 14px; color: #6b7280;">
                If the button above doesn’t work, copy and paste the link below into your browser:
              </p>
              <p style="font-size: 13px; color: #2563eb; word-break: break-all;">
                ${resetUrl}
              </p>
              <p style="font-size: 13px; color: #9ca3af; margin-top: 30px;">
                If you didn’t request a password reset, you can safely ignore this email.
              </p>
            </div>
            <div style="background-color: #f3f4f6; padding: 15px; text-align: center; color: #9ca3af; font-size: 12px;">
              © ${new Date().getFullYear()} SyncFlow. All rights reserved.
            </div>
          </div>
        </div>
      `,
    });

    console.log(`✅ Email sent via Resend to: ${email}`);
  } catch (error) {
    console.error("❌ Error sending email via Resend:", error);
    throw error;
  }
};

export default sendEmail;
