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
import EventFormModal from './Dashboard/components/EventFormModal.jsx';

// Tab views
import HomeTab from './Dashboard/views/HomeTab.jsx';
import EventsTab from './Dashboard/views/EventsTab.jsx';
import RegistrationsTab from './Dashboard/views/RegistrationsTab.jsx';

import './DashBoard.css';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('home');

    // Custom hooks
    const {
        events,
        eventsLoading,
        eventImages,
        isAddEventOpen,
        editingEventId,
        newEventForm,
        newEventImage,
        openAddEventModal,
        openEditEventModal,
        closeAddEventModal,
        handleCreateEvent,
        handleDeleteEvent,
        handleEventImageChange,
        handleNewEventImageChange,
        setNewEventForm,
    } = useEvents();

    const { regCounts, recentRegistrations, regLoading } = useRegistrations(5);

    const onEscape = useCallback(() => {
        closeAddEventModal();
    }, [closeAddEventModal]);

    const { isTopbarHidden } = useScrollAndKeyboard({ onEscape });

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
                            onAddEvent={openAddEventModal}
                        />
                    )}

                    {activeTab === 'events' && (
                        <EventsTab
                            events={events}
                            eventsLoading={eventsLoading}
                            eventImages={eventImages}
                            regCounts={regCounts}
                            onAddEvent={openAddEventModal}
                            onEditEvent={openEditEventModal}
                            onDeleteEvent={handleDeleteEvent}
                            onImageChange={handleEventImageChange}
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

            <EventFormModal
                isOpen={isAddEventOpen}
                editingEventId={editingEventId}
                form={newEventForm}
                image={newEventImage}
                onFormChange={setNewEventForm}
                onImageChange={handleNewEventImageChange}
                onSubmit={handleCreateEvent}
                onClose={closeAddEventModal}
            />

            <Footer />
        </main>
    );
}

export default AdminDashboard;