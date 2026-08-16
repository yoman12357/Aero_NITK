import React, { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

function GalleryFolderPage({
    folders,
    onBack,
    onEditFolder,
    onDeleteFolder,
    onUploadImages,
    onDeleteImage,
}) {
    const [deleteWarningOpen, setDeleteWarningOpen] = useState(false);
    const { folderId } = useParams();
    const folder = folders.find((item) => item.id === folderId) || null;

    if (!folderId) {
        return <Navigate to="/dashboard/gallery" replace />;
    }

    if (!folder) {
        return (
            <div className="admin-dashboard-section admin-dashboard-gallery-page">
                <div className="admin-dashboard-gallery-empty">Loading folder content…</div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard-section admin-dashboard-gallery-page">
            <div className="admin-dashboard-gallery-page-topbar">
                <button type="button" className="admin-dashboard-gallery-back" onClick={onBack}>
                    ← Back to folders
                </button>

                <div className="admin-dashboard-gallery-page-actions">
                    <button type="button" className="admin-dashboard-modal-secondary" onClick={() => onEditFolder(folder.id)}>
                        Edit folder
                    </button>
                    <button type="button" className="admin-dashboard-gallery-delete" onClick={() => setDeleteWarningOpen(true)}>
                        Delete folder
                    </button>
                </div>
            </div>

            <div className="admin-dashboard-gallery-page-hero">
                <div>
                    <p>Folder content</p>
                    <h3>{folder.name}</h3>
                    <span>{folder.description || 'No description added yet.'}</span>
                </div>

                <label className="admin-dashboard-modal-upload">
                    <input type="file" accept="image/*" multiple onChange={(changeEvent) => onUploadImages(folder.id, changeEvent.target.files)} />
                    <span>Upload images to this folder</span>
                </label>
            </div>

            <div className="admin-dashboard-gallery-grid">
                {folder.images.length === 0 ? (
                    <div className="admin-dashboard-gallery-empty admin-dashboard-gallery-empty-inline">
                        No images in this folder yet. Upload one to populate the gallery.
                    </div>
                ) : folder.images.map((image, index) => (
                    // FIX 1: Use image._key for the unique React key (fallback to index if needed)
                    <figure key={image._key || index} className="admin-dashboard-gallery-image-card">
                        <img src={image.src} alt={image.name || `Image ${index + 1}`} loading="lazy" />
                        <figcaption>
                            <span>{image.name || `Image ${index + 1}`}</span>
                            <div className="admin-dashboard-gallery-image-actions">
                                {/* FIX 2: Pass image._key instead of image.id to the delete handler */}
                                <button type="button" onClick={() => onDeleteImage(folder.id, image._key)}>
                                    Remove
                                </button>
                            </div>
                        </figcaption>
                    </figure>
                ))}
            </div>

            {deleteWarningOpen ? (
                <div className="admin-dashboard-modal-backdrop" onClick={() => setDeleteWarningOpen(false)} role="presentation">
                    <div className="admin-dashboard-modal admin-dashboard-delete-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-folder-warning" onClick={(modalEvent) => modalEvent.stopPropagation()}>
                        <div className="admin-dashboard-modal-header">
                            <div>
                                <p className="admin-dashboard-modal-kicker">Warning</p>
                                <h3 id="delete-folder-warning">Delete this folder?</h3>
                            </div>
                            <button type="button" className="admin-dashboard-modal-close" onClick={() => setDeleteWarningOpen(false)} aria-label="Close delete warning">
                                ×
                            </button>
                        </div>

                        <p className="admin-dashboard-delete-warning-text">
                            This will permanently remove "{folder.name}" and all images inside it.
                        </p>

                        <div className="admin-dashboard-modal-actions">
                            <button type="button" className="admin-dashboard-modal-secondary" onClick={() => setDeleteWarningOpen(false)}>
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="admin-dashboard-modal-primary admin-dashboard-delete-confirm"
                                onClick={() => {
                                    setDeleteWarningOpen(false);
                                    onDeleteFolder(folder.id);
                                }}
                            >
                                Delete folder
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default GalleryFolderPage;