import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../../firebase.js';
import logoImage from '../../../images/Aero_NITK_logo.png';

// Sidebar navigation
function Sidebar({ activeTab, onTabChange }) {
    return (
        <aside className="admin-dashboard-sidebar">
            <div className="admin-dashboard-brand">
                <img src={logoImage} alt="AeroNITK logo" />
                <span>AERONITK</span>
            </div>

            <nav className="admin-dashboard-nav" aria-label="Admin sections">
                <button type="button" className={activeTab === 'home' ? 'active' : ''} onClick={() => onTabChange('home')}><span className="nav-icon">⌂</span>Home</button>
                <button type="button" className={activeTab === 'events' ? 'active' : ''} onClick={() => onTabChange('events')}><span className="nav-icon">▣</span>Events</button>
                <button type="button" className={activeTab === 'registrations' ? 'active' : ''} onClick={() => onTabChange('registrations')}><span className="nav-icon">▤</span>Registrations</button>
                <button type="button" className={activeTab === 'participants' ? 'active' : ''} onClick={() => onTabChange('participants')}><span className="nav-icon">👥</span>Participants</button>
                <button type="button" className={activeTab === 'settings' ? 'active' : ''} onClick={() => onTabChange('settings')}><span className="nav-icon">⚙</span>Settings</button>

                <Link
                    to="/login"
                    className="admin-dashboard-logout"
                    onClick={() => auth.signOut()}
                >
                    <span className="nav-icon logout-icon">↩</span>
                    LOG OUT
                </Link>
            </nav>
        </aside>
    );
}

export default Sidebar;
