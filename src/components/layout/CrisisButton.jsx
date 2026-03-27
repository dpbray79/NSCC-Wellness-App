import { useNavigate } from 'react-router-dom';
import './layout.css';

export default function CrisisButton() {
    const navigate = useNavigate();

    return (
        <button
            className="fab-crisis"
            onClick={() => navigate('/resources')}
            aria-label="Crisis Support"
            title="Get immediate crisis support"
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="fab-icon-svg">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span className="fab-label">Crisis</span>
        </button>
    );
}
