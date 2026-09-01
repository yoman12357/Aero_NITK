import React, { useState, useEffect } from 'react';
import { FaTimes, FaFolder, FaImage } from 'react-icons/fa';

function BatchFolderModal({
    isOpen,
    onClose,
    onSubmit,
    editingBatch = null
}) {
    const [year, setYear] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [coverPreview, setCoverPreview] = useState(null);
    const [coverError, setCoverError] = useState(false);

    useEffect(() => {
        if (editingBatch) {
            setYear(editingBatch.year || editingBatch.id || '');
            setName(editingBatch.name || '');
            setDescription(editingBatch.description || '');
            setCoverPreview(editingBatch.cover || null);
        } else {
            setYear('');
            setName('');
            setDescription('');
            setCoverPreview(null);
        }
        setCoverError(false);
    }, [editingBatch, isOpen]);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setCoverPreview(reader.result);
                setCoverError(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleYearChange = (e) => {
        const val = e.target.value;
        setYear(val);
        if (!editingBatch) {
            setName(val ? `Batch ${val}` : '');
            setDescription(val ? `AeroNITK Graduating Class of ${val}` : '');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!year.trim()) return;

        onSubmit({
            id: editingBatch?.id || year.trim(),
            year: year.trim(),
            name: name.trim() || `Batch ${year.trim()}`,
            description: description.trim(),
            cover: coverPreview
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
                        <p className="admin-dashboard-modal-kicker">Batch Management</p>
                        <h3>{editingBatch ? 'Edit Batch Folder' : 'Create New Batch Folder'}</h3>
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
                    {/* Cover Image Upload & Preview */}
                    <div className="admin-dashboard-modal-field">
                        <span>Batch Cover Image</span>
                        <div
                            className="admin-dashboard-gallery-cover"
                            style={coverPreview && !coverError ? {
                                backgroundImage: `url(${coverPreview})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                height: '140px',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.2)'
                            } : { height: '140px' }}
                        >
                            {!coverPreview || coverError ? (
                                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
                                    <FaImage style={{ fontSize: '2rem', marginBottom: '6px', display: 'block', margin: '0 auto' }} />
                                    <span>Upload a batch group photo or banner</span>
                                </div>
                            ) : null}
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                            <label className="admin-dashboard-modal-upload" style={{ flex: 1 }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                                <span>{coverPreview ? 'Change Cover Image' : 'Upload Cover Image'}</span>
                            </label>
                            {coverPreview && (
                                <button
                                    type="button"
                                    className="admin-dashboard-modal-secondary"
                                    style={{ padding: '0 16px', borderRadius: '14px' }}
                                    onClick={() => {
                                        setCoverPreview(null);
                                        setCoverError(false);
                                    }}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Batch Year */}
                    <div className="admin-dashboard-modal-row">
                        <label className="admin-dashboard-modal-field">
                            <span>Graduation Year *</span>
                            <input
                                type="text"
                                required
                                placeholder="e.g. 2026"
                                value={year}
                                onChange={handleYearChange}
                                disabled={Boolean(editingBatch)}
                            />
                        </label>

                        <label className="admin-dashboard-modal-field">
                            <span>Folder Name</span>
                            <input
                                type="text"
                                placeholder="e.g. Batch 2026"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </label>
                    </div>

                    {/* Description */}
                    <label className="admin-dashboard-modal-field">
                        <span>Description</span>
                        <textarea
                            rows="2"
                            placeholder="e.g. AeroNITK Graduating Class of 2026"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </label>

                    {/* Modal Actions */}
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
                            {editingBatch ? 'Save Changes' : 'Create Batch Folder'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BatchFolderModal;
