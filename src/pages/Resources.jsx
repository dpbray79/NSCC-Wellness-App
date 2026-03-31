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
            const { data: checkin } = await supabase
                .from('checkins')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (checkin) {
                setWellnessData(checkin);
                try {
                    const { data } = await supabase.functions.invoke('wellness-insights', {
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
                <h2 className="section-head">Support & Resources</h2>
                <p className="section-sub" style={{ marginTop: '4px' }}>You are not alone. There are people and places ready to help you navigate whatever you're facing.</p>
            </div>

            {wellnessData && (
                <div className="res-card insight-card" style={{ marginBottom: '16px', background: 'linear-gradient(135deg, var(--parchment) 0%, #fff 100%)', border: '1.5px solid var(--sage-lt)' }}>
                    <div className="r-header">
                        <span className="r-icon">💡</span>
                        <h3 style={{ color: 'var(--sage)' }}>Self-Care Insight</h3>
                    </div>
                    <p style={{ fontStyle: 'italic', fontSize: '14px', color: 'var(--bark)', marginBottom: 0 }}>
                        {loadingInsight ? "Reflecting on your latest metrics..." : (insight || "Your well-being matters. Consider exploring these resources today.")}
                    </p>
                </div>
            )}

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

                <div className="res-card urgent">
                    <div className="r-header">
                        <span className="r-icon">🆘</span>
                        <h3>Urgent Crisis Support</h3>
                        <span className="r-badge">24/7</span>
                    </div>
                    <p>If you or someone else is in immediate danger, please reach out.</p>
                    <div className="r-links">
                        <a href="https://988.ca" target="_blank" rel="noreferrer" className="r-btn primary">Call 988 (Suicide Crisis Helpline)</a>
                        <a href="https://togetherall.com/en-ca/in-crisis/" target="_blank" rel="noreferrer" className="r-btn primary">Call NS Mental Health Crisis Line</a>
                        <a href="https://good2talk.ca/novascotia/" target="_blank" rel="noreferrer" className="r-btn outline">Good2Talk Nova Scotia</a>
                    </div>
                </div>

                <div className="res-card">
                    <div className="r-header">
                        <span className="r-icon">🪴</span>
                        <h3>NSCC Advising & Counselling</h3>
                    </div>
                    <p>Book a confidential session with an NSCC counsellor.</p>
                    {campusResources?.counselling && (
                        <div style={{ background: 'var(--parchment)', padding: '10px', borderRadius: '8px', marginBottom: '15px', borderLeft: '3px solid var(--sage)', fontSize: '12px' }}>
                            <strong>Local Office:</strong> {campusResources.counselling}
                        </div>
                    )}
                    <div className="r-links">
                        <a href="https://connect.nscc.ca/student/campuses/default.aspx" target="_blank" rel="noreferrer" className="r-btn primary">Book an Appointment</a>
                        <a href="https://www.tranquility.app/novascotia" target="_blank" rel="noreferrer" className="r-btn outline">Learn about Student Services</a>
                    </div>
                </div>

                <div className="res-card">
                    <div className="r-header">
                        <span className="r-icon">🍎</span>
                        <h3>Food Security</h3>
                    </div>
                    <p>Access emergency food support and community nutrition resources.</p>
                    {campusResources?.food_bank && (
                        <div style={{ background: 'var(--parchment)', padding: '10px', borderRadius: '8px', marginBottom: '15px', borderLeft: '3px solid var(--sage)', fontSize: '12px' }}>
                            <strong>Campus Support:</strong> {campusResources.food_bank}
                        </div>
                    )}
                    <div className="r-links">
                        <a href="https://www.nsccstudentassociation.ca/food-bank" target="_blank" rel="noreferrer" className="r-btn primary" style={{ textDecoration: 'none', textAlign: 'center' }}>Find Campus Food Bank</a>
                        <button className="r-btn outline">Feed Nova Scotia Locator</button>
                    </div>
                </div>

                <div className="res-card">
                    <div className="r-header">
                        <span className="r-icon">🫂</span>
                        <h3>Peer & Community Support</h3>
                    </div>
                    <p>Connect with other students and community groups for shared experiences.</p>
                    {campusResources?.peer_support && (
                        <div style={{ background: 'var(--parchment)', padding: '10px', borderRadius: '8px', marginBottom: '15px', borderLeft: '3px solid var(--sage)', fontSize: '12px' }}>
                            <strong>Student Association:</strong> {campusResources.peer_support}
                        </div>
                    )}
                    <div className="r-links">
                        <a href="https://togetherall.com/en-ca/" target="_blank" rel="noreferrer" className="r-btn outline">NSCC Student Association (SA)</a>
                        <a href="https://translifeline.org/hotline/" target="_blank" rel="noreferrer" className="r-btn outline">2SLGBTQIA+ Resources</a>
                        <a href="https://www.irsss.ca/irsss-services" target="_blank" rel="noreferrer" className="r-btn outline">Indigenous Student Supports</a>
                        <a href="https://breakthesilencens.ca/find-help/where-to-get-help/" target="_blank" rel="noreferrer" className="r-btn outline">Sexual Violence Support</a>
                        <a href="https://mha.nshealth.ca/en" target="_blank" rel="noreferrer" className="r-btn outline">NS Mental Health Hub</a>
                        <a href="https://bethere.org/Home" target="_blank" rel="noreferrer" className="r-btn outline">Help Others (Be There)</a>
                    </div>
                </div>

            </div>
            <div style={{ height: '100px' }}></div>
        </>
    );
}
