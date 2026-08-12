import React from 'react';

function GalleryTab({ folders, activeFolderId, onAddFolder, onOpenFolder, onEditFolder }) {
    return (
        <div className="admin-dashboard-section admin-dashboard-gallery-section">
            <div className="admin-dashboard-section-header">
                <h3 className="admin-dashboard-section-title">Gallery</h3>
                <button type="button" className="admin-dashboard-add-btn" onClick={onAddFolder}>
                    + Add Folder
                </button>
            </div>

            <div className="admin-dashboard-gallery-strip" aria-label="Gallery folders">
                {folders.length === 0 ? (
                    <div className="admin-dashboard-gallery-empty admin-dashboard-gallery-empty-inline">
                        Create your first folder to start organizing uploaded images.
                    </div>
                ) : folders.map((folder) => (
                    <article key={folder.id} className={`admin-dashboard-gallery-folder ${activeFolderId === folder.id ? 'is-active' : ''}`}>
                        <button
                            type="button"
                            className="admin-dashboard-gallery-folder-main"
                            onClick={() => onOpenFolder(folder.id)}
                        >
                            <span
                                className="admin-dashboard-gallery-folder-cover"
                                style={folder.coverImage ? { backgroundImage: `url(${folder.coverImage})` } : undefined}
                            >
                                {!folder.coverImage ? folder.name.slice(0, 1).toUpperCase() : null}
                            </span>
                            <span className="admin-dashboard-gallery-folder-copy">
                                <strong>{folder.name}</strong>
                                <span>{folder.images.length} images</span>
                            </span>
                            <span className="admin-dashboard-gallery-folder-arrow">↗</span>
                        </button>

                        <div className="admin-dashboard-gallery-folder-actions">
                            <button type="button" onClick={() => onEditFolder(folder.id)}>
                                Edit
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

export default GalleryTab;