/**
 * Email Sender Utility
 * Handles sending transactional emails (welcome, password reset, notifications).
 * Currently a stub that logs emails to console.
 * Replace with actual email service (Nodemailer, SendGrid, AWS SES) in production.
 */

// Uncomment and install nodemailer for actual email sending:
// const nodemailer = require('nodemailer');

// For production, configure transporter:
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: false,
//   auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
// });

/**
 * Send an email.
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text body
 * @param {string} html - Optional HTML body
 * @returns {Promise<boolean>} True if sent (or logged)
 */
const sendEmail = async (to, subject, text, html = null) => {
  // Log email for development
  console.log(`[EMAIL STUB] To: ${to}, Subject: ${subject}, Body: ${text.substring(0, 100)}...`);
  
  // In production, uncomment below:
  /*
  try {
    const info = await transporter.sendMail({
      from: `"Clean Match DSS" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      text,
      html: html || text
    });
    console.log(`Email sent: ${info.messageId}`);
    return true;
  } catch (err) {
    console.error('Email sending failed:', err);
    return false;
  }
  */
  
  return true; // stub returns true
};

/**
 * Send welcome email to a new user.
 * @param {string} to - User email
 * @param {string} username - User's username
 * @returns {Promise<boolean>}
 */
const sendWelcomeEmail = async (to, username) => {
  const subject = 'Welcome to Clean Match DSS';
  const text = `Hello ${username},\n\nYour account has been created successfully. You can now log in and start using the Decision Support System for cleaning equipment and detergents.\n\nBest regards,\nClean Match Team`;
  return sendEmail(to, subject, text);
};

/**
 * Send password reset email.
 * @param {string} to - User email
 * @param {string} resetToken - Password reset token
 * @returns {Promise<boolean>}
 */
const sendPasswordResetEmail = async (to, resetToken) => {
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  const subject = 'Password Reset Request';
  const text = `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`;
  return sendEmail(to, subject, text);
};

/**
 * Send account creation notification (for admins creating users).
 * @param {string} to - User email
 * @param {string} username - Username
 * @param {string} tempPassword - Temporary password
 * @returns {Promise<boolean>}
 */
const sendAccountCreatedEmail = async (to, username, tempPassword) => {
  const subject = 'Your Clean Match DSS Account';
  const text = `Hello ${username},\n\nAn administrator has created an account for you. You can log in with:\n\nUsername: ${username}\nPassword: ${tempPassword}\n\nPlease change your password after first login.\n\nBest regards,\nClean Match Team`;
  return sendEmail(to, subject, text);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendAccountCreatedEmail
};