const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

console.log('--- EmailService Initialized ---');
console.log(`User: ${process.env.EMAIL_USER}`);
console.log(`Pass Length: ${process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0}`);
console.log('--------------------------------');

async function sendEmail({ to, subject, html, attachments = [] }) {
  console.log(`📧 Attempting to send email to: ${to}`);
  try {
    const info = await transporter.sendMail({
      from: `"Progress Monitor" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments
    });
    console.log(`✅ Email sent successfully: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ Email send failed: ${error.message}`);
    throw error;
  }
}

async function sendProgressEmail(project, progress) {
  if (!project.customer) {
    console.log(`⚠️ No customer found for project ${project.name}, skipping email.`);
    return;
  }

  const toList = [];

  // Check customer preference
  if (project.customer && project.customer.emailNotifications !== false) {
    toList.push(project.customer.email);
  } else if (project.customer) {
    console.log(`ℹ️ Customer ${project.customer.email} has disabled notifications.`);
  }

  // also notify owner (first owner user)
  try {
    const User = require('../models/User');
    const owner = await User.findOne({ role: 'owner' });
    if (owner?.email) {
      // Check both user preference AND project-level preference
      if (owner.emailNotifications !== false && project.ownerEmailNotifications !== false) {
        toList.push(owner.email);
        console.log(`ℹ️ Added owner ${owner.email} to email recipients`);
      } else {
        if (owner.emailNotifications === false) {
          console.log(`ℹ️ Owner ${owner.email} has disabled global notifications.`);
        }
        if (project.ownerEmailNotifications === false) {
          console.log(`ℹ️ Owner has disabled notifications for project: ${project.name}`);
        }
      }
    } else {
      console.log('⚠️ No owner email found to notify');
    }
  } catch (e) {
    console.error('⚠️ Error fetching owner for email:', e.message);
  }

  if (toList.length === 0) {
    console.log('ℹ️ No recipients for email (preferences or missing users). Skipping.');
    return;
  }

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

  console.log(`📧 Preparing to send progress email to: ${toList.join(', ')}`);
  await sendEmail({ to: toList.join(','), subject, html: body });
}

module.exports = { sendEmail, sendProgressEmail };

