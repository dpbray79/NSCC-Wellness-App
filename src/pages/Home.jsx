import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Modal } from 'react-bootstrap';
import './home.css';

const METRIC_DEETS = {
    sleep: { title: "Sleep Quality", color: "var(--nscc-blue)", 
        calc: "Average quality of rest over the selected period.", why: "Restorative sleep is crucial for cognitive function and emotional regulation." },
    stress: { title: "Stress Balance", color: "var(--terra)", 
        calc: "Resilience against daily pressures and academic load.", why: "Managing stress prevents burnout and improves long-term focus." },
    cognitive: { title: "Cognitive Energy", color: "var(--slate)", 
        calc: "Mental clarity and sharpness for learning.", why: "High cognitive energy correlates with better academic performance." },
    social: { title: "Social Belonging", color: "var(--amber)", 
        calc: "Sense of connection to the NSCC community.", why: "Key predictor of retention and wellbeing." }
};

const PillarProgressBar = ({ val, color, label }) => (
    <div className="pillar-progress-wrap">
        <div className="pillar-progress-head">
            <span className="p-avg-label">{label}</span>
            <span className="p-avg-val" style={{ color }}>{val.toFixed(1)}</span>
        </div>
        <div className="pillar-progress-track">
            <div className="pillar-progress-fill" style={{ width: `${val * 10}%`, backgroundColor: color }}></div>
        </div>
    </div>
);

const MiniPillarBarChart = ({ history, attr, color }) => {
    if (!history || history.length === 0) return null;
    const last7 = history.slice(-7);
    const maxVal = 10;
    const barWidth = 6;
    const gap = 4;
    const height = 30;
    const width = (barWidth + gap) * 7 - gap;

    return (
        <div className="mini-bar-wrap">
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                {last7.map((d, i) => {
                    const h = (d[attr] / maxVal) * height;
                    const x = i * (barWidth + gap);
                    const y = height - h;
                    const isLatest = i === last7.length - 1;
                    return (
                        <rect key={i} x={x} y={y} width={barWidth} height={h} fill={isLatest ? color : 'var(--parchment)'} rx="2" 
                              style={{ opacity: isLatest ? 1 : 0.4 + (i * 0.08) }} />
                    );
                })}
            </svg>
        </div>
    );
};

// HolisticRadarChart removed for simplicity and readability as per user request.

