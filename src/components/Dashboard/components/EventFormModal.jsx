import React, { useEffect, useRef } from 'react';

// Turns "Aero Modelling Workshop 2026" into "aeroModellingWorkshop2026" —
// a safe key to use both as the /register/:registrationKey route and as
// the Firestore collection name (`${key}_registrations`).
function slugifyToKey(title) {
    return (title || '')
        .trim()
        .split(/\s+/)
        .map((word, idx) => {
            const clean = word.replace(/[^a-zA-Z0-9]/g, '');
            if (!clean) return '';
            return idx === 0
                ? clean.charAt(0).toLowerCase() + clean.slice(1)
                : clean.charAt(0).toUpperCase() + clean.slice(1);
        })
        .join('');
}

/**
 * Modal dialog for adding or editing an event.
 * Manages body overflow lock via its own useEffect.
 */
function EventFormModal({ isOpen, editingEventId, form, image, onFormChange, onImageChange, onSubmit, onClose }) {
    // Lock body scroll while modal is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Only auto-fill the key from the title while the admin hasn't typed
    // their own key yet — once they touch the field directly, stop overwriting it.
    // Re-evaluated every time the modal opens (not just on first mount), since
    // the component stays mounted between opens.
    const keyManuallyEdited = useRef(Boolean(form.registrationKey && form.registrationKey !== 'none'));

    useEffect(() => {
        if (isOpen) {
            keyManuallyEdited.current = Boolean(form.registrationKey && form.registrationKey !== 'none');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    if (!isOpen) return null;

    const handleTitleChange = (value) => {
        onFormChange((currentForm) => {
            const next = { ...currentForm, title: value };
            if (!keyManuallyEdited.current) {
                next.registrationKey = slugifyToKey(value);
            }
            return next;
        });
    };

    const handleKeyChange = (value) => {
        keyManuallyEdited.current = true;
        // Keep it URL/collection-name safe: letters and numbers only.
        const cleaned = value.replace(/[^a-zA-Z0-9]/g, '');
        onFormChange((currentForm) => ({ ...currentForm, registrationKey: cleaned }));
    };

    return (
        <div className="admin-dashboard-modal-backdrop" onClick={onClose} role="presentation">
            <div className="admin-dashboard-modal" role="dialog" aria-modal="true" aria-labelledby="add-event-title" onClick={(modalEvent) => modalEvent.stopPropagation()}>
                <div className="admin-dashboard-modal-header">
                    <div>
                        <p className="admin-dashboard-modal-kicker">Quick Action</p>
                        <h3 id="add-event-title">{editingEventId ? 'Edit Event' : 'Add New Event'}</h3>
                    </div>
                    <button type="button" className="admin-dashboard-modal-close" onClick={onClose} aria-label="Close add event form">
                        ×
                    </button>
                </div>

                <form className="admin-dashboard-modal-form" onSubmit={onSubmit}>
                    <div className="admin-dashboard-modal-image">
                        <div className="admin-dashboard-modal-preview" style={image ? { backgroundImage: `url(${image})` } : undefined}>
                            {!image ? <span>No image selected</span> : null}
                        </div>
                        <label className="admin-dashboard-modal-upload">
                            <input type="file" accept="image/*" onChange={(changeEvent) => onImageChange(changeEvent.target.files?.[0])} />
                            <span>Choose Event Image</span>
                        </label>
                    </div>

                    <label className="admin-dashboard-modal-field">
                        <span>Event Title</span>
                        <input
                            type="text"
                            value={form.title || ''}
                            onChange={(changeEvent) => handleTitleChange(changeEvent.target.value)}
                            placeholder="Enter event name"
                            required
                        />
                    </label>

                    <label className="admin-dashboard-modal-field">
                        <span>Description</span>
                        <textarea
                            rows="4"
                            value={form.description || ''}
                            onChange={(changeEvent) => onFormChange((currentForm) => ({ ...currentForm, description: changeEvent.target.value }))}
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
                                value={form.currentParticipants ?? form.manualParticipantCount ?? 0}
                                onChange={(changeEvent) => onFormChange((currentForm) => ({ ...currentForm, currentParticipants: changeEvent.target.value }))}
                                placeholder="0"
                            />
                        </label>

                        <label className="admin-dashboard-modal-field">
                            <span>Max Capacity</span>
                            <input
                                type="number"
                                min="0"
                                value={form.maxCapacity || ''}
                                onChange={(changeEvent) => onFormChange((currentForm) => ({ ...currentForm, maxCapacity: changeEvent.target.value }))}
                                placeholder="e.g. 50"
                            />
                        </label>
                    </div>

                    <div className="admin-dashboard-modal-row">
                        <label className="admin-dashboard-modal-field">
                            <span>Registration Key</span>
                            <input
                                type="text"
                                value={form.registrationKey && form.registrationKey !== 'none' ? form.registrationKey : ''}
                                onChange={(changeEvent) => handleKeyChange(changeEvent.target.value)}
                                placeholder="auto-filled from title, e.g. aeroModellingWorkshop2026"
                            />
                            <small style={{ display: 'block', marginTop: '4px', color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem' }}>
                                Leave blank for no live registration form. This becomes the registration link
                                (/register/{form.registrationKey || '...'}) and its own Firestore collection —
                                no code changes needed per event.
                            </small>
                        </label>

                        <label className="admin-dashboard-modal-field">
                            <span>Start Date & Time</span>
                            <input
                                type="datetime-local"
                                value={form.startDate || ''}
                                onChange={(changeEvent) => onFormChange((currentForm) => ({ ...currentForm, startDate: changeEvent.target.value }))}
                            />
                        </label>
                    </div>

                    <div className="admin-dashboard-modal-row">
                        <label className="admin-dashboard-modal-field" style={{ gridColumn: "1 / -1" }}>
                            <span>Event Status</span>
                            <select
                                value={form.statusTone || form.status || 'soon'}
                                onChange={(changeEvent) => {
                                    const tone = changeEvent.target.value;
                                    const statusMap = {
                                        'open': 'open',
                                        'closed': 'closed',
                                        'soon': 'soon',
                                        'none': 'none'
                                    };
                                    onFormChange((currentForm) => ({
                                        ...currentForm,
                                        statusTone: tone,
                                        status: statusMap[tone]
                                    }));
                                }}
                            >
                                <option value="none">Hidden (No Badge)</option>
                                <option value="open">Open (Green Badge)</option>
                                <option value="closed">Closed (Red Badge)</option>
                                <option value="soon">Opens Soon (Orange Badge)</option>
                            </select>
                        </label>
                    </div>

                    <div className="admin-dashboard-modal-actions">
                        <button type="button" className="admin-dashboard-modal-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="admin-dashboard-modal-primary">
                            {editingEventId ? 'Save Changes' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EventFormModal;
