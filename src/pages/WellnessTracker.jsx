import { useState, useEffect } from 'react';
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

import { supabase } from '../supabaseClient';
import { encryptJournal } from '../utils/encryption';

export default function WellnessTracker() {
    const [sleep, setSleep] = useState(7);
    const [stress, setStress] = useState(5);
    const [cog, setCog] = useState(6);
    const [social, setSocial] = useState(8);
    const [food, setFood] = useState(5);
    const [journal, setJournal] = useState("");
    const [composite, setComposite] = useState(6.2);
    const [submitted, setSubmitted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // Composite Calculation (Stress is inverted)
        const score = ((sleep + (10 - stress) + cog + social + food) / 5);
        setComposite(score);
    }, [sleep, stress, cog, social, food]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        let finalJournalContent = journal;
        if (journal.trim()) {
            finalJournalContent = await encryptJournal(journal);
        }

        const entry = {
            sleep,
            stress,
            cognitive: cog,
            social,
            food_security: food,
            composite: Math.round(composite * 10) / 10,
            journal: finalJournalContent
        };

        // Insert into Supabase
        const { error } = await supabase
            .from('checkins')
            .insert([entry]);

        if (error) {
            console.error("Error saving entry:", error);
            alert("There was an error saving your entry. Please try again.");
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
            <div className="success-state" style={{ display: 'flex', animation: 'fadeUp .5s ease both' }}>
                <div className="success-icon" style={{ fontSize: '56px' }}>🌿</div>
                <h3 style={{ fontFamily: "'Lora', serif", fontSize: '22px', fontWeight: 600, color: 'var(--sage)' }}>Check-in saved.</h3>
                <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, maxWidth: '260px', margin: '0 auto 16px' }}>
                    Thank you for taking that moment for yourself. It matters more than you know.
                </p>
                <button className="btn btn-primary" onClick={() => setSubmitted(false)}>
                    Back to home
                </button>
            </div>
        );
    }

    return (
        <>
            {/* Journal - PRIORITIZED at the top */}
            <div className="card" style={{ borderLeft: '4px solid var(--nscc-blue)', marginBottom: '24px' }}>
                <div className="card-label" style={{ color: 'var(--nscc-blue)', fontWeight: 800 }}>Daily Reflection</div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--bark)', fontWeight: 700 }}>What is on your mind today?</h3>
                <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '16px', lineHeight: 1.5 }}>Take a moment to center yourself. There are no right or wrong answers here.</p>
                <textarea className="journal-field"
                    placeholder="Take a deep breath and start typing..."
                    style={{ minHeight: '140px', fontSize: '15px' }}
                    value={journal}
                    onChange={(e) => setJournal(e.target.value)}
                ></textarea>
                <div className="journal-note">🔒 This entry is end-to-end encrypted and visible only to you.</div>
            </div>

            <div className="card">
                <div className="card-label">Check-in Sliders</div>
                <form className="pillar-checkin" onSubmit={handleSubmit}>

                    {/* Sleep */}
                    <div className="p-row">
                        <div className="p-row-head">
                            <span className="p-emoji">🌙</span>
                            <span className="p-name">Sleep Quality</span>
                            <span className="p-num" style={{ color: 'var(--nscc-blue)' }}>{sleep}</span>
                        </div>
                        <p className="p-row-hint">How rested do you feel after last night?</p>
                        <input type="range" className="p-slider" min="0" max="10" value={sleep}
                            style={{ background: getGradient(sleep, 'var(--nscc-blue)'), color: 'var(--nscc-blue)' }}
                            onChange={(e) => setSleep(Number(e.target.value))} />
                    </div>

                    {/* Stress */}
                    <div className="p-row">
                        <div className="p-row-head">
                            <span className="p-emoji">🌊</span>
                            <span className="p-name">Perceived Stress</span>
                            <span className="p-num" style={{ color: 'var(--terra)' }}>{stress}</span>
                        </div>
                        <p className="p-row-hint">How pressured or overwhelmed do you feel?</p>
                        <input type="range" className="p-slider" min="0" max="10" value={stress}
                            style={{ background: getGradient(stress, 'var(--terra)'), color: 'var(--terra)' }}
                            onChange={(e) => setStress(Number(e.target.value))} />
                    </div>

                    {/* Cognitive */}
                    <div className="p-row">
                        <div className="p-row-head">
                            <span className="p-emoji">✨</span>
                            <span className="p-name">Cognitive Energy</span>
                            <span className="p-num" style={{ color: 'var(--slate)' }}>{cog}</span>
                        </div>
                        <p className="p-row-hint">How sharp and focused does your mind feel?</p>
                        <input type="range" className="p-slider" min="0" max="10" value={cog}
                            style={{ background: getGradient(cog, 'var(--slate)'), color: 'var(--slate)' }}
                            onChange={(e) => setCog(Number(e.target.value))} />
                    </div>

                    {/* Social */}
                    <div className="p-row">
                        <div className="p-row-head">
                            <span className="p-emoji">🤲</span>
                            <span className="p-name">Social Belonging</span>
                            <span className="p-num" style={{ color: 'var(--amber)' }}>{social}</span>
                        </div>
                        <p className="p-row-hint">How connected and supported do you feel?</p>
                        <input type="range" className="p-slider" min="0" max="10" value={social}
                            style={{ background: getGradient(social, 'var(--amber)'), color: 'var(--amber)' }}
                            onChange={(e) => setSocial(Number(e.target.value))} />
                    </div>

                    {/* Food */}
                    <div className="p-row">
                        <div className="p-row-head">
                            <span className="p-emoji">🍃</span>
                            <span className="p-name">Food Security</span>
                            <span className="p-num" style={{ color: 'var(--nscc-teal)' }}>{food}</span>
                        </div>
                        <p className="p-row-hint">Confidence in accessing nourishing food today?</p>
                        <input type="range" className="p-slider" min="0" max="10" value={food}
                            style={{ background: getGradient(food, 'var(--nscc-teal)'), color: 'var(--nscc-teal)' }}
                            onChange={(e) => setFood(Number(e.target.value))} />
                    </div>

                    {/* Live composite */}
                    <div style={{ marginTop: '22px', paddingTop: '18px', borderTop: '1px solid var(--parchment)' }}>
                        <div className="composite-bar-wrap">
                            <div className="composite-bar-head">
                                <span>Overall Wellbeing Index</span>
                                <span style={{ color: compColor }}>{compRounded.toFixed(1)}</span>
                            </div>
                            <div className="composite-track">
                                <div className="composite-fill" style={{ width: `${composite * 10}%`, background: `linear-gradient(90deg, ${compColor}, ${compColor}aa)` }}></div>
                            </div>
                            <p className="composite-msg">{MSGS[compIdx]}</p>
                        </div>
                    </div>

                    {/* Hidden submit button to allow enter key submission if needed */}
                    <button type="submit" style={{ display: 'none' }}></button>
                </form>
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button className="btn btn-primary btn-full" onClick={handleSubmit} disabled={isSaving} style={{ background: 'var(--nscc-blue)' }}>
                    {isSaving ? "Saving..." : "Confirm & Save Check-in \u00A0→"}
                </button>
                <button className="btn btn-ghost btn-full btn-sm" disabled={isSaving} onClick={() => navigate('/')}>
                    Maybe later
                </button>
            </div>
        </>
    );
}