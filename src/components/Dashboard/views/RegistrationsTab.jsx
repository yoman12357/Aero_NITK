import React, { useEffect, useMemo, useState } from 'react';
import {
    deleteRegistration,
    formatRelativeTime,
    subscribeToEventRegistrations,
} from '../services/registrationService.js';
import './RegistrationsTab.css';

const PREFERRED_EXPORT_FIELDS = [
    'documentId',
    'name',
    'captainName',
    'email',
    'phone',
    'rollNo',
    'branch',
    'year',
    'teamName',
    'collegeName',
    'participantCount',
    'teamMembers',
    'submittedAt',
    'paymentScreenshot',
];

function timestampToIso(value) {
    if (!value) return '';
    const date = value.toDate ? value.toDate() : new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : date.toISOString();
}

function normalizeNestedValue(value) {
    if (value?.toDate) return value.toDate().toISOString();
    if (Array.isArray(value)) return value.map(normalizeNestedValue);
    if (value && typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value).map(([key, nestedValue]) => [key, normalizeNestedValue(nestedValue)])
        );
    }
    return value;
}

function valueForExport(fieldName, value) {
    if (value === null || value === undefined) return '';
    if (fieldName === 'submittedAt') return timestampToIso(value);
    if (fieldName === 'paymentScreenshot') {
        if (typeof value === 'string' && /^https?:\/\//i.test(value)) return value;
        return value ? 'Attached - view in admin dashboard' : '';
    }
    if (Array.isArray(value) || typeof value === 'object') {
        return JSON.stringify(normalizeNestedValue(value));
    }
    return String(value);
}

function escapeCsvCell(value) {
    let text = String(value ?? '');
    // Prevent spreadsheet formula injection from user-entered fields.
    if (/^[=+\-@]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
}

function downloadExcelCsv(event, registrations) {
    if (!registrations.length) return;

    const allFields = new Set(['documentId']);
    registrations.forEach((registration) => {
        Object.keys(registration).forEach((fieldName) => {
            if (!['id', 'registrationKey', 'registrationType', 'registrationLabel'].includes(fieldName)) {
                allFields.add(fieldName);
            }
        });
    });

    const headers = [
        ...PREFERRED_EXPORT_FIELDS.filter((fieldName) => allFields.has(fieldName)),
        ...[...allFields]
            .filter((fieldName) => !PREFERRED_EXPORT_FIELDS.includes(fieldName))
            .sort(),
    ];

    const csvRows = [
        headers.map(escapeCsvCell).join(','),
        ...registrations.map((registration) => (
            headers.map((fieldName) => {
                const rawValue = fieldName === 'documentId'
                    ? registration.documentId || registration.id
                    : registration[fieldName];
                return escapeCsvCell(valueForExport(fieldName, rawValue));
            }).join(',')
        )),
    ];

    const blob = new Blob([`\uFEFF${csvRows.join('\r\n')}`], {
        type: 'text/csv;charset=utf-8;',
    });
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const safeEventName = (event.title || event.registrationKey || 'event')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    anchor.href = downloadUrl;
    anchor.download = `${safeEventName || 'event'}-registrations.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(downloadUrl);
}

function RegistrationsTab({ events = [], eventsLoading, regCounts, regLoading }) {
    const [selectedEventKey, setSelectedEventKey] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [registrationsLoading, setRegistrationsLoading] = useState(false);
    const [registrationsError, setRegistrationsError] = useState('');
    const [activeScreenshot, setActiveScreenshot] = useState(null);
    const [liveCountOverrides, setLiveCountOverrides] = useState({});
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const registrationEvents = useMemo(
        () => events
            .filter((event) => event.registrationKey && event.registrationKey !== 'none')
            .sort((a, b) => (a.title || '').localeCompare(b.title || '')),
        [events]
    );

    const selectedEvent = registrationEvents.find(
        (event) => event.registrationKey === selectedEventKey
    );

    useEffect(() => {
        if (!selectedEventKey) return undefined;

        return subscribeToEventRegistrations(
            selectedEventKey,
            (nextRegistrations) => {
                setRegistrations(nextRegistrations);
                setLiveCountOverrides((currentCounts) => ({
                    ...currentCounts,
                    [selectedEventKey]: nextRegistrations.length,
                }));
                setRegistrationsLoading(false);
            },
            (error) => {
                console.error(`Registration subscription failed (${selectedEventKey}):`, error);
                setRegistrationsError('Could not load registrations for this event. Please try again.');
                setRegistrationsLoading(false);
            }
        );
    }, [selectedEventKey]);

    const handleSelectEvent = (registrationKey) => {
        setRegistrations([]);
        setRegistrationsError('');
        setRegistrationsLoading(true);
        setDeleteTarget(null);
        setSelectedEventKey(registrationKey);
    };

    const handleBackToEvents = () => {
        setSelectedEventKey(null);
        setRegistrations([]);
        setRegistrationsError('');
        setRegistrationsLoading(false);
        setActiveScreenshot(null);
        setDeleteTarget(null);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget || !selectedEventKey) return;
        setIsDeleting(true);
        try {
            const docId = deleteTarget.documentId || deleteTarget.id;
            const res = await deleteRegistration(selectedEventKey, docId);
            if (!res.success) {
                throw new Error(res.error?.message || 'Failed to delete registration');
            }
            setDeleteTarget(null);
        } catch (error) {
            console.error('Error deleting registration:', error);
            alert('Failed to delete registration. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    if (!selectedEventKey) {
        return (
            <div className="admin-dashboard-section">
                <div className="admin-dashboard-registration-heading">
                    <div>
                        <p className="admin-dashboard-registration-kicker">Registration Manager</p>
                        <h3 className="admin-dashboard-section-title">Select an Event</h3>
                        <p className="admin-dashboard-registration-subtitle">
                            Open an event to view all of its registrations and export them for Excel.
                        </p>
                    </div>
                </div>

                {eventsLoading || regLoading ? (
                    <div className="admin-dashboard-reg-loading">Loading events...</div>
                ) : registrationEvents.length === 0 ? (
                    <div className="admin-dashboard-reg-empty">
                        No events with a registration key were found.
                    </div>
                ) : (
                    <div className="admin-dashboard-registration-events">
                        {registrationEvents.map((event) => {
                            const registrationCount = liveCountOverrides[event.registrationKey]
                                ?? regCounts?.[event.registrationKey]
                                ?? 0;
                            return (
                                <button
                                    type="button"
                                    className="admin-dashboard-registration-event-card"
                                    key={event._id || event.registrationKey}
                                    onClick={() => handleSelectEvent(event.registrationKey)}
                                >
                                    <span
                                        className="admin-dashboard-registration-event-image"
                                        style={event.imageUrl ? { backgroundImage: `url(${event.imageUrl})` } : undefined}
                                        aria-hidden="true"
                                    >
                                        {!event.imageUrl ? (event.title || 'E').charAt(0).toUpperCase() : null}
                                    </span>
                                    <span className="admin-dashboard-registration-event-copy">
                                        <span className={`admin-dashboard-registration-status status-${event.status || 'none'}`}>
                                            {event.status === 'open'
                                                ? 'Open'
                                                : event.status === 'soon'
                                                    ? 'Upcoming'
                                                    : event.status === 'closed'
                                                        ? 'Closed'
                                                        : 'Event'}
                                        </span>
                                        <strong>{event.title || event.registrationKey}</strong>
                                        <small>{event.registrationKey}</small>
                                    </span>
                                    <span className="admin-dashboard-registration-event-count">
                                        <strong>{registrationCount ?? 0}</strong>
                                        <small>registrations</small>
                                    </span>
                                    <span className="admin-dashboard-registration-event-arrow" aria-hidden="true">›</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="admin-dashboard-section">
            <div className="admin-dashboard-registration-detail-header">
                <div>
                    <button
                        type="button"
                        className="admin-dashboard-registration-back"
                        onClick={handleBackToEvents}
                    >
                        ← All events
                    </button>
                    <p className="admin-dashboard-registration-kicker">Event Registrations</p>
                    <h3>{selectedEvent?.title || selectedEventKey}</h3>
                    <div className="admin-dashboard-registration-detail-meta">
                        <span className="admin-dashboard-live-indicator">Live</span>
                        <span>{registrations.length} registrations</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="admin-dashboard-export-btn"
                    onClick={() => downloadExcelCsv(selectedEvent || { registrationKey: selectedEventKey }, registrations)}
                    disabled={registrationsLoading || registrations.length === 0}
                >
                    Export for Excel
                </button>
            </div>

            {registrationsLoading ? (
                <div className="admin-dashboard-reg-loading">Loading all registrations...</div>
            ) : registrationsError ? (
                <div className="admin-dashboard-reg-empty">{registrationsError}</div>
            ) : registrations.length === 0 ? (
                <div className="admin-dashboard-reg-empty">No registrations found for this event yet.</div>
            ) : (
                <div className="admin-dashboard-reg-table-wrap">
                    <table className="admin-dashboard-reg-table">
                        <thead>
                            <tr>
                                <th>Name / Leader</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Roll No</th>
                                <th>Branch / College</th>
                                <th>Year / Team</th>
                                <th>Screenshot</th>
                                <th>Registered</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map((registration) => {
                                const displayName = registration.name || registration.captainName || '—';
                                const secondaryName = registration.teamName || '';
                                const branchOrCollege = registration.branch || registration.collegeName || '—';
                                const yearOrTeam = registration.year
                                    || (registration.participantCount
                                        ? `${registration.participantCount} participant${Number(registration.participantCount) === 1 ? '' : 's'}`
                                        : '—');

                                return (
                                    <tr key={registration.id}>
                                        <td>
                                            <strong>{displayName}</strong>
                                            {secondaryName ? <small className="admin-dashboard-reg-secondary">{secondaryName}</small> : null}
                                            {registration.teamMembers ? (
                                                <small className="admin-dashboard-reg-secondary" title={registration.teamMembers}>
                                                    Members: {registration.teamMembers}
                                                </small>
                                            ) : null}
                                        </td>
                                        <td>{registration.email || '—'}</td>
                                        <td>{registration.phone || '—'}</td>
                                        <td className="admin-dashboard-reg-mono">{registration.rollNo || '—'}</td>
                                        <td>{branchOrCollege}</td>
                                        <td>{yearOrTeam}</td>
                                        <td>
                                            {registration.paymentScreenshot ? (
                                                <button
                                                    type="button"
                                                    className="admin-dashboard-reg-view-btn"
                                                    onClick={() => setActiveScreenshot({
                                                        name: displayName,
                                                        rollNo: registration.rollNo || '',
                                                        url: registration.paymentScreenshot,
                                                    })}
                                                >
                                                    View
                                                </button>
                                            ) : (
                                                '—'
                                            )}
                                        </td>
                                        <td className="admin-dashboard-reg-time">
                                            {formatRelativeTime(registration.submittedAt)}
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="admin-dashboard-reg-delete-btn"
                                                title={`Delete registration for ${displayName}`}
                                                onClick={() => setDeleteTarget(registration)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {activeScreenshot && (
                <div
                    className="admin-dashboard-modal-backdrop"
                    onClick={() => setActiveScreenshot(null)}
                    role="presentation"
                >
                    <div
                        className="admin-dashboard-modal admin-dashboard-screenshot-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Payment screenshot - ${activeScreenshot.name}`}
                        onClick={(modalEvent) => modalEvent.stopPropagation()}
                    >
                        <div className="admin-dashboard-modal-header">
                            <div>
                                <p className="admin-dashboard-modal-kicker">Payment Proof</p>
                                <h3>{activeScreenshot.name}</h3>
                            </div>
                            <button
                                type="button"
                                className="admin-dashboard-modal-close"
                                onClick={() => setActiveScreenshot(null)}
                                aria-label="Close screenshot"
                            >
                                ×
                            </button>
                        </div>

                        <img
                            src={activeScreenshot.url}
                            alt={`Payment screenshot for ${activeScreenshot.name}`}
                            className="admin-dashboard-screenshot-image"
                        />

                        <div className="admin-dashboard-modal-actions">
                            <a
                                href={activeScreenshot.url}
                                download={`${activeScreenshot.rollNo || activeScreenshot.name.replace(/\s+/g, '_')}_payment_screenshot.jpg`}
                                className="admin-dashboard-modal-secondary admin-dashboard-screenshot-download"
                            >
                                Download
                            </a>
                            <button
                                type="button"
                                className="admin-dashboard-modal-primary"
                                onClick={() => setActiveScreenshot(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteTarget && (
                <div
                    className="admin-dashboard-modal-backdrop"
                    onClick={() => !isDeleting && setDeleteTarget(null)}
                    role="presentation"
                >
                    <div
                        className="admin-dashboard-modal"
                        style={{ maxWidth: '450px' }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-reg-modal-title"
                        onClick={(modalEvent) => modalEvent.stopPropagation()}
                    >
                        <div className="admin-dashboard-modal-header">
                            <div>
                                <p className="admin-dashboard-modal-kicker" style={{ color: '#ff6b6b' }}>Confirm Deletion</p>
                                <h3 id="delete-reg-modal-title">Delete Registration?</h3>
                            </div>
                            <button
                                type="button"
                                className="admin-dashboard-modal-close"
                                onClick={() => !isDeleting && setDeleteTarget(null)}
                                aria-label="Close modal"
                                disabled={isDeleting}
                            >
                                ×
                            </button>
                        </div>

                        <p style={{ color: 'rgba(255,255,255,0.85)', margin: '14px 0 20px', fontSize: '0.95rem', lineHeight: '1.5' }}>
                            Are you sure you want to delete the registration for{' '}
                            <strong>
                                {deleteTarget.teamName
                                    ? `${deleteTarget.teamName} (${deleteTarget.captainName || deleteTarget.name})`
                                    : (deleteTarget.name || deleteTarget.captainName || 'this registrant')}
                            </strong>?
                            This action will remove the record from Firestore.
                        </p>

                        <div className="admin-dashboard-modal-actions">
                            <button
                                type="button"
                                className="admin-dashboard-modal-secondary"
                                onClick={() => setDeleteTarget(null)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="admin-dashboard-modal-primary"
                                style={{ background: 'linear-gradient(180deg, #ff4336 0%, #b81409 100%)' }}
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RegistrationsTab;
