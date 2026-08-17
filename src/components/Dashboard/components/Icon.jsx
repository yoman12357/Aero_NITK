import React from 'react';

// Svg icons for the dashboard
function Icon({ type }) {
    if (type === 'dashboard') {
        return (
            <svg viewBox="0 0 24 24" className="admin-dashboard-icon">
                <path d="M4 3h16v18H4z" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M7 7h10M7 11h4M7 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        );
    }

    if (type === 'users') {
        return (
            <svg viewBox="0 0 24 24" className="admin-dashboard-icon">
                <path d="M17 21v-1c0-2.2-1.8-4-4-4H7c-2.2 0-4 1.8-4 4v1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="10" cy="7" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M21 21v-1a4 4 0 0 0-3-3.87" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M16 4.13a3 3 0 0 1 0 5.75" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        );
    }

    if (type === 'clock') {
        return (
            <svg viewBox="0 0 24 24" className="admin-dashboard-icon">
                <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }

    if (type === 'plus') {
        return (
            <svg viewBox="0 0 24 24" className="admin-dashboard-action-icon">
                <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
        );
    }

    if (type === 'users-action') {
        return (
            <svg viewBox="0 0 24 24" className="admin-dashboard-action-icon">
                <path d="M8 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm8 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm-8 2c-3.3 0-6 2-6 4.5V20h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M16 13c3.3 0 6 2 6 4.5V20h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        );
    }

    if (type === 'export') {
        return (
            <svg viewBox="0 0 24 24" className="admin-dashboard-action-icon">
                <path d="M12 3v10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M8 9l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 17h14v4H5z" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 24 24" className="admin-dashboard-action-icon">
            <path d="M4 5h16v14H4z" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M7 9h10M7 13h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

export default Icon;