const MonthlyProgressionChart = ({ data }) => {
    if (!data || data.length < 2) return <div className="no-data">Insufficient data for trend analysis.</div>;
    const width = 400; const height = 140; const padding = 30; const maxVal = 10;

    // Calculate 3-day rolling average for smoothing
    const smoothedData = data.map((d, i) => {
        const windowSize = 3;
        const start = Math.max(0, i - Math.floor(windowSize / 2));
        const end = Math.min(data.length, start + windowSize);
        const window = data.slice(start, end);
        const avg = window.reduce((sum, curr) => sum + curr.composite, 0) / window.length;
        return { ...d, rollingAvg: avg };
    });

    const getPoints = (attr) => smoothedData.map((d, i) => {
        const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
        const y = height - ((d[attr] / maxVal) * (height - padding * 2) + padding);
        return `${x},${y}`;
    }).join(' ');

    const rawPoints = getPoints('composite');
    const rollingPoints = getPoints('rollingAvg');

    return (
        <div className="progression-chart-wrap">
            <svg viewBox={`0 0 ${width} ${height}`} className="progression-svg" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--nscc-teal)" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="var(--nscc-teal)" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={`M ${padding},${height-padding} ${rollingPoints} L ${width-padding},${height-padding} Z`} fill="url(#lineGrad)" />
                
                {/* Raw Data (Subtle Dashed) */}
                <polyline fill="none" stroke="var(--parchment)" strokeWidth="1" strokeDasharray="3,2" points={rawPoints} />
                
                {/* Rolling Average (Bold Primary) */}
                <polyline fill="none" stroke="var(--nscc-blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={rollingPoints} className="trend-line-path" />
                
                {data.map((d, i) => {
                    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
                    const y = height - ((smoothedData[i].rollingAvg / maxVal) * (height - padding * 2) + padding);
                    return <circle key={i} cx={x} cy={y} r="3" fill="var(--warm-white)" stroke="var(--nscc-blue)" strokeWidth="1.5" />;
                })}
            </svg>
            <div className="chart-labels">
                <span className="chart-label-start">{new Date(data[0].created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                <span className="chart-label-info">7-Day Rolling Trend</span>
                <span className="chart-label-end">{new Date(data[data.length-1].created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
            </div>
        </div>
    );
};

export default function Home() {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [avgRange, setAvgRange] = useState('7d'); // '7d' or '30d'
    const [loading, setLoading] = useState(true);
    const [showInfo, setShowInfo] = useState(null);

    useEffect(() => { fetchHistory(); }, []);

    async function fetchHistory() {
        try {
            const { data, error } = await supabase
                .from('checkins')
                .select('*')
                .order('created_at', { ascending: true })
                .limit(30);
            if (data) setHistory(data);
        } catch (e) { console.error(e); } finally { setLoading(e => false); }
    }

    const calculateAvg = (attr) => {
        if (!history || history.length === 0) return 0;
        const count = avgRange === '7d' ? 7 : 30;
        const recent = history.slice(-count);
        const sum = recent.reduce((acc, curr) => acc + (curr[attr] || 0), 0);
        return sum / recent.length;
    };

    const latest = history[history.length - 1] || {};
    const metrics = {
        sleep: calculateAvg('sleep'),
        stress: calculateAvg('stress'),
        cognitive: calculateAvg('cognitive'),
        social: calculateAvg('social')
    };

    const overallIndex = (metrics.sleep + metrics.stress + metrics.cognitive + metrics.social) / 4;

    if (loading) return <div className="hub-loader"><div className="hub-spinner"></div><p>Syncing App...</p></div>;

    return (
        <div className="dashboard-container">
            {/* Header / Greeting Bar - Professional B2B Style */}
            <header className="dashboard-header">
                <div className="header-left">
                    <div className="hub-tag">
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="var(--nscc-teal)"><path d="M7 0L0 3V7C0 10.3 3.1 13.3 7 14C10.9 13.3 14 10.3 14 7V3L7 0Z" opacity="0.8"/></svg>
                        <span>Student Wellness App</span>
                    </div>
                    <h1>Student Dashboard</h1>
                    <p className="welcome-sub">Welcome back, William. Here is your current wellness snapshot.</p>
                </div>
                <div className="header-right">
                    <div className="status-badge">
                        <div className="status-score">{overallIndex.toFixed(1)}</div>
                        <div className="status-label">Overall Index</div>
                    </div>
                </div>
            </header>

            <main className="dashboard-grid">
                {/* Grid Item: Priority Action */}
                <section className="grid-item priority-action">
                    <div className="item-inner" style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div className="card-label-mini" style={{ marginBottom: '2px' }}>Action Required</div>
                                <h3 style={{ margin: 0, fontSize: '18px' }}>Journal Check-In</h3>
                            </div>
                            <button className="btn btn-primary btn-sm" onClick={() => navigate('/checkin')} style={{ padding: '6px 16px', fontSize: '11px', minWidth: 'fit-content' }}>
                                Start Check-In &nbsp; →
                            </button>
                        </div>
                        <p style={{ marginTop: '8px', marginBottom: 0, fontSize: '13px' }}>Contribute to your wellness baseline with a 2-minute centering exercise.</p>
                    </div>
                </section>

                {/* Grid Item: Pillars Grid */}
                <section className="grid-item pillars-view">
                    <div className="item-inner">
                        <div className="section-head-with-controls">
                            <h2 className="section-title">Core Pillars</h2>
                            <div className="dashboard-controls">
                                <div className="segment-toggle">
                                    <button className={avgRange === '7d' ? 'active' : ''} onClick={() => setAvgRange('7d')}>7 Day</button>
                                    <button className={avgRange === '30d' ? 'active' : ''} onClick={() => setAvgRange('30d')}>Monthly</button>
                                </div>
                            </div>
                        </div>

                        <div className="pillars-container-b2b">
                            <div className="pillars-b2b-grid">
                                    {Object.entries(METRIC_DEETS).map(([key, deet]) => {
                                        const avg = metrics[key];
                                        return (
                                            <div key={key} className="pillar-box" onClick={() => navigate('/checkin')}>
                                                <div className="pillar-header">
                                                    <span className="p-title-small">{deet.title}</span>
                                                    <button className="info-trigger" onClick={(e) => { e.stopPropagation(); setShowInfo(key); }}>i</button>
                                                </div>
                                                <div className="pillar-body">
                                                    <PillarProgressBar val={avg} color={deet.color} label={`${avgRange === '7d' ? '7D' : '30D'} Average`} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                        </div>
                    </div>
                </section>

                {/* Grid Item: Trend Visualization */}
                <section className="grid-item trend-view">
                    <div className="item-inner">
                        <div className="card-label-mini">Health Analytics</div>
                        <h3>Wellbeing Trend</h3>
                        <MonthlyProgressionChart data={history} />
                    </div>
                </section>
            </main>

            {/* Info Modal */}
            <Modal show={!!showInfo} onHide={() => setShowInfo(null)} centered contentClassName="professional-modal">
                <Modal.Body>
                    <div className="prof-modal-header">
                        <h3>{showInfo && METRIC_DEETS[showInfo].title}</h3>
                    </div>
                    <div className="prof-modal-content">
                        <label>Calculation Methodology</label>
                        <p>{showInfo && METRIC_DEETS[showInfo].calc}</p>
                        <label>Institutional Importance</label>
                        <p>{showInfo && METRIC_DEETS[showInfo].why}</p>
                    </div>
                    <button className="btn btn-outline btn-full" onClick={() => setShowInfo(null)}>Close</button>
                </Modal.Body>
            </Modal>
        </div>
    );
}