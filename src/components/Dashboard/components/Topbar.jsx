import React from 'react';
import { useNavigate } from 'react-router-dom';

// Top header bar with notifications bell and admin profile avatar.
function Topbar({ isHidden }) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
            return;
        }

        navigate('/dashboard/home', { replace: true });
    };

    return (
        <header className={`admin-dashboard-topbar ${isHidden ? 'is-hidden' : ''}`}>
            <button className="admin-dashboard-back" type="button" aria-label="Go back" onClick={handleBack}>
                <span />
            </button>
            <h1>DASHBOARD</h1>
            <div className="admin-dashboard-topbar-right">
                <button type="button" className="admin-dashboard-icon-button" aria-label="Notifications">
                    <svg viewBox="0 0 24 24">
                        <path d="M6 17h12l-1.5-2.5V11a4.5 4.5 0 0 0-9 0v3.5L6 17Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                        <path d="M10 19a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
                <div className="admin-dashboard-profile">
                    <div className="admin-dashboard-avatar">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2c-4.2 0-8 2.2-8 5v1h16v-1c0-2.8-3.8-5-8-5Z" fill="currentColor" />
                        </svg>
                    </div>
                    <span>Admin</span>
                </div>
            </div>
        </header>
    );
}

export default Topbar;
