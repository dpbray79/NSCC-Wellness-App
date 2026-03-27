import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './resources.css';

export default function Resources() {
    const [wellnessData, setWellnessData] = useState(null);
    const [insight, setInsight] = useState('');
    const [loadingInsight, setLoadingInsight] = useState(true);
    const [campusId, setCampusId] = useState('');
    const [campusResources, setCampusResources] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            // 1. Get latest Journal Check-In
            const { data: checkin } = await supabase
                .from('checkins')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (checkin) {
                setWellnessData(checkin);
                
                // 2. Get AI Insight
                try {
                    const { data, error } = await supabase.functions.invoke('wellness-insights', {
                        body: { wellnessData: checkin }
                    });
                    if (data?.insight) {
                        setInsight(data.insight);
                    }
                } catch (e) {
                    console.error("Insight error:", e);
                }
            }
            setLoadingInsight(false);
        };
        fetchData();
    }, []);

    const handleCampusChange = async (e) => {
        const id = e.target.value;
        setCampusId(id);
        if (!id) {
            setCampusResources(null);
            return;
        }

        try {
            const { data } = await supabase.functions.invoke('campus-resources', {
                body: { campusId: id }
            });
            setCampusResources(data);
        } catch (e) {
            console.error("Campus error:", e);
        }
    };

    return (
        <>
            <div style={{ marginBottom: '15px' }}>
                <h2 className="section-head" style={{ color: 'var(--nscc-blue)' }}>Support & Resources</h2>
                <p className="section-sub" style={{ marginTop: '4px' }}>You are not alone. There are people and places ready to help you navigate whatever you're facing.</p>
                
                {/* Primary App Link */}
                <div className="card" style={{ marginTop: '20px', border: '1.5px solid var(--nscc-blue)', background: 'var(--sage-lt)', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div>
                            <h3 style={{ fontSize: '15px', color: 'var(--nscc-blue)', margin: 0 }}>NSCC Student Wellness App</h3>
                            <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '2px 0 10px' }}>The official central tool for your student wellness journey.</p>
                            <a href="https://nscc.sharepoint.com/sites/Student_Wellness_Hub" target="_blank" rel="noreferrer" className="r-btn primary" style={{ display: 'inline-flex', padding: '8px 16px', fontSize: '12px' }}>
                                Visit Student Wellness Hub ↗
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Insight Card */}
            {wellnessData && (
                <div className="res-card insight-card" style={{ marginBottom: '16px', background: 'linear-gradient(135deg, var(--parchment) 0%, #fff 100%)', border: '1.5px solid var(--sage-lt)' }}>
                    <div className="r-header">
                        <h3 style={{ color: 'var(--sage)' }}>Self-Care Insight</h3>
                    </div>
                    <p style={{ fontStyle: 'italic', fontSize: '14px', color: 'var(--bark)', marginBottom: 0 }}>
                        {loadingInsight ? "Analyzing your latest Journal Check-In..." : (insight || "Your well-being matters. Consider exploring these resources today.")}
                    </p>
                </div>
            )}

            {/* Campus Selector */}
            <div className="res-card" style={{ marginBottom: '16px', padding: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--bark)' }}>Local Support for:</label>
                    <select 
                        value={campusId} 
                        onChange={handleCampusChange}
                        style={{ padding: '8px', borderRadius: '8px', border: '1.5px solid var(--soft)', fontSize: '13px', outline: 'none', background: '#fff' }}
                    >
                        <option value="">Select your campus...</option>
                        <option value="ivany">Ivany (Dartmouth)</option>
                        <option value="akerley">Akerley (Dartmouth)</option>
                        <option value="kingstec">Kingstec (Kentville)</option>
                    </select>
                </div>
            </div>

            <div className="resources-grid">

                {/* Urgent Crisis */}
                <div className="res-card urgent">
                    <div className="r-header">
                        <h3>Urgent Crisis Support</h3>
                        <span className="r-badge">24/7</span>
                    </div>
                    <p>If you or someone else is in immediate danger of experiencing a mental health emergency, please reach out immediately.</p>
                    <div className="r-links">
                        <a href="tel:988" className="r-btn primary">Call 988 (Suicide Crisis Helpline)</a>
                        <a href="tel:18884298167" className="r-btn primary">Call NS Mental Health Crisis Line</a>
                        <a href="https://good2talk.ca/novascotia/" target="_blank" rel="noreferrer" className="r-btn outline">Good2Talk Nova Scotia</a>
                    </div>
                </div>

                {/* NSCC Counselling */}
                <div className="res-card">
                    <div className="r-header">
                        <h3>NSCC Advising & Counselling</h3>
                    </div>
                    <p>Book a free, confidential session with an NSCC counsellor to discuss personal, academic, or career challenges.</p>
                    {campusResources?.counselling && (
                        <div style={{ background: 'var(--parchment)', padding: '10px', borderRadius: '8px', marginBottom: '15px', borderLeft: '3px solid var(--sage)', fontSize: '12px' }}>
                            <strong>Local Office:</strong> {campusResources.counselling}
                        </div>
                    )}
                    <div className="r-links">
                        <button className="r-btn primary">Book an Appointment</button>
                        <button className="r-btn outline">Learn about Student Services</button>
                    </div>
                </div>

                {/* Food Security */}
                <div className="res-card">
                    <div className="r-header">
                        <h3>Food Security</h3>
                    </div>
                    <p>Access emergency food support, campus food banks, and community nutrition resources.</p>
                    {campusResources?.food_bank && (
                        <div style={{ background: 'var(--parchment)', padding: '10px', borderRadius: '8px', marginBottom: '15px', borderLeft: '3px solid var(--sage)', fontSize: '12px' }}>
                            <strong>Campus Support:</strong> {campusResources.food_bank}
                        </div>
                    )}
                    <div className="r-links">
                        <button className="r-btn primary">Find Campus Food Bank</button>
                        <button className="r-btn outline">Feed Nova Scotia Locator</button>
                    </div>
                </div>

                {/* Peer Support */}
                <div className="res-card">
                    <div className="r-header">
                        <h3>Peer & Community Support</h3>
                    </div>
                    <p>Connect with other students, student union programs, and affinity groups for shared experiences.</p>
                    {campusResources?.peer_support && (
                        <div style={{ background: 'var(--parchment)', padding: '10px', borderRadius: '8px', marginBottom: '15px', borderLeft: '3px solid var(--sage)', fontSize: '12px' }}>
                            <strong>Student Association:</strong> {campusResources.peer_support}
                        </div>
                    )}
                    <div className="r-links">
                        <button className="r-btn outline">NSCC Student Association (SA)</button>
                        <button className="r-btn outline">2SLGBTQIA+ Resources</button>
                        <button className="r-btn outline">Indigenous Student Supports</button>
                    </div>
                </div>

            </div>

            <div style={{ height: '20px' }}></div>
        </>
    );
}
