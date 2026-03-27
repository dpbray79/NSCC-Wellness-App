import { NavLink } from 'react-router-dom';
import wellnessLogo from '../../assets/student_wellness_logo.png';
import './layout.css';

const HomeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
);
const CheckIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 5v5l3 3"/>
    </svg>
);
const ChatIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
);
const SupportIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
);

export default function TopBar() {
    return (
        <>
            <div className="topbar">
                <img src={wellnessLogo} alt="NSCC Student Wellness" className="wellness-header-logo" />
                <div className="logo-text">
                    <h1>Student Wellness Hub</h1>
                    <p>Nova Scotia Community College</p>
                </div>
                <div className="avatar-ring">
                    <span style={{ fontSize: '15px' }}>🌿</span>
                </div>
            </div>

            <div className="nav-tabs">
                <NavLink to="/" end className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}>
                    <HomeIcon /><span>Today</span>
                </NavLink>
                <NavLink to="/checkin" className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}>
                    <CheckIcon /><span>Check In</span>
                </NavLink>
                <NavLink to="/chat" className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}>
                    <ChatIcon /><span>Chat</span>
                </NavLink>
                <NavLink to="/resources" className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}>
                    <SupportIcon /><span>Support</span>
                </NavLink>
            </div>
        </>
    );
}
