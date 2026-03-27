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
            <span className="fab-icon">🆘</span>
            <span className="fab-label">Crisis</span>
        </button>
    );
}
