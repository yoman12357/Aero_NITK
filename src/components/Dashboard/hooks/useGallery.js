import { useCallback, useEffect, useState } from 'react';
import { auth } from '../../../firebase';

const DEFAULT_FOLDER_FORM = {
    name: '',
    description: '',
    coverImage: null,
};

export function useGallery() {
    const [folders, setFolders] = useState([]);
    const [activeFolderId, setActiveFolderId] = useState(null);
    const [editingFolderId, setEditingFolderId] = useState(null);
    const [folderForm, setFolderForm] = useState({ ...DEFAULT_FOLDER_FORM });
    const [isFolderEditorOpen, setIsFolderEditorOpen] = useState(false);
    const [foldersLoading, setFoldersLoading] = useState(true);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    const fetchFolders = useCallback(async () => {
        try {
            setFoldersLoading(true);
            const response = await fetch(`${backendUrl}/api/gallery-folders`);
            const data = await response.json();
            
            if (data.success && Array.isArray(data.folders)) {
                const mappedFolders = data.folders.map(folder => ({
                    id: folder._id || folder.id,
                    name: folder.name || 'Untitled Folder',
                    description: folder.description || '',
                    cover: folder.cover || null,
                    images: Array.isArray(folder.images) ? folder.images : [],
                }));
                setFolders(mappedFolders);
                if (mappedFolders.length > 0 && !activeFolderId) {
                    setActiveFolderId(mappedFolders[0].id);
                }
            }
        } catch (error) {
            console.error('Error fetching gallery folders:', error);
        } finally {
            setFoldersLoading(false);
        }
    }, [backendUrl, activeFolderId]);

    useEffect(() => {
        fetchFolders();
    }, [fetchFolders]);

    const resetFolderForm = useCallback(() => {
        setEditingFolderId(null);
        setFolderForm({ ...DEFAULT_FOLDER_FORM });
    }, []);

    const openNewFolderForm = useCallback(() => {
        resetFolderForm();
        setIsFolderEditorOpen(true);
    }, [resetFolderForm]);

    const openEditFolderForm = useCallback((folderId) => {
        const folderToEdit = folders.find((folder) => folder.id === folderId);
        if (!folderToEdit) return;

        setEditingFolderId(folderId);
        setFolderForm({
            name: folderToEdit.name,
            description: folderToEdit.description || '',
            coverImage: null,
        });
        setActiveFolderId(folderId);
        setIsFolderEditorOpen(true);
    }, [folders]);

    const closeFolderForm = useCallback(() => {
        resetFolderForm();
        setIsFolderEditorOpen(false);
    }, [resetFolderForm]);

    const handleFolderFormChange = useCallback((updater) => {
        setFolderForm((currentForm) => typeof updater === 'function' ? updater(currentForm) : { ...currentForm, ...updater });
    }, []);

    const handleSaveFolder = useCallback(async (formEvent) => {
        console.log('handleSaveFolder was called!', folderForm);
        formEvent.preventDefault();

        const folderName = folderForm.name?.trim();
        if (!folderName) return;

        try {
            let token = '';
            if (auth && auth.currentUser) {
                token = await auth.currentUser.getIdToken();
            }

            const formData = new FormData();
            if (editingFolderId) formData.append('folderId', editingFolderId);
            formData.append('name', folderName);
            formData.append('description', folderForm.description?.trim() || '');
            
            if (folderForm.coverImage instanceof File) {
                formData.append('coverImage', folderForm.coverImage);
            }

            const response = await fetch(`${backendUrl}/api/save-gallery-folder`, {
                method: 'POST',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: formData,
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Failed to save folder');
            }

            alert('Gallery folder saved successfully!');
            closeFolderForm();
            fetchFolders();
        } catch (error) {
            console.error('Error saving gallery folder:', error);
            alert(error.message || 'Error saving folder');
        }
    }, [editingFolderId, folderForm, backendUrl, closeFolderForm, fetchFolders]);

    const handleDeleteFolder = useCallback(async (folderId) => {
        if (!window.confirm('Are you sure you want to delete this folder?')) return;

        try {
            let token = '';
            if (auth && auth.currentUser) {
                token = await auth.currentUser.getIdToken();
            }

            const response = await fetch(`${backendUrl}/api/delete-gallery-folder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ folderId }),
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Failed to delete folder');
            }

            if (editingFolderId === folderId) {
                resetFolderForm();
            }
            
            fetchFolders();
        } catch (error) {
            console.error('Error deleting folder:', error);
            alert(error.message || 'Error deleting folder');
        }
    }, [backendUrl, editingFolderId, resetFolderForm, fetchFolders]);

    const handleSelectFolder = useCallback((folderId) => {
        setActiveFolderId(folderId);
    }, []);

    const handleUploadImages = useCallback(async (folderId, files) => {
        const targetFolderId = folderId || activeFolderId;
        const fileList = Array.from(files || []).filter((file) => file.type.startsWith('image/'));
        if (!fileList.length || !targetFolderId) return;

        try {
            let token = '';
            if (auth && auth.currentUser) {
                token = await auth.currentUser.getIdToken();
            }

            const formData = new FormData();
            formData.append('folderId', targetFolderId);
            fileList.forEach((file) => {
                formData.append('images', file);
            });

            const response = await fetch(`${backendUrl}/api/upload-gallery-images`, {
                method: 'POST',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: formData,
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Failed to upload images');
            }

            fetchFolders();
        } catch (error) {
            console.error('Error uploading images:', error);
            alert(error.message || 'Error uploading images');
        }
    }, [activeFolderId, backendUrl, fetchFolders]);

    const handleDeleteImage = useCallback(async (folderId, imageId) => {
        try {
            let token = '';
            if (auth && auth.currentUser) {
                token = await auth.currentUser.getIdToken();
            }

            const response = await fetch(`${backendUrl}/api/delete-gallery-image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ folderId, imageId }),
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Failed to delete image');
            }

            fetchFolders();
        } catch (error) {
            console.error('Error deleting image:', error);
            alert(error.message || 'Error deleting image');
        }
    }, [backendUrl, fetchFolders]);

    const selectedFolder = folders.find((folder) => folder.id === activeFolderId) || null;

    return {
        folders,
        foldersLoading,
        activeFolderId,
        selectedFolder,
        editingFolderId,
        folderForm,
        isFolderEditorOpen,
        openNewFolderForm,
        openEditFolderForm,
        closeFolderForm,
        handleFolderFormChange,
        handleSaveFolder,
        handleDeleteFolder,
        handleSelectFolder,
        handleUploadImages,
        handleDeleteImage,
    };
}