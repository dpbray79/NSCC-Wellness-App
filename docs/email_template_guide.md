# Supabase Email Template Guide

To provide a professional and friendly experience for NSCC students, please update your **Magic Link** email template in the Supabase Dashboard.

### 📍 Where to find it:
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Click **Authentication** in the sidebar.
3. Click **Email Templates**.
4. Select **Magic Link**.

---

### 📩 Magic Link Template

Copy and paste the following into the **Source** field:

```html
<h2>Welcome to the NSCC Student Wellness Hub</h2>
<p>Hi there!</p>
<p>You’re receiving this email because you requested a secure login to the <strong>NSCC Student Wellness App</strong>—a private space designed to help you track your well-being and stay connected to campus supports.</p>

<p>Click the link below to get started:</p>
<p><a href="{{ .ConfirmationURL }}">NSCC Student Wellness App</a></p>

<p><em>Note: This link will expire in 24 hours for your security. Your journal entries are always encrypted locally and are never readable by anyone else.</em></p>

<p>Take care,<br>The NSCC Wellness Team</p>
```

### 🏷️ Subject Line
Recommended: `Your secure login to the NSCC Student Wellness Hub`
