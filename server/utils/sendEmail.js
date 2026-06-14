import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully: " + info.messageId);
    
  } catch (error) {
    console.error("❌ Nodemailer Error:", error);
    throw new Error("Email failed to send");
  }
};