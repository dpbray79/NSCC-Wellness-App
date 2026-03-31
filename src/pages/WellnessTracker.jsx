import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { encryptJournal } from '../utils/encryption';
import './tracker.css';

const HINTS = {
    val: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    color: ['var(--danger)', 'var(--danger)', 'var(--danger)', 'var(--terra)', 'var(--terra)', 'var(--terra)', 'var(--sage)', 'var(--sage)', 'var(--amber)', 'var(--amber)', 'var(--moss)'],
};

const MSGS = [
    "You're going through something hard. Please reach out to support today.",
    "Things feel very difficult right now. The support footer below connects you.",
    "This is a tough day. Be gentle with yourself.",
    "A challenging stretch — take it one hour at a time.",
    "Moderate — some areas need a little attention.",
    "In the middle — some ups, some downs.",
    "Good — you're in a balanced place today.",
    "Doing well — keep nurturing what's working.",
    "Strong — your pillars are in good shape.",
    "Excellent — this is a really good day.",
    "You're at your best — savour this and share it."
];

const RadarInput = ({ values, onChange }) => {
    const size = 260;
    const center = size / 2;
    const radius = 80;
    const svgSize = 340;
    
    const getPoint = (val, angle) => {
        const r = (val / 10) * radius;
        const rad = (angle - 90) * (Math.PI / 180);
        return { x: svgSize/2 + r * Math.cos(rad), y: svgSize/2 + r * Math.sin(rad) };
    };

    const handleDrag = (e, key, angle) => {
        const svg = e.currentTarget.closest('svg');
        const rect = svg.getBoundingClientRect();
        const touch = e.touches ? e.touches[0] : e;
        const x = touch.clientX - rect.left - (rect.width/2);
        const y = touch.clientY - rect.top - (rect.height/2);
        
        const axisRad = (angle - 90) * (Math.PI / 180);
        const dist = (x * (svgSize/rect.width) * Math.cos(axisRad) + y * (svgSize/rect.height) * Math.sin(axisRad));
        const val = Math.max(0, Math.min(10, (dist / radius) * 10));
        onChange(key, Math.round(val * 10) / 10);
    };

    const axes = [
        { key: 'sleep', label: 'SLEEP', angle: 0, color: 'var(--nscc-blue)' },
        { key: 'stress', label: 'STRESS', angle: 90, color: 'var(--terra)' },
        { key: 'cog', label: 'BRAIN', angle: 180, color: 'var(--slate)' },
        { key: 'social', label: 'SOCIAL', angle: 270, color: 'var(--amber)' }
    ];

    const dataPoints = axes.map(a => getPoint(values[a.key], a.angle));
    const polyPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

    return (
        <div className="radar-input-container">
            <svg width="280" height="280" viewBox={`0 0 ${svgSize} ${svgSize}`} onTouchMove={(e) => e.preventDefault()}>
                {[2.5, 5, 7.5, 10].map(l => {
                    const pts = axes.map(a => getPoint(l, a.angle));
                    const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
                    return <path key={l} d={path} fill="none" stroke="var(--parchment)" strokeWidth="1" strokeDasharray="3,3" />;
                })}
                {axes.map(a => (
                    <line key={a.key} x1={svgSize/2} y1={svgSize/2} x2={getPoint(10, a.angle).x} y2={getPoint(10, a.angle).y} stroke="var(--parchment)" strokeWidth="1" />
                ))}
                <path d={polyPath} fill="rgba(0, 71, 128, 0.1)" stroke="var(--nscc-blue)" strokeWidth="2" strokeLinejoin="round" />
                {axes.map(a => {
                    const p = getPoint(values[a.key], a.angle);
                    return (
                        <g key={a.key} className="radar-knob" 
                           onMouseDown={(e) => {
                               const move = (ev) => handleDrag(ev, a.key, a.angle);
                               const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
                               window.addEventListener('mousemove', move);
                               window.addEventListener('mouseup', up);
                           }}
                           onTouchMove={(e) => handleDrag(e, a.key, a.angle)}
                        >
                            <circle cx={p.x} cy={p.y} r="14" fill="white" stroke={a.color} strokeWidth="3" style={{ cursor: 'grab', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />
                            <text 
                                x={getPoint(13.5, a.angle).x} 
                                y={getPoint(13.5, a.angle).y} 
                                textAnchor="middle" 
                                dominantBaseline="middle" 
                                fontSize="12" 
                                fontWeight="900" 
                                fill="var(--bark)"
                            >
                                {a.label}
                            </text>
                        </g>
                    );
                })}
            </svg>
            <div className="radar-hint">Drag the circles to track your wellness</div>
        </div>
    );
};

export default function WellnessTracker() {
    const navigate = useNavigate();
    const [sleep, setSleep] = useState(7);
    const [stress, setStress] = useState(5);
    const [cog, setCog] = useState(6);
    const [social, setSocial] = useState(8);
    const [journal, setJournal] = useState("");
    const [composite, setComposite] = useState(6.5);
    const [submitted, setSubmitted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const score = ((sleep + stress + cog + social) / 4);
        setComposite(score);
    }, [sleep, stress, cog, social]);

    const handleRadarChange = (key, val) => {
        if (key === 'sleep') setSleep(val);
        if (key === 'stress') setStress(val);
        if (key === 'cog') setCog(val);
        if (key === 'social') setSocial(val);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setIsSaving(true);
        let finalJournalContent = journal;
        if (journal.trim()) finalJournalContent = await encryptJournal(journal);

        const entry = {
            sleep, stress, cognitive: cog, social,
            composite: Math.round(composite * 10) / 10,
            journal: finalJournalContent
        };

        const { error } = await supabase.from('checkins').insert([entry]);
        if (error) {
            console.error("Error saving entry:", error);
            alert("Error saving entry. Please try again.");
            setIsSaving(false);
        } else {
            setSubmitted(true);
            setIsSaving(false);
        }
    };

    const getGradient = (val, colorVar) => `linear-gradient(90deg, ${colorVar} ${val * 10}%, var(--parchment) ${val * 10}%)`;
    const compRounded = Math.round(composite * 10) / 10;
    const compIdx = Math.min(10, Math.round(composite));
    const compColor = HINTS.color[compIdx];

    if (submitted) {
        return (
            <div className="success-state">
                <div className="success-icon-svg">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--nscc-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                </div>
                <h3>Journal check-in saved.</h3>
                <p>Thank you for taking a moment for your wellbeing.</p>
                <button className="btn btn-primary" onClick={() => navigate('/')}>Back to home</button>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <div className="card" style={{ borderLeft: '4px solid var(--nscc-blue)', marginBottom: '24px' }}>
                <div className="card-label" style={{ color: 'var(--nscc-blue)', fontWeight: 800 }}>Journal Check-In</div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--bark)', fontWeight: 700 }}>What is on your mind today?</h3>
                <textarea className="journal-field"
                    placeholder="Take a deep breath and start typing..."
                    value={journal}
                    onChange={(e) => setJournal(e.target.value)}
                ></textarea>
                <div className="journal-note">This entry is visible only to you.</div>
            </div>

            <div className="card">
                <div className="checkin-header-row" style={{ marginBottom: '15px' }}>
                    <div className="card-label" style={{ marginBottom: 0 }}>Core Pillars</div>
                </div>

                <div className="checkin-content">
                    <div className="pillar-checkin">
                        <div className="p-row">
                            <div className="p-row-head"><span className="p-name">Sleep Quality</span><span className="p-num" style={{ color: 'var(--nscc-blue)' }}>{sleep}</span></div>
                            <input type="range" className="p-slider" min="0" max="10" step="0.5" value={sleep} style={{ background: getGradient(sleep, 'var(--nscc-blue)'), color: 'var(--nscc-blue)' }} onChange={(e) => setSleep(Number(e.target.value))} />
                        </div>
                        <div className="p-row">
                            <div className="p-row-head"><span className="p-name">Stress Balance</span><span className="p-num" style={{ color: 'var(--terra)' }}>{stress}</span></div>
                            <input type="range" className="p-slider" min="0" max="10" step="0.5" value={stress} style={{ background: getGradient(stress, 'var(--terra)'), color: 'var(--terra)' }} onChange={(e) => setStress(Number(e.target.value))} />
                        </div>
                        <div className="p-row">
                            <div className="p-row-head"><span className="p-name">Cognitive Energy</span><span className="p-num" style={{ color: 'var(--slate)' }}>{cog}</span></div>
                            <input type="range" className="p-slider" min="0" max="10" step="0.5" value={cog} style={{ background: getGradient(cog, 'var(--slate)'), color: 'var(--slate)' }} onChange={(e) => setCog(Number(e.target.value))} />
                        </div>
                        <div className="p-row">
                            <div className="p-row-head"><span className="p-name">Social Belonging</span><span className="p-num" style={{ color: 'var(--amber)' }}>{social}</span></div>
                            <input type="range" className="p-slider" min="0" max="10" step="0.5" value={social} style={{ background: getGradient(social, 'var(--amber)'), color: 'var(--amber)' }} onChange={(e) => setSocial(Number(e.target.value))} />
                        </div>
                    </div>

                    <div style={{ marginTop: '22px', paddingTop: '18px', borderTop: '1px solid var(--parchment)' }}>
                        <div className="composite-bar-wrap">
                            <div className="composite-bar-head"><span>Overall Wellbeing Index</span><span style={{ color: compColor }}>{compRounded.toFixed(1)}</span></div>
                            <div className="composite-track"><div className="composite-fill" style={{ width: `${composite * 10}%`, background: `linear-gradient(90deg, ${compColor}, ${compColor}aa)` }}></div></div>
                            <p className="composite-msg">{MSGS[compIdx]}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <button className="btn btn-primary btn-full" onClick={handleSubmit} disabled={isSaving} style={{ background: 'var(--nscc-blue)' }}>
                    {isSaving ? "Saving..." : "Confirm & Save Check-In \u00A0→"}
                </button>
                <button className="btn btn-ghost btn-full btn-sm" disabled={isSaving} onClick={() => navigate('/')}>Maybe later</button>
            </div>
        </div>
    );
}