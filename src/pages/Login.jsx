import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleMagicLink = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Send Magic Link to student email
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    // Redirect back to the app after clicking the link
                    emailRedirectTo: window.location.origin,
                }
            });

            if (error) throw error;
            setEmailSent(true);

        } catch (error) {
            console.error("Login Error:", error);
            alert("Error sending magic link. Please check the email address or try again.");
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', minHeight: '60vh', alignItems: 'center' }}>
                <div className="card" style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--nscc-teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                        </svg>
                    </div>
                    <h3 style={{ margin: '0 0 8px', fontWeight: 800 }}>Check your inbox</h3>
                    <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px' }}>
                        We've sent a magic login link to <strong>{email}</strong>. 
                        Click the link in the email to sign in instantly.
                    </p>
                    <button className="btn btn-ghost" onClick={() => setEmailSent(false)}>Back to sign in</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', minHeight: '60vh', alignItems: 'center' }}>
            <div className="card" style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}>
                <h1 style={{ fontFamily: "'Lora', serif", margin: '0 0 4px', fontSize: '24px' }}>Welcome Back</h1>
                <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '24px' }}>Sign in with your student email to access your wellness journal.</p>

                <form onSubmit={handleMagicLink}>
                    <div style={{ marginBottom: '16px', textAlign: 'left' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: 'var(--nscc-blue)', textTransform: 'uppercase', marginBottom: '6px' }}>Student Email Address</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            placeholder="e.g. w0123456@campus.nscc.ca" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            disabled={loading}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? 'Sending link...' : 'Send Magic Login Link \u00A0→'}
                    </button>
                </form>
                
                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--parchment)' }}>
                    <p style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: '1.4' }}>
                        Magic Link is a passwordless login method. 
                        No password management is required for your security.
                    </p>
                </div>
            </div>
        </div>
    );
}