import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaFolder, FaExternalLinkAlt, FaGraduationCap } from 'react-icons/fa';
import BatchFolderModal from '../components/BatchFolderModal.jsx';

function AlumniTab({
    batches,
    alumniData,
    onAddBatch,
    onOpenBatch,
    onEditBatch,
    onDeleteBatch
}) {
    const [isCreateBatchModalOpen, setIsCreateBatchModalOpen] = useState(false);
    const [editingBatch, setEditingBatch] = useState(null);

    const handleOpenCreateBatch = () => {
        setEditingBatch(null);
        setIsCreateBatchModalOpen(true);
    };

    const handleOpenEditBatch = (batch) => {
        setEditingBatch(batch);
        setIsCreateBatchModalOpen(true);
    };

    const handleSaveBatch = (batchData) => {
        if (editingBatch) {
            onEditBatch(batchData.id, batchData);
        } else {
            onAddBatch(batchData);
        }
    };

    // Calculate total alumni
    const totalAlumniCount = batches.reduce((sum, b) => {
        return sum + (alumniData[b.id] || alumniData[b.year] || []).length;
    }, 0);

    return (
        <div className="admin-dashboard-section admin-dashboard-alumni-section">
            {/* Header with Title, Stats, and Create Folder button */}
            <div className="admin-dashboard-section-header">
                <div>
                    <h3 className="admin-dashboard-section-title">Alumni Directory & Batches</h3>
                    <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                        Organized by graduation batch folders. Open a folder to manage alumni members.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Link
                        to="/alumni"
                        className="admin-dashboard-alumni-link-btn"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <span>View Public Page</span>
                        <FaExternalLinkAlt style={{ fontSize: '0.8rem' }} />
                    </Link>
                    <button
                        type="button"
                        className="admin-dashboard-add-btn"
                        onClick={handleOpenCreateBatch}
                    >
                        <FaPlus style={{ marginRight: '6px' }} />
                        Create Batch Folder
                    </button>
                </div>
            </div>

            {/* Folder Grid (Similar to Gallery folders) */}
            <div className="admin-dashboard-gallery-strip" aria-label="Alumni batch folders">
                {batches.length === 0 ? (
                    <div className="admin-dashboard-gallery-empty admin-dashboard-gallery-empty-inline">
                        No batch folders created yet. Click "+ Create Batch Folder" to start organizing alumni.
                    </div>
                ) : batches.map((batch) => {
                    const count = (alumniData[batch.id] || alumniData[batch.year] || []).length;
                    return (
                        <article key={batch.id} className="admin-dashboard-gallery-folder admin-dashboard-alumni-folder-card">
                            <button
                                type="button"
                                className="admin-dashboard-gallery-folder-main"
                                onClick={() => onOpenBatch(batch.id || batch.year)}
                            >
                                <span
                                    className="admin-dashboard-gallery-folder-cover"
                                    style={batch.cover ? {
                                        backgroundImage: `url(${batch.cover})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    } : undefined}
                                >
                                    {!batch.cover ? (batch.year ? batch.year.slice(-2) : <FaGraduationCap />) : null}
                                </span>
                                <span className="admin-dashboard-gallery-folder-copy">
                                    <strong>{batch.name || `Batch ${batch.year}`}</strong>
                                    <span>{count} alumni members</span>
                                </span>
                                <span className="admin-dashboard-gallery-folder-arrow">↗</span>
                            </button>

                            <div className="admin-dashboard-gallery-folder-actions">
                                <button type="button" onClick={() => handleOpenEditBatch(batch)}>
                                    Edit
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>

            {/* Batch Folder Modal (Create / Edit) */}
            <BatchFolderModal
                isOpen={isCreateBatchModalOpen}
                onClose={() => setIsCreateBatchModalOpen(false)}
                onSubmit={handleSaveBatch}
                editingBatch={editingBatch}
            />
        </div>
    );
}

export default AlumniTab;
