import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { supabase } from '../../supabaseClient';
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
const SupportIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
);

export default function TopBar() {
    const { instance, accounts } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    let initials = "??";
    if (accounts.length > 0) {
        const name = accounts[0].name || "";
        const parts = name.split(" ");
        if (parts.length > 1) {
            initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        } else if (parts[0].length > 0) {
            initials = parts[0][0].toUpperCase();
        }
    }

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            await instance.logoutPopup();
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <div className="topbar">
                <img src={wellnessLogo} alt="NSCC Student Wellness" className="wellness-header-logo" />
                <div className="logo-text">
                    <h1>Student Wellness App</h1>
                    <p>Nova Scotia Community College</p>
                </div>
                {isAuthenticated ? (
                    <div className="profile-menu-container" ref={dropdownRef}>
                        <div 
                            className="avatar-ring" 
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            style={{ cursor: 'pointer' }}
                        >
                            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--nscc-blue)' }}>{initials}</span>
                        </div>
                        {dropdownOpen && (
                            <div className="profile-dropdown">
                                <div className="dropdown-user-info">
                                    <strong>{accounts[0]?.name}</strong>
                                    <span className="dropdown-email">{accounts[0]?.username}</span>
                                </div>
                                <div className="dropdown-divider"></div>
                                <button className="dropdown-logout-btn" onClick={handleLogout}>
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="login-link-container">
                        <NavLink to="/login" className="login-link">Login</NavLink>
                    </div>
                )}
            </div>

            <div className="nav-tabs">
                <NavLink to="/" end className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}>
                    <HomeIcon /><span>Today</span>
                </NavLink>
                <NavLink to="/checkin" className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}>
                    <CheckIcon /><span>Journal Check-In</span>
                </NavLink>
                <NavLink to="/resources" className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}>
                    <SupportIcon /><span>Support</span>
                </NavLink>
            </div>
        </>
    );
}
