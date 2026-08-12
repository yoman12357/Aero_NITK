import React, { useCallback } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
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
import GalleryEditorModal from './Dashboard/components/GalleryEditorModal.jsx';

// Tab views
import HomeTab from './Dashboard/views/HomeTab.jsx';
import EventsTab from './Dashboard/views/EventsTab.jsx';
import RegistrationsTab from './Dashboard/views/RegistrationsTab.jsx';
import { getStudioUrl } from '../lib/sanity.js';
import GalleryTab from './Dashboard/views/GalleryTab.jsx';
import GalleryFolderPage from './Dashboard/views/GalleryFolderPage.jsx';

import { useGallery } from './Dashboard/hooks/useGallery.js';

import './DashBoard.css';

function SectionPlaceholder({ title, description }) {
    return (
        <div className="admin-dashboard-section admin-dashboard-placeholder">
            <h3 className="admin-dashboard-section-title">{title}</h3>
            <div className="admin-dashboard-reg-empty">{description}</div>
        </div>
    );
}

function AdminDashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const activeTab = location.pathname.split('/')[2] || 'home';

    // Custom hooks
    const {
        events,
        eventsLoading,
    } = useEvents();

    const { regCounts, recentRegistrations, regLoading } = useRegistrations(5);
    const {
        folders,
        activeFolderId,
        editingFolderId,
        folderForm,
        folderCoverPreview,
        isFolderEditorOpen,
        openNewFolderForm,
        openEditFolderForm,
        closeFolderForm,
        handleFolderFormChange,
        handleFolderCoverChange,
        handleSaveFolder,
        handleDeleteFolder,
        handleSelectFolder,
        handleUploadImages,
        handleDeleteImage,
        handleSetFolderCover,
    } = useGallery();

    const openStudio = useCallback((eventId) => {
        window.open(getStudioUrl(eventId), '_blank', 'noopener,noreferrer');
    }, []);

    const { isTopbarHidden } = useScrollAndKeyboard({});
    const { isTopbarHidden } = useScrollAndKeyboard({ onEscape });

    const handleTabChange = useCallback((tab) => {
        navigate(`/dashboard/${tab}`);
    }, [navigate]);

    const handleOpenFolder = useCallback((targetFolderId) => {
        handleSelectFolder(targetFolderId);
        navigate(`/dashboard/gallery/${targetFolderId}`);
    }, [handleSelectFolder, navigate]);

    const handleBackToGallery = useCallback(() => {
        navigate('/dashboard/gallery');
    }, [navigate]);

    return (
        <main className="admin-dashboard-page">
            <Topbar isHidden={isTopbarHidden} />

            <div className="admin-dashboard-shell">
                <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

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
                    <Routes>
                        <Route
                            path="home"
                            element={(
                                <HomeTab
                                    events={events}
                                    eventsLoading={eventsLoading}
                                    regCounts={regCounts}
                                    regLoading={regLoading}
                                    onAddEvent={openAddEventModal}
                                />
                            )}
                        />
                        <Route
                            path="events"
                            element={(
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
                        />
                        <Route
                            path="registrations"
                            element={(
                                <RegistrationsTab
                                    recentRegistrations={recentRegistrations}
                                    regLoading={regLoading}
                                />
                            )}
                        />
                        <Route
                            path="gallery"
                            element={(
                                <GalleryTab
                                    folders={folders}
                                    activeFolderId={activeFolderId}
                                    editingFolderId={editingFolderId}
                                    folderForm={folderForm}
                                    folderCoverPreview={folderCoverPreview}
                                    onAddFolder={openNewFolderForm}
                                    onOpenFolder={handleOpenFolder}
                                    onEditFolder={openEditFolderForm}
                                />
                            )}
                        />
                        <Route
                            path="gallery/:folderId"
                            element={(
                                <GalleryFolderPage
                                    folders={folders}
                                    onBack={handleBackToGallery}
                                    onEditFolder={openEditFolderForm}
                                    onDeleteFolder={handleDeleteFolder}
                                    onUploadImages={handleUploadImages}
                                    onDeleteImage={handleDeleteImage}
                                    onSetFolderCover={handleSetFolderCover}
                                />
                            )}
                        />
                        <Route
                            path="participants"
                            element={(
                                <SectionPlaceholder
                                    title="Participants"
                                    description="This section is reserved for future participant management tools."
                                />
                            )}
                        />
                        <Route
                            path="settings"
                            element={(
                                <SectionPlaceholder
                                    title="Settings"
                                    description="This section is reserved for future dashboard settings."
                                />
                            )}
                        />
                        <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
                    </Routes>
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

            <GalleryEditorModal
                isOpen={isFolderEditorOpen}
                editingFolderId={editingFolderId}
                folderForm={folderForm}
                folderCoverPreview={folderCoverPreview}
                onFolderFormChange={handleFolderFormChange}
                onFolderCoverChange={handleFolderCoverChange}
                onSubmit={handleSaveFolder}
                onClose={closeFolderForm}
            />

            <Footer />
        </main>
    );
}

export default AdminDashboard;
