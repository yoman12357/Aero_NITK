import React, { useState, useCallback } from 'react';
import Footer from './footer.jsx';

// Hooks
import { useEvents } from './Dashboard/hooks/useEvents.js';
import { useRegistrations } from './Dashboard/hooks/useRegistrations.js';
import { useScrollAndKeyboard } from './Dashboard/hooks/useScrollAndKeyboard.js';

// Layout components
import Topbar from './Dashboard/components/Topbar.jsx';
import Sidebar from './Dashboard/components/Sidebar.jsx';
import HeroSection from './Dashboard/components/HeroSection.jsx';

// Tab views
import HomeTab from './Dashboard/views/HomeTab.jsx';
import EventsTab from './Dashboard/views/EventsTab.jsx';
import RegistrationsTab from './Dashboard/views/RegistrationsTab.jsx';
import { getStudioUrl } from '../lib/sanity.js';

import './DashBoard.css';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('home');

    // Custom hooks
    const {
        events,
        eventsLoading,
    } = useEvents();

    const { regCounts, recentRegistrations, regLoading } = useRegistrations(5);

    const openStudio = useCallback((eventId) => {
        window.open(getStudioUrl(eventId), '_blank', 'noopener,noreferrer');
    }, []);

    const { isTopbarHidden } = useScrollAndKeyboard({});

    return (
        <main className="admin-dashboard-page">
            <Topbar isHidden={isTopbarHidden} />

            <div className="admin-dashboard-shell">
                <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

                <section className="admin-dashboard-content">
                    <HeroSection />

                    {activeTab === 'home' && (
                        <HomeTab
                            events={events}
                            eventsLoading={eventsLoading}
                            regCounts={regCounts}
                            regLoading={regLoading}
                            onAddEvent={() => openStudio()}
                        />
                    )}

                    {activeTab === 'events' && (
                        <EventsTab
                            events={events}
                            eventsLoading={eventsLoading}
                            regCounts={regCounts}
                            onAddEvent={() => openStudio()}
                            onManageEvent={openStudio}
                        />
                    )}

                    {activeTab === 'registrations' && (
                        <RegistrationsTab
                            recentRegistrations={recentRegistrations}
                            regLoading={regLoading}
                        />
                    )}
                </section>
            </div>

            <Footer />
        </main>
    );
}

export default AdminDashboard;
