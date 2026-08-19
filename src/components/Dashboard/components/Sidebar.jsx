import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { auth } from '../../../firebase.js';
import logoImage from '../../../images/Aero_NITK_logo.png';

// Sidebar navigation
function Sidebar({ activeTab }) {
    return (
        <aside className="admin-dashboard-sidebar">
            <div className="admin-dashboard-brand">
                <img src={logoImage} alt="AeroNITK logo" />
                <span>AERONITK</span>
            </div>

            <nav className="admin-dashboard-nav" aria-label="Admin sections">
                <NavLink to="/dashboard/home" className={({ isActive }) => (isActive || activeTab === 'home' ? 'active' : '')}><span className="nav-icon">⌂</span>Home</NavLink>
                <NavLink to="/dashboard/events" className={({ isActive }) => (isActive || activeTab === 'events' ? 'active' : '')}><span className="nav-icon">▣</span>Events</NavLink>
                <NavLink to="/dashboard/registrations" className={({ isActive }) => (isActive || activeTab === 'registrations' ? 'active' : '')}><span className="nav-icon">▤</span>Registrations</NavLink>
                <NavLink to="/dashboard/gallery" className={({ isActive }) => (isActive || activeTab === 'gallery' ? 'active' : '')}><span className="nav-icon">◫</span>Gallery</NavLink>
                <NavLink to="/dashboard/participants" className={({ isActive }) => (isActive || activeTab === 'participants' ? 'active' : '')}><span className="nav-icon">👥</span>Participants</NavLink>
                <NavLink to="/dashboard/settings" className={({ isActive }) => (isActive || activeTab === 'settings' ? 'active' : '')}><span className="nav-icon">⚙</span>Settings</NavLink>
                <NavLink to="/dashboard/teams" className={({ isActive }) => (isActive || activeTab === 'teams' ? 'active' : '')}><span className="nav-icon">👥</span>Teams</NavLink>

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
