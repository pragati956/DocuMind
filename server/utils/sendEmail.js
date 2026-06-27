import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (options) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev', // Fallback to sandbox sender
      to: options.to,
      subject: options.subject,
      html: options.text, // Maps your controller's custom message markup cleanly
    });

    if (error) {
      console.error("❌ Resend API Error:", error);
      throw new Error("Email failed to send");
    }

    console.log("✅ Email sent successfully via Resend. ID:", data.id);
    
  } catch (error) {
    console.error("❌ Email Utility Error:", error);
    throw new Error("Email failed to send");
  }
};