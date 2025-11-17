const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail({ to, subject, html, attachments = [] }) {
  await transporter.sendMail({
    from: `"Progress Monitor" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    attachments
  });
}

async function sendProgressEmail(project, progress) {
  if (!project.customer) return;
  const toList = [project.customer.email];
  // also notify owner (first owner user)
  try {
    const User = require('../models/User');
    const owner = await User.findOne({ role: 'owner' });
    if (owner?.email) toList.push(owner.email);
  } catch (e) { /* ignore */ }
  const subject = `Project Progress Update — ${project.customer.name || 'Customer'}`;
  const body = `
    <div style="font-family:Arial,sans-serif;">
      <h2>Project Progress Update</h2>
      <p><strong>Project:</strong> ${project.name}</p>
      <p><strong>Progress Count:</strong> ${progress.progressCount}</p>
      <p><strong>Expected:</strong> ${progress.expectedCount}</p>
      <p><strong>Status:</strong> ${progress.status}</p>
      <p><strong>Time:</strong> ${new Date(progress.timestamp).toLocaleString()}</p>
      ${progress.imagePath ? `<p><em>Image:</em> ${progress.imagePath}</p>` : ''}
      <hr/>
      <p>Best regards,<br/>Automated Progress Monitoring System</p>
    </div>
  `;
  await sendEmail({ to: toList.join(','), subject, html: body });
}

module.exports = { sendEmail, sendProgressEmail };

