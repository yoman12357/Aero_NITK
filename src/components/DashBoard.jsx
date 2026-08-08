import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase.js';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import Footer from './footer.jsx';
import logoImage from '../images/Aero_NITK_logo.png';
import { statDefinitions, quickActions } from './dashboardData.js';
import {
    fetchRegistrationCounts,
    fetchRecentRegistrations,
    formatRelativeTime,
} from './Dashboard/services/registrationService.js';
import './DashBoard.css';
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

// Map known event IDs to registration collection keys for live participant counts
const EVENT_TO_REGISTRATION_KEY = {
    'skyverse-aeromodelling-workshop': 'workshop',
    'wright-flight': 'wrightFlight',
};

function AdminDashboard() {
    const [isTopbarHidden, setIsTopbarHidden] = useState(false);
    const [activeTab, setActiveTab] = useState('home');
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);
    const [editingEventId, setEditingEventId] = useState(null);
    const [events, setEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [eventImages, setEventImages] = useState({});
    const [newEventImage, setNewEventImage] = useState('');
    const [newEventForm, setNewEventForm] = useState({
        title: '',
        description: '',
        currentParticipants: 0,
        maxCapacity: 0,
        status: '',
        statusTone: 'soon',
    });

    // Registration data from Firebase
    const [regCounts, setRegCounts] = useState(null);
    const [recentRegistrations, setRecentRegistrations] = useState([]);
    const [regLoading, setRegLoading] = useState(true);

    // Fetch events + registration data on mount.
    // The `cancelled` flag prevents stale updates when React StrictMode
    // unmounts and remounts the component in development.
    useEffect(() => {
        let cancelled = false;

        const fetchEvents = async () => {
            setEventsLoading(true);
            try {
                const eventsCol = collection(db, 'events');
                const eventSnapshot = await getDocs(eventsCol);
                const eventList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                if (cancelled) return;
                setEvents(eventList);
            } catch (error) {
                console.error("Error fetching events:", error);
                if (!cancelled) setEvents([]);
            } finally {
                if (!cancelled) setEventsLoading(false);
            }
        };

        const fetchRegistrationData = async () => {
            setRegLoading(true);
            try {
                const [counts, recent] = await Promise.all([
                    fetchRegistrationCounts(),
                    fetchRecentRegistrations(5),
                ]);
                if (cancelled) return;
                setRegCounts(counts);
                setRecentRegistrations(recent);
            } catch (error) {
                console.error('Error fetching registration data:', error);
            } finally {
                if (!cancelled) setRegLoading(false);
            }
        };

        fetchEvents();
        fetchRegistrationData();

        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsTopbarHidden(window.scrollY > 40);
        };

        const handleKeyDown = (keyboardEvent) => {
            if (keyboardEvent.key === 'Escape') {
                setIsAddEventOpen(false);
            }
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        document.body.style.overflow = isAddEventOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isAddEventOpen]);

    const handleEventImageChange = (eventId, file) => {
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setEventImages((currentImages) => ({
                ...currentImages,
                [eventId]: reader.result,
            }));
        };
        reader.readAsDataURL(file);
    };

    const openAddEventModal = () => {
        setEditingEventId(null);
        setNewEventForm({
            title: '',
            description: '',
            currentParticipants: 0,
            maxCapacity: 0,
            status: '',
            statusTone: 'soon',
        });
        setNewEventImage('');
        setIsAddEventOpen(true);
    };

    const openEditEventModal = (eventId) => {
        const eventToEdit = events.find((event) => event.id === eventId);
        if (!eventToEdit) {
            return;
        }

        // Parse legacy string if needed
        let currentPart = eventToEdit.currentParticipants || 0;
        let maxCap = eventToEdit.maxCapacity || 0;
        if (eventToEdit.participants && !eventToEdit.maxCapacity && !eventToEdit.currentParticipants) {
            const parts = String(eventToEdit.participants).split('/');
            currentPart = parseInt(parts[0], 10) || 0;
            if (parts[1]) maxCap = parseInt(parts[1], 10) || 0;
        }

        setEditingEventId(eventId);
        setNewEventForm({
            title: eventToEdit.title,
            description: eventToEdit.description,
            currentParticipants: currentPart,
            maxCapacity: maxCap,
            status: eventToEdit.status,
            statusTone: eventToEdit.statusTone,
        });
        setNewEventImage(eventImages[eventId] || '');
        setIsAddEventOpen(true);
    };

    const handleNewEventImageChange = (file) => {
        if (!file) {
            setNewEventImage('');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setNewEventImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const closeAddEventModal = () => {
        setIsAddEventOpen(false);
        setEditingEventId(null);
        setNewEventForm({
            title: '',
            description: '',
            currentParticipants: 0,
            maxCapacity: 0,
            status: '',
            statusTone: 'soon',
        });
        setNewEventImage('');
    };

    const handleCreateEvent = async (formEvent) => {
        formEvent.preventDefault();

        const title = newEventForm.title.trim();
        if (!title) {
            return;
        }

        const idBase = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const newEventId = idBase || `event-${Date.now()}`;

        const createdEvent = {
            id: newEventId,
            title,
            description: newEventForm.description.trim() || 'New event created from the dashboard.',
            currentParticipants: Number(newEventForm.currentParticipants) || 0,
            maxCapacity: Number(newEventForm.maxCapacity) || 0,
            status: newEventForm.status.trim(),
            statusTone: newEventForm.status.trim() ? newEventForm.statusTone : 'none',
        };

        try {
            if (editingEventId) {
                await setDoc(doc(db, 'events', editingEventId), createdEvent, { merge: true });
                setEvents((currentEvents) => currentEvents.map((event) => (event.id === editingEventId ? { ...event, ...createdEvent, id: editingEventId } : event)));
                setEventImages((currentImages) => {
                    const nextImages = { ...currentImages };
                    if (newEventImage) {
                        nextImages[editingEventId] = newEventImage;
                    }
                    return nextImages;
                });
            } else {
                await setDoc(doc(db, 'events', newEventId), createdEvent);
                setEvents((currentEvents) => [createdEvent, ...currentEvents]);

                if (newEventImage) {
                    setEventImages((currentImages) => ({
                        ...currentImages,
                        [newEventId]: newEventImage,
                    }));
                }
            }
        } catch (error) {
            console.error("Error saving event:", error);
        }

        closeAddEventModal();
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            await deleteDoc(doc(db, 'events', eventId));
            setEvents((currentEvents) => currentEvents.filter((event) => event.id !== eventId));
            setEventImages((currentImages) => {
                const nextImages = { ...currentImages };
                delete nextImages[eventId];
                return nextImages;
            });

            if (editingEventId === eventId) {
                closeAddEventModal();
            }
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    return (
        <main className="admin-dashboard-page">
            <header className={`admin-dashboard-topbar ${isTopbarHidden ? 'is-hidden' : ''}`}>
                <button className="admin-dashboard-back" type="button" aria-label="Go back">
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

            <div className="admin-dashboard-shell">
                <aside className="admin-dashboard-sidebar">
                    <div className="admin-dashboard-brand">
                        <img src={logoImage} alt="AeroNITK logo" />
                        <span>AERONITK</span>
                    </div>

                    <nav className="admin-dashboard-nav" aria-label="Admin sections">
                        <button type="button" className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}><span className="nav-icon">⌂</span>Home</button>
                        <button type="button" className={activeTab === 'events' ? 'active' : ''} onClick={() => setActiveTab('events')}><span className="nav-icon">▣</span>Events</button>
                        <button type="button" className={activeTab === 'registrations' ? 'active' : ''} onClick={() => setActiveTab('registrations')}><span className="nav-icon">▤</span>Registrations</button>
                        <button type="button" className={activeTab === 'participants' ? 'active' : ''} onClick={() => setActiveTab('participants')}><span className="nav-icon">👥</span>Participants</button>
                        <button type="button" className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}><span className="nav-icon">⚙</span>Settings</button>
                    </nav>

                    <Link
                        to="/login"
                        className="admin-dashboard-logout"
                        onClick={() => auth.signOut()}
                    >
                        <span className="nav-icon logout-icon">↩</span>
                        LOG OUT
                    </Link>
                </aside>

                <section className="admin-dashboard-content">
                    <div className="admin-dashboard-hero">
                        <p>Welcome back,</p>
                        <h2>ADMIN 👋</h2>
                        <span>Here&apos;s what&apos;s happening with your events.</span>
                    </div>

                    {activeTab === 'home' && (
                        <>
                            <div className="admin-dashboard-stats">
                                {statDefinitions.map((item) => {
                                    let value;
                                    if (item.key === 'activeEvents') {
                                        value = eventsLoading ? '—' : String(events.filter(e => e.statusTone === 'open').length);
                                    } else {
                                        value = regLoading
                                            ? '—'
                                            : regCounts
                                                ? String(regCounts[item.key] ?? 0)
                                                : '—';
                                    }

                                    return (
                                        <article key={item.key} className={`admin-dashboard-stat-card tone-${item.tone}`}>
                                            <Icon type={item.icon} />
                                            <strong className={regLoading && item.key !== 'activeEvents' || eventsLoading && item.key === 'activeEvents' ? 'admin-dashboard-loading-value' : ''}>{value}</strong>
                                            <span>{item.label}</span>
                                        </article>
                                    );
                                })}
                            </div>

                            <div className="admin-dashboard-quick-actions">
                                <h3>Quick Actions</h3>
                                <div className="admin-dashboard-actions-grid">
                                    <button type="button" className="admin-dashboard-action-card admin-dashboard-action-button tone-green" onClick={openAddEventModal}>
                                        <Icon type="plus" />
                                        <h4>{quickActions[0].title}</h4>
                                        <p>{quickActions[0].description}</p>
                                    </button>

                                    {quickActions.slice(1).map((action) => (
                                        <article key={action.title} className={`admin-dashboard-action-card tone-${action.tone}`}>
                                            <Icon type={action.icon === 'users' ? 'users-action' : action.icon} />
                                            <h4>{action.title}</h4>
                                            <p>{action.description}</p>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* ═══ EVENTS SECTION ═══ */}
                    {activeTab === 'events' && (
                        <div className="admin-dashboard-section">
                            <div className="admin-dashboard-section-header">
                                <h3 className="admin-dashboard-section-title">All Events</h3>
                                <button type="button" className="admin-dashboard-add-btn" onClick={openAddEventModal}>
                                    + Add Event
                                </button>
                            </div>

                            {eventsLoading ? (
                                <div className="admin-dashboard-reg-loading">Loading events…</div>
                            ) : events.length === 0 ? (
                                <div className="admin-dashboard-reg-empty">No events found. Add one below!</div>
                            ) : (
                                <div className="admin-dashboard-events">
                                    {events.map((event, index) => {
                                        // Inject live participant count for events that match a registration type
                                        const regKey = EVENT_TO_REGISTRATION_KEY[event.id];
                                        
                                        // Parse legacy string if needed
                                        let baseCount = event.currentParticipants || 0;
                                        let maxCap = event.maxCapacity || 0;
                                        if (event.participants && !event.maxCapacity && !event.currentParticipants) {
                                            const parts = String(event.participants).split('/');
                                            baseCount = parseInt(parts[0], 10) || 0;
                                            if (parts[1]) maxCap = parseInt(parts[1], 10) || 0;
                                        }

                                        const actualCount = regKey && regCounts && regCounts[regKey] !== undefined 
                                            ? regCounts[regKey] 
                                            : baseCount;
                                            
                                        const displayParticipants = maxCap > 0 
                                            ? `${actualCount}/${maxCap}` 
                                            : `${actualCount}`;

                                        return (
                                            <article key={event.id} className="admin-dashboard-event-card">
                                                <div
                                                    className={`admin-dashboard-event-thumb thumb-${(index % 3) + 1} ${eventImages[event.id] ? 'has-image' : ''}`}
                                                    style={eventImages[event.id] ? { backgroundImage: `url(${eventImages[event.id]})` } : undefined}
                                                >
                                                    <label className="admin-dashboard-image-upload">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(changeEvent) => handleEventImageChange(event.id, changeEvent.target.files?.[0])}
                                                        />
                                                        <span>{eventImages[event.id] ? 'Change Image' : 'Add Image'}</span>
                                                    </label>
                                                </div>
                                                <div className="admin-dashboard-event-copy">
                                                    {event.status ? <span className={`admin-dashboard-status status-${event.statusTone}`}>{event.status}</span> : null}
                                                    <h3>{event.title}</h3>
                                                    <p>{event.description}</p>
                                                </div>
                                                <div className="admin-dashboard-event-meta">
                                                    <strong>{displayParticipants}</strong>
                                                    <span>Participants</span>
                                                </div>
                                                <div className="admin-dashboard-event-actions">
                                                    <button type="button" aria-label="Edit event" onClick={() => openEditEventModal(event.id)}>
                                                        <svg viewBox="0 0 24 24"><path d="M4 20h4l10-10-4-4L4 16v4Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M13 7l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                                                    </button>
                                                    <button type="button" aria-label="Delete event" className="danger" onClick={() => handleDeleteEvent(event.id)}>
                                                        <svg viewBox="0 0 24 24"><path d="M5 7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M7 7l1 13h8l1-13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
                                                    </button>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ═══ REGISTRATIONS SECTION ═══ */}
                    {activeTab === 'registrations' && (
                        <div className="admin-dashboard-section">
                            <h3 className="admin-dashboard-section-title">All Registrations</h3>

                            {regLoading ? (
                                <div className="admin-dashboard-reg-loading">Loading registrations…</div>
                            ) : recentRegistrations.length === 0 ? (
                                <div className="admin-dashboard-reg-empty">No registrations found yet.</div>
                            ) : (
                                <div className="admin-dashboard-reg-table-wrap">
                                    <table className="admin-dashboard-reg-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Event</th>
                                                <th>Branch</th>
                                                <th>Roll No</th>
                                                <th>Registered</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentRegistrations.map((reg) => (
                                                <tr key={reg.id}>
                                                    <td>{reg.name || '—'}</td>
                                                    <td>
                                                        <span className={`admin-dashboard-reg-badge ${reg.registrationType === 'workshop' ? 'badge-workshop' : 'badge-wright'}`}>
                                                            {reg.registrationLabel || '—'}
                                                        </span>
                                                    </td>
                                                    <td>{reg.branch || '—'}</td>
                                                    <td className="admin-dashboard-reg-mono">{reg.rollNo || '—'}</td>
                                                    <td className="admin-dashboard-reg-time">{formatRelativeTime(reg.submittedAt)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>

            {isAddEventOpen ? (
                <div className="admin-dashboard-modal-backdrop" onClick={closeAddEventModal} role="presentation">
                    <div className="admin-dashboard-modal" role="dialog" aria-modal="true" aria-labelledby="add-event-title" onClick={(modalEvent) => modalEvent.stopPropagation()}>
                        <div className="admin-dashboard-modal-header">
                            <div>
                                <p className="admin-dashboard-modal-kicker">Quick Action</p>
                                <h3 id="add-event-title">{editingEventId ? 'Edit Event' : 'Add New Event'}</h3>
                            </div>
                            <button type="button" className="admin-dashboard-modal-close" onClick={closeAddEventModal} aria-label="Close add event form">
                                ×
                            </button>
                        </div>

                        <form className="admin-dashboard-modal-form" onSubmit={handleCreateEvent}>
                            <div className="admin-dashboard-modal-image">
                                <div className="admin-dashboard-modal-preview" style={newEventImage ? { backgroundImage: `url(${newEventImage})` } : undefined}>
                                    {!newEventImage ? <span>No image selected</span> : null}
                                </div>
                                <label className="admin-dashboard-modal-upload">
                                    <input type="file" accept="image/*" onChange={(changeEvent) => handleNewEventImageChange(changeEvent.target.files?.[0])} />
                                    <span>Choose Event Image</span>
                                </label>
                            </div>

                            <label className="admin-dashboard-modal-field">
                                <span>Event Title</span>
                                <input
                                    type="text"
                                    value={newEventForm.title}
                                    onChange={(changeEvent) => setNewEventForm((currentForm) => ({ ...currentForm, title: changeEvent.target.value }))}
                                    placeholder="Enter event name"
                                    required
                                />
                            </label>

                            <label className="admin-dashboard-modal-field">
                                <span>Description</span>
                                <textarea
                                    rows="4"
                                    value={newEventForm.description}
                                    onChange={(changeEvent) => setNewEventForm((currentForm) => ({ ...currentForm, description: changeEvent.target.value }))}
                                    placeholder="Add a short description"
                                    required
                                />
                            </label>

                            <div className="admin-dashboard-modal-row">
                                <label className="admin-dashboard-modal-field">
                                    <span>Current Participants (Manual)</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={newEventForm.currentParticipants}
                                        onChange={(changeEvent) => setNewEventForm((currentForm) => ({ ...currentForm, currentParticipants: changeEvent.target.value }))}
                                        placeholder="0"
                                    />
                                </label>
                                
                                <label className="admin-dashboard-modal-field">
                                    <span>Max Capacity</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={newEventForm.maxCapacity}
                                        onChange={(changeEvent) => setNewEventForm((currentForm) => ({ ...currentForm, maxCapacity: changeEvent.target.value }))}
                                        placeholder="e.g. 50"
                                    />
                                </label>
                            </div>

                            <div className="admin-dashboard-modal-row">
                                <label className="admin-dashboard-modal-field" style={{ gridColumn: "1 / -1" }}>
                                    <span>Event Status</span>
                                    <select
                                        value={newEventForm.statusTone}
                                        onChange={(changeEvent) => {
                                            const tone = changeEvent.target.value;
                                            const statusMap = {
                                                'open': 'OPEN',
                                                'closed': 'CLOSED',
                                                'soon': 'OPENS SOON',
                                                'none': ''
                                            };
                                            setNewEventForm((currentForm) => ({ 
                                                ...currentForm, 
                                                statusTone: tone,
                                                status: statusMap[tone]
                                            }));
                                        }}
                                    >
                                        <option value="none">Hidden (No Status)</option>
                                        <option value="open">Open (Green Badge)</option>
                                        <option value="closed">Closed (Red Badge)</option>
                                        <option value="soon">Opens Soon (Orange Badge)</option>
                                    </select>
                                </label>
                            </div>

                            <div className="admin-dashboard-modal-actions">
                                <button type="button" className="admin-dashboard-modal-secondary" onClick={closeAddEventModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="admin-dashboard-modal-primary">
                                    {editingEventId ? 'Save Changes' : 'Create Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}

            <Footer />
        </main>
    );
}

export default AdminDashboard;