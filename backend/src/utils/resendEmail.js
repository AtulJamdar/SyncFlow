import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an email using Resend
 * @param {Object} options
 * @param {string} options.email - recipient email
 * @param {string} options.subject - email subject
 * @param {string} options.message - plain text message
 */
const sendEmail = async ({ email, subject, message }) => {
  try {
    await resend.emails.send({
      from: "Website <website@resend.dev>", //"syncflowforyou@syncflow.com",
      to: email,
      subject,
      text: message,
    });

    console.log(`✅ Email sent via Resend to: ${email}`);
  } catch (error) {
    console.error("❌ Error sending email via Resend:", error);
    throw error;
  }
};

export default sendEmail;
