// Simple Nodemailer sender for the Mike Bailey email
// Usage:
//   1) npm i nodemailer
//   2) export SMTP_HOST=... SMTP_PORT=587 SMTP_USER=... SMTP_PASS=...
//   3) node scripts/send-email-mike-bailey.js recipient@example.com

const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

async function main() {
  const to = process.argv[2];
  if (!to) {
    console.error('Usage: node scripts/send-email-mike-bailey.js recipient@example.com');
    process.exit(1);
  }

  const htmlPath = path.resolve(__dirname, '..', 'emails', 'email-mike-bailey.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  const host = process.env.SMTP_HOST || 'smtp.example.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
  });

  const info = await transporter.sendMail({
    from: 'Tom <no-reply@pinataro.com>',
    to,
    subject: 'Happy Belated Birthday Mike!',
    html,
    text: 'I made this QR Code for you. View the card: https://pinataro.com/QR-Contacts/Mike-Bailey/Mike-Bailey-Card.html  Download QR: https://pinataro.com/dl/QR-Contacts/Mike-Bailey/Mike-Bailey-QR.png',
  });

  console.log('Message sent:', info.messageId || info);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

