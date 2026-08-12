import React, { useState } from 'react';
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

// Firebase auth import (adjust path if your firebase config resides elsewhere)
import { auth } from '../firebase';

import './DashBoard.css';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('home');

    // Modal & Form States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEventId, setEditingEventId] = useState(null);
    const [form, setForm] = useState({
        title: '',
        description: '',
        currentParticipants: 0,
        maxCapacity: '',
        registrationKey: 'none',
        startDate: '',
        status: 'soon'
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Custom hooks
    const {
        events,
        eventsLoading,
    } = useEvents();

    const { regCounts, recentRegistrations, regLoading } = useRegistrations(5);

    // Open modal to add a new event
    const handleOpenAdd = () => {
        setEditingEventId(null);
        setForm({
            title: '',
            description: '',
            currentParticipants: 0,
            maxCapacity: '',
            registrationKey: 'none',
            startDate: '',
            status: 'soon'
        });
        setImageFile(null);
        setImagePreview(null);
        setIsModalOpen(true);
    };

    // Open modal to edit an existing event
    const handleOpenEdit = (event) => {
        setEditingEventId(event._id);
        setForm({
            title: event.title || '',
            description: event.description || '',
            currentParticipants: event.manualParticipantCount || 0,
            maxCapacity: event.maxCapacity || '',
            registrationKey: event.registrationKey || 'none',
            startDate: event.startDate ? event.startDate.substring(0, 16) : '',
            status: event.status || 'soon'
        });
        setImageFile(null);
        setImagePreview(event.imageUrl || null);
        setIsModalOpen(true);
    };

    // Handle image file selection
    const handleImageChange = (file) => {
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Submit form to your backend server in the background
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            let token = '';
            if (auth && auth.currentUser) {
                token = await auth.currentUser.getIdToken();
            }

            const formData = new FormData();
            if (editingEventId) {
                formData.append('eventId', editingEventId);
            }
            formData.append('title', form.title);
            formData.append('description', form.description);
            formData.append('registrationKey', form.registrationKey);
            formData.append('manualParticipantCount', form.currentParticipants);
            if (form.maxCapacity) formData.append('maxCapacity', form.maxCapacity);
            formData.append('status', form.status);
            if (form.startDate) formData.append('startDate', form.startDate);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

            const response = await fetch(`${backendUrl}/api/save-event`, {
                method: 'POST',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: formData
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Failed to save event');
            }

            alert('Event saved successfully in the background!');
            setIsModalOpen(false);
            window.location.reload(); // Refresh to show updated events
        } catch (error) {
            console.error('Error saving event:', error);
            alert(error.message || 'Error saving event');
        }
    };

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
                            onAddEvent={handleOpenAdd}
                        />
                    )}

                    {activeTab === 'events' && (
                        <EventsTab
                            events={events}
                            eventsLoading={eventsLoading}
                            regCounts={regCounts}
                            onAddEvent={handleOpenAdd}
                            onManageEvent={handleOpenEdit}
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

            {/* Local Modal Form */}
            <EventFormModal
                isOpen={isModalOpen}
                editingEventId={editingEventId}
                form={form}
                image={imagePreview}
                onFormChange={setForm}
                onImageChange={handleImageChange}
                onSubmit={handleFormSubmit}
                onClose={() => setIsModalOpen(false)}
            />

            <Footer />
        </main>
    );
}

export default AdminDashboard;