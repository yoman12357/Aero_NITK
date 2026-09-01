import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaLinkedin, FaTimes } from 'react-icons/fa';

function AlumniModal({
    isOpen,
    onClose,
    onSubmit,
    editingMember = null,
    defaultBatch = '',
    availableBatches = ['2025', '2024']
}) {
    const [name, setName] = useState('');
    const [batch, setBatch] = useState(defaultBatch || '2025');
    const [role, setRole] = useState('');
    const [company, setCompany] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        if (editingMember) {
            setName(editingMember.name || '');
            setBatch(editingMember.batch || defaultBatch || '2025');
            setRole(editingMember.role || '');
            setCompany(editingMember.company || '');
            setLinkedin(editingMember.linkedin || '');
            setImagePreview(editingMember.image || null);
        } else {
            setName('');
            setBatch(defaultBatch || availableBatches[0] || '2025');
            setRole('');
            setCompany('');
            setLinkedin('');
            setImagePreview(null);
        }
        setImageError(false);
    }, [editingMember, isOpen, defaultBatch, availableBatches]);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
                setImageError(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        onSubmit({
            id: editingMember?.id,
            name: name.trim(),
            batch: (editingMember?.batch || defaultBatch || batch).trim(),
            role: role.trim(),
            company: company.trim(),
            linkedin: linkedin.trim(),
            image: imagePreview
        });

        onClose();
    };

    return (
        <div className="admin-dashboard-modal-backdrop" onClick={onClose}>
            <div
                className="admin-dashboard-modal"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <div className="admin-dashboard-modal-header">
                    <div>
                        <p className="admin-dashboard-modal-kicker">
                            {defaultBatch ? `Batch ${defaultBatch} Alumni` : 'Alumni Network'}
                        </p>
                        <h3>{editingMember ? 'Edit Alumni Member' : 'Add Alumni Member'}</h3>
                    </div>
                    <button
                        type="button"
                        className="admin-dashboard-modal-close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <FaTimes />
                    </button>
                </div>

                <form className="admin-dashboard-modal-form" onSubmit={handleSubmit}>
                    {/* Photo Upload & Preview */}
                    <div className="admin-dashboard-modal-field">
                        <span>Profile Photo</span>
                        <div className="admin-dashboard-alumni-upload-row">
                            <div className="admin-dashboard-alumni-avatar-preview">
                                {imagePreview && !imageError ? (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        onError={() => setImageError(true)}
                                    />
                                ) : (
                                    <FaUserCircle className="admin-dashboard-alumni-placeholder-icon" />
                                )}
                            </div>
                            <label className="admin-dashboard-modal-upload">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                                <span>{imagePreview ? 'Change Photo' : 'Upload Photo'}</span>
                            </label>
                            {imagePreview && (
                                <button
                                    type="button"
                                    className="admin-dashboard-alumni-remove-photo"
                                    onClick={() => {
                                        setImagePreview(null);
                                        setImageError(false);
                                    }}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Name */}
                    <label className="admin-dashboard-modal-field">
                        <span>Full Name *</span>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Ojas Agrawal"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>

                    {/* Batch Selection (only if not in a specific folder) */}
                    {!defaultBatch && (
                        <label className="admin-dashboard-modal-field">
                            <span>Graduation Batch *</span>
                            <select value={batch} onChange={(e) => setBatch(e.target.value)}>
                                {availableBatches.map((b) => (
                                    <option key={b} value={b}>
                                        Batch {b}
                                    </option>
                                ))}
                            </select>
                        </label>
                    )}

                    {/* LinkedIn URL */}
                    <label className="admin-dashboard-modal-field">
                        <span>
                            <FaLinkedin style={{ color: '#0a66c2', marginRight: '6px', verticalAlign: '-2px' }} />
                            LinkedIn Profile URL
                        </span>
                        <input
                            type="url"
                            placeholder="https://linkedin.com/in/username"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                        />
                    </label>

                    {/* Role / Subsystem (Optional) */}
                    <label className="admin-dashboard-modal-field">
                        <span>Club Role / Subsystem (Optional)</span>
                        <input
                            type="text"
                            placeholder="e.g. Aerodynamics Subsystem Lead"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        />
                    </label>

                    {/* Actions */}
                    <div className="admin-dashboard-modal-actions">
                        <button
                            type="button"
                            className="admin-dashboard-modal-secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="admin-dashboard-modal-primary"
                        >
                            {editingMember ? 'Save Changes' : 'Add Member'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AlumniModal;
