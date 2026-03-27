import { NavLink } from 'react-router-dom';
import './layout.css';

// NSCC Student Wellness Hub inline SVG logo
const NSCCLogo = () => (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
        <rect width="36" height="36" rx="10" fill="#004780"/>
        {/* Shield shape */}
        <path d="M18 6L7 10V18C7 23.5 12 28.5 18 30C24 28.5 29 23.5 29 18V10L18 6Z" fill="white" opacity="0.15"/>
        <path d="M18 8L9 11.5V18C9 22.8 13.2 27.2 18 28.5C22.8 27.2 27 22.8 27 18V11.5L18 8Z" fill="white" opacity="0.2"/>
        {/* Heart with leaf */}
        <path d="M18 23C18 23 11 18.5 11 14.5C11 12.5 12.5 11 14.5 11C16 11 17.2 11.9 18 13C18.8 11.9 20 11 21.5 11C23.5 11 25 12.5 25 14.5C25 18.5 18 23 18 23Z" fill="#00BCD4"/>
        {/* Small leaf accent */}
        <path d="M18 13C18 13 20 11 22 12C20.5 12.5 19 14 18 16C17 14 15.5 12.5 14 12C16 11 18 13 18 13Z" fill="white" opacity="0.6"/>
    </svg>
);

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
                <NSCCLogo />
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
