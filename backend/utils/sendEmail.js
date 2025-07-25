import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  // eslint-disable-next-line no-undef
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }, // app pass not mail
});

export async function sendEmail({ to, subject, html }) {
  await transporter.sendMail({ to, subject, html });
}
