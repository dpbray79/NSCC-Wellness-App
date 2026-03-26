import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './home.css';

export default function Home() {
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState({
        sleep: 7,
        stress: 5,
        cognitive: 6,
        social: 8,
        food_security: 5,
        composite: 6.2
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            const { data, error } = await supabase
                .from('checkins')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (data && !error) {
                setMetrics(data);
            }
            setLoading(false);
        };

        fetchMetrics();
    }, []);

    // Helper to calculate the SVG dash offset (113 is total circumference)
    // For positive pillars, higher score = fuller circle.
    const calcOffset = (val) => 113 - (113 * (val / 10));
    // For stress, higher score = higher stress (worse), so the arc should be fuller if stress is HIGH or LOW?
    // Usually we want positive = full. If stress is 2, it's good (full). If stress is 8, it's bad (empty).
    // The previous math was inverted for composite, let's keep it simple and just show the raw value.
    const calcStressOffset = (val) => 113 - (113 * ((10 - val) / 10)); // 10 is empty, 0 is full

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>Loading your dashboard...</div>;
    }

    return (
        <>
            {/* Greeting */}
            <div className="greet-card">
                <h2>Good morning, William (Test Mode).</h2>

                <p>How are you showing up today?</p>
                <div className="greet-score">
                    <span className="num">{metrics.composite.toFixed(1)}</span>
                    <span className="denom">/ 10</span>
                    <span className="lbl">· Your wellness today</span>
                </div>
            </div>

            <p className="today-phrase">"Small moments of care add up to a whole life."</p>

            {/* Composite bar */}
            <div className="card">
                <div className="card-label">Overall Wellness Score</div>
                <div className="composite-bar-wrap">
                    <div className="composite-bar-head">
                        <span>Today's balance</span>
                        <span style={{ color: 'var(--sage)' }}>{metrics.composite.toFixed(1)}</span>
                    </div>
                    <div className="composite-track">
                        <div className="composite-fill" style={{ width: `${metrics.composite * 10}%`, background: 'linear-gradient(90deg, var(--sage), #6BAF94)' }}></div>
                    </div>
                </div>
            </div>

            {/* Pillar arc cards */}
            <div>
                <div className="card-label" style={{ padding: '0 4px 8px' }}>Your Five Pillars</div>
                <div className="pillars-grid">

                    {/* Sleep */}
                    <div className="pillar-card" onClick={() => navigate('/checkin')}>
                        <span className="p-icon">🌙</span>
                        <div className="arc-wrap">
                            <svg width="80" height="50" viewBox="0 0 80 50">
                                <path d="M 8 48 A 36 36 0 0 1 72 48" fill="none" stroke="#EBF4F0" strokeWidth="7" strokeLinecap="round" />
                                <path className="arc-animated" d="M 8 48 A 36 36 0 0 1 72 48" fill="none" stroke="var(--sage)" strokeWidth="7" strokeLinecap="round"
                                    strokeDasharray="113" strokeDashoffset={calcOffset(metrics.sleep)} />
                            </svg>
                            <div className="arc-value" style={{ color: 'var(--sage)' }}>{metrics.sleep}</div>
                        </div>
                        <div className="p-label">Sleep<br />Quality</div>
                    </div>

                    {/* Stress */}
                    <div className="pillar-card" onClick={() => navigate('/checkin')}>
                        <span className="p-icon">🌊</span>
                        <div className="arc-wrap">
                            <svg width="80" height="50" viewBox="0 0 80 50">
                                <path d="M 8 48 A 36 36 0 0 1 72 48" fill="none" stroke="var(--terra-lt)" strokeWidth="7" strokeLinecap="round" />
                                <path className="arc-animated" d="M 8 48 A 36 36 0 0 1 72 48" fill="none" stroke="var(--terra)" strokeWidth="7" strokeLinecap="round"
                                    strokeDasharray="113" strokeDashoffset={calcStressOffset(metrics.stress)} style={{ animationDelay: '.1s' }} />
                            </svg>
                            <div className="arc-value" style={{ color: 'var(--terra)' }}>{metrics.stress}</div>
                        </div>
                        <div className="p-label">Perceived<br />Stress</div>
                    </div>

                    {/* Cognitive */}
                    <div className="pillar-card" onClick={() => navigate('/checkin')}>
                        <span className="p-icon">✨</span>
                        <div className="arc-wrap">
                            <svg width="80" height="50" viewBox="0 0 80 50">
                                <path d="M 8 48 A 36 36 0 0 1 72 48" fill="none" stroke="var(--slate-lt)" strokeWidth="7" strokeLinecap="round" />
                                <path className="arc-animated" d="M 8 48 A 36 36 0 0 1 72 48" fill="none" stroke="var(--slate)" strokeWidth="7" strokeLinecap="round"
                                    strokeDasharray="113" strokeDashoffset={calcOffset(metrics.cognitive)} style={{ animationDelay: '.2s' }} />
                            </svg>
                            <div className="arc-value" style={{ color: 'var(--slate)' }}>{metrics.cognitive}</div>
                        </div>
                        <div className="p-label">Cognitive<br />Energy</div>
                    </div>

                    {/* Social */}
                    <div className="pillar-card" onClick={() => navigate('/checkin')}>
                        <span className="p-icon">🤲</span>
                        <div className="arc-wrap">
                            <svg width="80" height="50" viewBox="0 0 80 50">
                                <path d="M 8 48 A 36 36 0 0 1 72 48" fill="none" stroke="var(--amber-lt)" strokeWidth="7" strokeLinecap="round" />
                                <path className="arc-animated" d="M 8 48 A 36 36 0 0 1 72 48" fill="none" stroke="var(--amber)" strokeWidth="7" strokeLinecap="round"
                                    strokeDasharray="113" strokeDashoffset={calcOffset(metrics.social)} style={{ animationDelay: '.3s' }} />
                            </svg>
                            <div className="arc-value" style={{ color: 'var(--amber)' }}>{metrics.social}</div>
                        </div>
                        <div className="p-label">Social<br />Belonging</div>
                    </div>

                    {/* Food Security — wide */}
                    <div className="pillar-card wide" onClick={() => navigate('/resources')}>
                        <span className="p-icon" style={{ fontSize: '28px' }}>🍃</span>
                        <div className="wide-right">
                            <div className="p-label" style={{ fontSize: '12px', color: 'var(--bark)', fontWeight: 700 }}>Food Security</div>
                            <p>Access to nourishing food supports every other pillar. <span style={{ color: 'var(--moss)', fontWeight: 700 }}>NSCC resources →</span></p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div className="arc-wrap">
                                <svg width="70" height="44" viewBox="0 0 80 50">
                                    <path d="M 8 48 A 36 36 0 0 1 72 48" fill="none" stroke="var(--moss-lt)" strokeWidth="7" strokeLinecap="round" />
                                    <path className="arc-animated" d="M 8 48 A 36 36 0 0 1 72 48" fill="none" stroke="var(--moss)" strokeWidth="7" strokeLinecap="round"
                                        strokeDasharray="113" strokeDashoffset={calcOffset(metrics.food_security)} style={{ animationDelay: '.4s' }} />
                                </svg>
                                <div className="arc-value" style={{ color: 'var(--moss)', fontSize: '15px' }}>{metrics.food_security}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <button className="btn btn-primary btn-full" onClick={() => navigate('/checkin')} style={{ marginTop: '24px' }}>
                ✦ &nbsp; Update today's check-in
            </button>

        </>
    );
}