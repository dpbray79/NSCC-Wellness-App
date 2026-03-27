import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Modal } from 'react-bootstrap';
import './home.css';

const METRIC_DEETS = {
    sleep: { title: "Sleep Quality", icon: "🌙", color: "var(--nscc-blue)", 
        calc: "Calculated from self-reported restfulness.", why: "Foundation for memory and emotional stability at NSCC." },
    stress: { title: "Perceived Stress", icon: "🌊", color: "var(--terra)", 
        calc: "Measured using an inverted scale (Higher = Lower Stress).", why: "Crucial for preventing academic burnout." },
    cognitive: { title: "Cognitive Energy", icon: "✨", color: "var(--slate)", 
        calc: "Measure of mental alertness and focus.", why: "Helps schedule high-focus tasks during peak periods." },
    social: { title: "Social Belonging", icon: "🤲", color: "var(--amber)", 
        calc: "Sense of connection to the NSCC community.", why: "Key predictor of retention and wellbeing." }
};

const HolisticRadarChart = ({ metrics }) => {
    const size = 180;
    const center = size / 2;
    const radius = size * 0.35;
    
    // 4 Axes: Top=Sleep, Right=Stress, Bottom=Cognitive, Left=Social
    const getPoint = (val, angle) => {
        const r = (val / 10) * radius;
        const rad = (angle - 90) * (Math.PI / 180);
        return {
            x: center + r * Math.cos(rad),
            y: center + r * Math.sin(rad)
        };
    };

    const pSleep = getPoint(metrics.sleep, 0);
    const pStress = getPoint(metrics.stress, 90);
    const pCognitive = getPoint(metrics.cognitive, 180);
    const pSocial = getPoint(metrics.social, 270);

    const levels = [2.5, 5, 7.5, 10];
    
    return (
        <div className="radar-chart-wrap">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Background Grid */}
                {levels.map(level => {
                    const lSleep = getPoint(level, 0);
                    const lStress = getPoint(level, 90);
                    const lCognitive = getPoint(level, 180);
                    const lSocial = getPoint(level, 270);
                    return <path key={level} d={`M ${lSleep.x} ${lSleep.y} L ${lStress.x} ${lStress.y} L ${lCognitive.x} ${lCognitive.y} L ${lSocial.x} ${lSocial.y} Z`} 
                                 fill="none" stroke="var(--parchment)" strokeWidth="1" strokeDasharray={level === 10 ? "0" : "2,2"} />;
                })}
                {/* Axes */}
                {[0, 90, 180, 270].map(angle => {
                    const end = getPoint(10, angle);
                    return <line key={angle} x1={center} y1={center} x2={end.x} y2={end.y} stroke="var(--parchment)" strokeWidth="1" />;
                })}
                {/* Data Polygon */}
                <path d={`M ${pSleep.x} ${pSleep.y} L ${pStress.x} ${pStress.y} L ${pCognitive.x} ${pCognitive.y} L ${pSocial.x} ${pSocial.y} Z`} 
                      fill="rgba(0, 71, 128, 0.15)" stroke="var(--nscc-blue)" strokeWidth="2" strokeLinejoin="round" />
                {/* Labels */}
                <text x={center} y={center - radius - 10} textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--muted)">SLEEP</text>
                <text x={center + radius + 10} y={center + 4} textAnchor="start" fontSize="10" fontWeight="700" fill="var(--muted)">STRESS</text>
                <text x={center} y={center + radius + 15} textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--muted)">BRAIN</text>
                <text x={center - radius - 10} y={center + 4} textAnchor="end" fontSize="10" fontWeight="700" fill="var(--muted)">SOCIAL</text>
            </svg>
        </div>
    );
};

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
    const [metrics, setMetrics] = useState({ sleep: 7, stress: 5, cognitive: 6, social: 8, composite: 6.2 });
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showInfo, setShowInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase.from('checkins').select('*').order('created_at', { ascending: true }).limit(10);
            if (data && !error) {
                setHistory(data);
                if (data.length > 0) setMetrics(data[data.length - 1]);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const calcOffset = (val) => 113 - (113 * (val / 10));
    const calcStressOffset = (val) => 113 - (113 * ((10 - val) / 10));

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
                        <div className="status-score">{metrics.composite.toFixed(1)}</div>
                        <div className="status-label">Overall Index</div>
                    </div>
                </div>
            </header>

            <main className="dashboard-grid">
                {/* Grid Item: Priority Action */}
                <section className="grid-item priority-action">
                    <div className="item-inner">
                        <div className="card-label-mini">Action Required</div>
                        <h3>Daily Reflection</h3>
                        <p>Contribute to your wellness baseline with a 2-minute centering exercise.</p>
                        <button className="btn btn-primary btn-sm btn-full" onClick={() => navigate('/checkin')}>
                            Start Reflection &nbsp; →
                        </button>
                    </div>
                </section>

                {/* Grid Item: Pillars Grid */}
                <section className="grid-item pillars-view">
                    <div className="item-inner">
                        <div className="section-header-row">
                            <div className="card-label-mini">Core Pillars</div>
                            <span className="info-tip">Select icon for details</span>
                        </div>
                        
                        <div className="pillars-layout-flex">
                            <div className="radar-container">
                                <HolisticRadarChart metrics={metrics} />
                            </div>
                            
                            <div className="pillars-b2b-grid">
                                {Object.keys(METRIC_DEETS).map(key => {
                                    const deet = METRIC_DEETS[key];
                                    const val = metrics[key === 'stress' ? 'stress' : (key === 'cognitive' ? 'cognitive' : key)];
                                    const offset = key === 'stress' ? calcStressOffset(val) : calcOffset(val);
                                    
                                    return (
                                        <div key={key} className="pillar-box" onClick={() => navigate('/checkin')}>
                                            <div className="pillar-header">
                                                <span className="p-icon-small">{deet.icon}</span>
                                                <span className="p-title-small">{deet.title}</span>
                                                <button className="info-trigger" onClick={(e) => { e.stopPropagation(); setShowInfo(key); }}>i</button>
                                            </div>
                                            <div className="pillar-body">
                                                <div className="arc-mini">
                                                    <svg width="60" height="38" viewBox="0 0 80 50">
                                                        <path d="M 8 48 A 36 36 0 0 1 72 48" fill="none" stroke="var(--parchment)" strokeWidth="8" strokeLinecap="round" />
                                                        <path className="arc-animated" d="M 8 48 A 36 36 0 0 1 72 48" fill="none" stroke={deet.color} strokeWidth="8" strokeLinecap="round"
                                                            strokeDasharray="113" strokeDashoffset={offset} />
                                                    </svg>
                                                    <div className="arc-val-mini" style={{ color: deet.color }}>{val}</div>
                                                </div>
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
                        <span className="prof-modal-emoji">{showInfo && METRIC_DEETS[showInfo].icon}</span>
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