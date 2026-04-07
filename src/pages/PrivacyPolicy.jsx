import React from 'react';
import { NavLink } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', color: 'var(--bark)' }}>
            <div style={{ marginBottom: '40px' }}>
                <NavLink to="/login" style={{ color: 'var(--nscc-blue)', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
                    ← Back to Login
                </NavLink>
            </div>

            <h1 style={{ fontFamily: "'Lora', serif", fontSize: '32px', color: 'var(--nscc-blue)', marginBottom: '24px' }}>
                Student Data & Privacy Policy
            </h1>

            <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '24px' }}>
                Your privacy is our highest priority. The <strong>NSCC Student Wellness Hub</strong> is designed to be a safe, private space for you to reflect on your wellness. Below is our commitment to how your data is handled.
            </p>

            <section style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px', color: 'var(--nscc-blue)' }}>
                    1. Security by Design (Local Encryption)
                </h2>
                <p style={{ fontSize: '15px', lineHeight: '1.6' }}>
                    Unlike traditional apps, your journal entries and personal notes are <strong>encrypted locally on your device</strong> (using AES-256-GCM) before they are sent to our servers. This means:
                </p>
                <ul style={{ paddingLeft: '20px', marginTop: '12px', fontSize: '15px', lineHeight: '1.8' }}>
                    <li>Only <strong>you</strong> can read the text of your journal entries.</li>
                    <li>Not even the app developers or database administrators can see the contents of your journal.</li>
                    <li>Your data is "gibberish" to everyone except you.</li>
                </ul>
            </section>

            <section style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px', color: 'var(--nscc-blue)' }}>
                    2. Data We Collect
                </h2>
                <p style={{ fontSize: '15px', lineHeight: '1.6' }}>
                    To provide this service, we only require the minimum amount of information:
                </p>
                <ul style={{ paddingLeft: '20px', marginTop: '12px', fontSize: '15px', lineHeight: '1.8' }}>
                    <li><strong>NSCC Student Email:</strong> Used only as your secure identifier.</li>
                    <li><strong>Preferred Name:</strong> To personalize your dashboard.</li>
                    <li><strong>Wellness Pillar Scores:</strong> Stored securely to help you track your progress over time.</li>
                </ul>
            </section>

            <section style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px', color: 'var(--nscc-blue)' }}>
                    3. Secure Storage
                </h2>
                <p style={{ fontSize: '15px', lineHeight: '1.6' }}>
                    We use <strong>Supabase</strong>, a industry-standard backend provider, to store your information. Your data is hosted in a secure cloud environment within the **Canada (Central)** region to comply with data residency standards.
                </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px', color: 'var(--nscc-blue)' }}>
                    4. Your Rights
                </h2>
                <p style={{ fontSize: '15px', lineHeight: '1.6' }}>
                    You have full control over your wellness data. You can view your history at any time through the dashboard. If you wish to have your account or data deleted, please contact the developer via NSCC channels.
                </p>
            </section>

            <div style={{ marginTop: '48px', padding: '24px', backgroundColor: 'var(--parchment)', borderRadius: '12px', border: '1px solid #e0d0b0' }}>
                <p style={{ fontSize: '14px', fontStyle: 'italic', margin: 0 }}>
                    This policy ensures your mental health and wellness journey is protected, private, and entirely yours.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
