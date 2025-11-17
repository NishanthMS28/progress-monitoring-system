# 📧 Email Setup Guide

The system uses Gmail to send automated progress notifications. You need to set up a Gmail App Password (not your regular password).

## Steps to Get Gmail App Password

1. **Go to your Google Account**
   - Visit: https://myaccount.google.com/
   - Sign in with the Gmail account you want to use for sending emails

2. **Enable 2-Step Verification** (if not already enabled)
   - Go to: Security → 2-Step Verification
   - Follow the prompts to enable it
   - This is required to generate App Passwords

3. **Generate App Password**
   - Go to: Security → 2-Step Verification → App passwords
   - Or direct link: https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Select "Other (Custom name)" as the device
   - Enter a name like "Progress Monitoring System"
   - Click "Generate"

4. **Copy the 16-Character Password**
   - Google will show you a 16-character password like: `abcd efgh ijkl mnop`
   - Copy it (remove spaces if any)

5. **Update backend/.env**
   ```env
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=abcdefghijklmnop
   ```
   - Replace `your_gmail@gmail.com` with your actual Gmail address
   - Replace the password with the 16-character App Password

6. **Restart Backend**
   ```bash
   cd backend
   npm run dev
   ```

## Testing Email

After setup, the system will automatically send emails every 5 minutes when progress is updated.

To test manually, you can use the API:
```bash
curl -X POST http://localhost:5000/api/email/test \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "your_email@gmail.com"}'
```

## Troubleshooting

**Error: "Application-specific password required"**
- You're using your regular Gmail password instead of an App Password
- Follow steps above to generate an App Password

**Error: "Invalid login"**
- Double-check the App Password (16 characters, no spaces)
- Ensure 2-Step Verification is enabled
- Make sure EMAIL_USER matches the Gmail account that generated the App Password

**Emails not sending**
- Check backend terminal for email error messages
- Verify EMAIL_USER and EMAIL_PASS in backend/.env
- Test with the curl command above

## Email Recipients

The system sends emails to:
- **Customer**: Uses `REAL_CUSTOMER_EMAIL` from `.env` (if configured)
- **Owner**: Uses `OWNER_EMAIL` from `.env` (if configured)
- Other customers (dummy accounts) will also attempt to send, but may fail if using dummy emails

**Note**: Configure these email addresses in `backend/.env` before seeding the database.

---

**Note**: For production, consider using a dedicated email service like SendGrid, Mailgun, or AWS SES instead of Gmail.

