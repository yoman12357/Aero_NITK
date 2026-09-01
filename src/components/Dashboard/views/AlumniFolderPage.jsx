import React, { useState, useMemo } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { FaLinkedin, FaUserCircle, FaPlus, FaSearch, FaTrash, FaEdit, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import AlumniModal from '../components/AlumniModal.jsx';
import BatchFolderModal from '../components/BatchFolderModal.jsx';

function AlumniFolderPage({
    batches,
    alumniData,
    onBack,
    onEditBatch,
    onDeleteBatch,
    onAddAlumni,
    onEditAlumni,
    onDeleteAlumni
}) {
    const { batchId } = useParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [isAlumniModalOpen, setIsAlumniModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [isEditBatchOpen, setIsEditBatchOpen] = useState(false);
    const [deleteBatchWarningOpen, setDeleteBatchWarningOpen] = useState(false);
    const [deleteMemberTarget, setDeleteMemberTarget] = useState(null);

    const batch = useMemo(() => {
        return batches.find(b => b.id === batchId || b.year === batchId) || {
            id: batchId,
            year: batchId,
            name: `Batch ${batchId}`,
            description: `AeroNITK Graduating Class of ${batchId}`,
            cover: null
        };
    }, [batches, batchId]);

    const alumniList = useMemo(() => {
        return alumniData[batchId] || [];
    }, [alumniData, batchId]);

    const filteredAlumni = useMemo(() => {
        if (!searchQuery.trim()) return alumniList;
        const q = searchQuery.toLowerCase();
        return alumniList.filter(m =>
            (m.name && m.name.toLowerCase().includes(q)) ||
            (m.role && m.role.toLowerCase().includes(q)) ||
            (m.company && m.company.toLowerCase().includes(q))
        );
    }, [alumniList, searchQuery]);

    if (!batchId) {
        return <Navigate to="/dashboard/alumni" replace />;
    }

    const handleOpenAddAlumni = () => {
        setEditingMember(null);
        setIsAlumniModalOpen(true);
    };

    const handleOpenEditAlumni = (member) => {
        setEditingMember(member);
        setIsAlumniModalOpen(true);
    };

    const handleSaveAlumni = (memberData) => {
        if (memberData.id) {
            onEditAlumni(batchId, memberData.id, memberData);
        } else {
            onAddAlumni(batchId, memberData);
        }
    };

    const handleSaveBatchFolder = (batchData) => {
        onEditBatch(batchId, batchData);
        setIsEditBatchOpen(false);
    };

    return (
        <div className="admin-dashboard-section admin-dashboard-alumni-folder-page">
            {/* Topbar navigation & actions */}
            <div className="admin-dashboard-gallery-page-topbar">
                <button type="button" className="admin-dashboard-gallery-back" onClick={onBack}>
                    ← Back to Batch Folders
                </button>

                <div className="admin-dashboard-gallery-page-actions">
                    <Link
                        to={`/alumni/${batchId}`}
                        className="admin-dashboard-modal-secondary"
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                    >
                        <span>Public View</span>
                        <FaExternalLinkAlt style={{ fontSize: '0.75rem' }} />
                    </Link>

                    <button
                        type="button"
                        className="admin-dashboard-modal-secondary"
                        onClick={() => setIsEditBatchOpen(true)}
                    >
                        <FaEdit style={{ marginRight: '6px' }} />
                        Edit Batch
                    </button>

                    <button
                        type="button"
                        className="admin-dashboard-gallery-delete"
                        onClick={() => setDeleteBatchWarningOpen(true)}
                    >
                        <FaTrash style={{ marginRight: '6px' }} />
                        Delete Batch
                    </button>
                </div>
            </div>

            {/* Batch Hero Banner (similar to Gallery Folder Hero) */}
            <div className="admin-dashboard-gallery-page-hero admin-dashboard-alumni-folder-hero">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {batch.cover ? (
                        <div
                            className="admin-dashboard-alumni-hero-cover"
                            style={{ backgroundImage: `url(${batch.cover})` }}
                        />
                    ) : null}
                    <div>
                        <p>Batch Folder</p>
                        <h3>{batch.name || `Batch ${batch.year}`}</h3>
                        <span>
                            {batch.description || `AeroNITK Graduating Class of ${batch.year}`} • {alumniList.length} Members
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    className="admin-dashboard-add-btn"
                    onClick={handleOpenAddAlumni}
                >
                    <FaPlus style={{ marginRight: '6px' }} />
                    Add Alumni to this Batch
                </button>
            </div>

            {/* Search Toolbar inside Batch */}
            <div className="admin-dashboard-alumni-toolbar" style={{ margin: '22px 0' }}>
                <div className="admin-dashboard-alumni-search" style={{ maxWidth: '420px' }}>
                    <FaSearch className="admin-dashboard-alumni-search-icon" />
                    <input
                        type="text"
                        placeholder={`Search within Batch ${batch.year || batch.name}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            className="admin-dashboard-alumni-clear-search"
                            onClick={() => setSearchQuery('')}
                        >
                            ×
                        </button>
                    )}
                </div>

                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600 }}>
                    Showing {filteredAlumni.length} of {alumniList.length} Alumni
                </span>
            </div>

            {/* Alumni Cards Grid */}
            {filteredAlumni.length === 0 ? (
                <div className="admin-dashboard-gallery-empty admin-dashboard-gallery-empty-inline" style={{ padding: '40px 20px' }}>
                    {searchQuery ? (
                        <p style={{ margin: 0 }}>No alumni members matching "{searchQuery}" in this batch.</p>
                    ) : (
                        <div>
                            <p style={{ margin: '0 0 16px', fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)' }}>
                                No alumni members in this batch folder yet.
                            </p>
                            <button
                                type="button"
                                className="admin-dashboard-add-btn"
                                onClick={handleOpenAddAlumni}
                            >
                                <FaPlus style={{ marginRight: '6px' }} />
                                Add First Alumni Member
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="admin-dashboard-alumni-cards-grid">
                    {filteredAlumni.map((member, index) => (
                        <div key={member.id || index} className="admin-dashboard-alumni-card">
                            <div className="admin-dashboard-alumni-card-top">
                                <div className="admin-dashboard-alumni-avatar">
                                    {member.image ? (
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                if (e.currentTarget.nextSibling) {
                                                    e.currentTarget.nextSibling.style.display = 'block';
                                                }
                                            }}
                                        />
                                    ) : null}
                                    <FaUserCircle
                                        className="admin-dashboard-alumni-avatar-fallback"
                                        style={{ display: member.image ? 'none' : 'block' }}
                                    />
                                </div>

                                <div className="admin-dashboard-alumni-card-details">
                                    <div className="admin-dashboard-alumni-card-name-row">
                                        <h4 className="admin-dashboard-alumni-name">{member.name}</h4>
                                        <span className="admin-dashboard-alumni-batch-badge">
                                            Batch {batch.year || batchId}
                                        </span>
                                    </div>

                                    {member.role ? (
                                        <p className="admin-dashboard-alumni-role">{member.role}</p>
                                    ) : (
                                        <p className="admin-dashboard-alumni-role placeholder-role">AeroNITK Alumnus</p>
                                    )}

                                    {member.linkedin ? (
                                        <a
                                            href={member.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="admin-dashboard-alumni-linkedin-link"
                                        >
                                            <FaLinkedin />
                                            <span>LinkedIn Profile</span>
                                        </a>
                                    ) : (
                                        <span className="admin-dashboard-alumni-no-linkedin">
                                            No LinkedIn link
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Card Bottom Action Buttons */}
                            <div className="admin-dashboard-alumni-card-actions">
                                <button
                                    type="button"
                                    className="admin-dashboard-alumni-card-action-btn edit-btn"
                                    onClick={() => handleOpenEditAlumni(member)}
                                    title="Edit member details"
                                >
                                    <FaEdit />
                                    <span>Edit</span>
                                </button>
                                <button
                                    type="button"
                                    className="admin-dashboard-alumni-card-action-btn delete-btn"
                                    onClick={() => setDeleteMemberTarget(member)}
                                    title="Delete member"
                                >
                                    <FaTrash />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add / Edit Alumni Modal */}
            <AlumniModal
                isOpen={isAlumniModalOpen}
                onClose={() => setIsAlumniModalOpen(false)}
                onSubmit={handleSaveAlumni}
                editingMember={editingMember}
                defaultBatch={batch.year || batchId}
            />

            {/* Edit Batch Folder Modal */}
            <BatchFolderModal
                isOpen={isEditBatchOpen}
                onClose={() => setIsEditBatchOpen(false)}
                onSubmit={handleSaveBatchFolder}
                editingBatch={batch}
            />

            {/* Delete Batch Confirmation Modal */}
            {deleteBatchWarningOpen && (
                <div className="admin-dashboard-modal-backdrop" onClick={() => setDeleteBatchWarningOpen(false)}>
                    <div
                        className="admin-dashboard-modal admin-dashboard-delete-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="admin-dashboard-modal-header">
                            <div>
                                <p className="admin-dashboard-modal-kicker">Warning</p>
                                <h3>Delete Batch Folder?</h3>
                            </div>
                            <button
                                type="button"
                                className="admin-dashboard-modal-close"
                                onClick={() => setDeleteBatchWarningOpen(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <p className="admin-dashboard-delete-warning-text">
                            This will permanently delete "{batch.name || `Batch ${batch.year}`}" and remove all {alumniList.length} alumni records inside it.
                        </p>
                        <div className="admin-dashboard-modal-actions">
                            <button
                                type="button"
                                className="admin-dashboard-modal-secondary"
                                onClick={() => setDeleteBatchWarningOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="admin-dashboard-modal-primary admin-dashboard-delete-confirm"
                                onClick={() => {
                                    setDeleteBatchWarningOpen(false);
                                    onDeleteBatch(batchId);
                                    onBack();
                                }}
                            >
                                Delete Batch Folder
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Member Confirmation Modal */}
            {deleteMemberTarget && (
                <div className="admin-dashboard-modal-backdrop" onClick={() => setDeleteMemberTarget(null)}>
                    <div
                        className="admin-dashboard-modal"
                        style={{ maxWidth: '440px' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="admin-dashboard-modal-header">
                            <div>
                                <p className="admin-dashboard-modal-kicker" style={{ color: '#ff6b6b' }}>Confirm Deletion</p>
                                <h3>Remove Alumni Member?</h3>
                            </div>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.85)', margin: '14px 0 20px', fontSize: '0.95rem' }}>
                            Are you sure you want to remove <strong>{deleteMemberTarget.name}</strong> from Batch {batch.year || batchId}?
                        </p>
                        <div className="admin-dashboard-modal-actions">
                            <button
                                type="button"
                                className="admin-dashboard-modal-secondary"
                                onClick={() => setDeleteMemberTarget(null)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="admin-dashboard-modal-primary"
                                style={{ background: 'linear-gradient(180deg, #ff4336 0%, #b81409 100%)' }}
                                onClick={() => {
                                    onDeleteAlumni(batchId, deleteMemberTarget.id || deleteMemberTarget.name);
                                    setDeleteMemberTarget(null);
                                }}
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AlumniFolderPage;
