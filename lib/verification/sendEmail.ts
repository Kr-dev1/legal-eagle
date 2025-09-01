import nodemailer from "nodemailer";

interface sendEmailProps {
  to: string;
  subject: string;
  url: string;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.NODEMAILER_EMAIL,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

export const sendEmail = async ({ to, url, subject }: sendEmailProps) => {
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <h2 style="color: #333333;">Authorization Required</h2>
            </td>
          </tr>
          <tr>
            <td>
              <p style="color: #555555;">Hello,</p>
              <p style="color: #555555;">To proceed, please authorize access by clicking the button below:</p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="${url}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                  Authorize Now
                </a>
              </p>
              <p style="color: #555555;">If the button doesn't work, copy and paste this link in your browser:</p>
              <p style="word-break: break-all; color: #555555;"><a href="${url}">${url}</a></p>
              <p style="color: #999999; font-size: 12px;">This link will expire in 15 minutes.</p>
              <p style="color: #555555;">Thank you,<br>The Team</p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
  try {
    await transporter.verify();
    console.log("SMTP connection verified successfully");

    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to,
      subject,
      html: htmlContent,
    });

    console.log("Message Sent", info.messageId);
    console.log("Mail sent to", to);
    return info;
  } catch (error) {
    console.error("SMTP connection failed:", error);
    return;
  }
};
