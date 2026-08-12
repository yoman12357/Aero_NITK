import React, { useEffect } from 'react';

function GalleryEditorModal({
    isOpen,
    editingFolderId,
    folderForm,
    folderCoverPreview,
    onFolderFormChange,
    onFolderCoverChange,
    onSubmit,
    onClose,
}) {
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="admin-dashboard-modal-backdrop" onClick={onClose} role="presentation">
            <div className="admin-dashboard-modal" role="dialog" aria-modal="true" aria-labelledby="gallery-folder-editor-title" onClick={(modalEvent) => modalEvent.stopPropagation()}>
                <div className="admin-dashboard-modal-header">
                    <div>
                        <p className="admin-dashboard-modal-kicker">Gallery</p>
                        <h3 id="gallery-folder-editor-title">{editingFolderId ? 'Edit Folder' : 'Add Folder'}</h3>
                    </div>
                    <button type="button" className="admin-dashboard-modal-close" onClick={onClose} aria-label="Close folder editor">
                        ×
                    </button>
                </div>

                <form className="admin-dashboard-modal-form" onSubmit={onSubmit}>
                    <div className="admin-dashboard-modal-image">
                        <div className="admin-dashboard-modal-preview" style={folderCoverPreview ? { backgroundImage: `url(${folderCoverPreview})` } : undefined}>
                            {!folderCoverPreview ? <span>No cover selected</span> : null}
                        </div>
                        <label className="admin-dashboard-modal-upload">
                            <input type="file" accept="image/*" onChange={(changeEvent) => onFolderCoverChange(changeEvent.target.files?.[0])} />
                            <span>{folderCoverPreview ? 'Replace cover image' : 'Upload cover image'}</span>
                        </label>
                    </div>

                    <label className="admin-dashboard-modal-field">
                        <span>Folder Name</span>
                        <input
                            type="text"
                            value={folderForm.name}
                            onChange={(changeEvent) => onFolderFormChange((currentForm) => ({ ...currentForm, name: changeEvent.target.value }))}
                            placeholder="Enter folder name"
                            required
                        />
                    </label>

                    <label className="admin-dashboard-modal-field">
                        <span>Description</span>
                        <textarea
                            rows="4"
                            value={folderForm.description}
                            onChange={(changeEvent) => onFolderFormChange((currentForm) => ({ ...currentForm, description: changeEvent.target.value }))}
                            placeholder="Add a short folder description"
                        />
                    </label>

                    <div className="admin-dashboard-modal-actions">
                        <button type="button" className="admin-dashboard-modal-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="admin-dashboard-modal-primary">
                            {editingFolderId ? 'Save Changes' : 'Create Folder'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default GalleryEditorModal;