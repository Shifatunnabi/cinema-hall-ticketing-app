import nodemailer from "nodemailer";

export function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  if (!host || !user || !pass) {
    throw new Error(
      "Missing SMTP configuration (SMTP_HOST, SMTP_USER, SMTP_PASS)"
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function sendInviteEmail(
  to: string,
  link: string,
  role: "admin" | "moderator"
) {
  const from =
    process.env.MAIL_FROM ||
    process.env.SMTP_FROM ||
    process.env.SMTP_USER ||
    "no-reply@example.com";
  const transporter = getTransport();
  const subject = `You're invited as ${role} - Ananda Cinema Admin`;
  const html = `
    <div style="font-family:Arial,sans-serif">
      <h2>Welcome to Ananda Cinema Admin</h2>
      <p>You have been invited as <strong>${role}</strong>.</p>
      <p>Click the link below to set your password and activate your account:</p>
      <p><a href="${link}" style="background:#A2785C;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px">Set password</a></p>
      <p>Or copy this URL into your browser:</p>
      <p>${link}</p>
    </div>
  `;
  await transporter.sendMail({ from, to, subject, html });
}
