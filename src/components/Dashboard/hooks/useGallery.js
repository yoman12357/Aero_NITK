import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'aeronitk-admin-gallery-v1';

const DEFAULT_FOLDER_FORM = {
    name: '',
    description: '',
    coverImage: '',
};

function createId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(reader.error || new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

function normalizeFolder(folder) {
    return {
        id: folder.id || createId('folder'),
        name: folder.name || 'Untitled Folder',
        description: folder.description || '',
        coverImage: folder.coverImage || '',
        images: Array.isArray(folder.images) ? folder.images : [],
    };
}

export function useGallery() {
    const [folders, setFolders] = useState([]);
    const [activeFolderId, setActiveFolderId] = useState(null);
    const [editingFolderId, setEditingFolderId] = useState(null);
    const [folderForm, setFolderForm] = useState({ ...DEFAULT_FOLDER_FORM });
    const [folderCoverPreview, setFolderCoverPreview] = useState('');
    const [isFolderEditorOpen, setIsFolderEditorOpen] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const loadGallery = async () => {
            try {
                const rawValue = localStorage.getItem(STORAGE_KEY);
                if (!rawValue) {
                    if (!cancelled) setIsHydrated(true);
                    return;
                }

                const parsed = JSON.parse(rawValue);
                const nextFolders = Array.isArray(parsed.folders)
                    ? parsed.folders.map(normalizeFolder)
                    : [];

                if (cancelled) return;

                setFolders(nextFolders);
                setActiveFolderId(parsed.activeFolderId && nextFolders.some((folder) => folder.id === parsed.activeFolderId)
                    ? parsed.activeFolderId
                    : nextFolders[0]?.id || null);
            } catch (error) {
                console.error('Error loading gallery folders:', error);
            } finally {
                if (!cancelled) setIsHydrated(true);
            }
        };

        loadGallery();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!isHydrated) return;

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                folders,
                activeFolderId,
            }));
        } catch (error) {
            console.error('Error saving gallery folders:', error);
        }
    }, [folders, activeFolderId, isHydrated]);

    const resetFolderForm = useCallback(() => {
        setEditingFolderId(null);
        setFolderForm({ ...DEFAULT_FOLDER_FORM });
        setFolderCoverPreview('');
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
            coverImage: '',
        });
        setFolderCoverPreview(folderToEdit.coverImage || '');
        setActiveFolderId(folderId);
        setIsFolderEditorOpen(true);
    }, [folders]);

    const closeFolderForm = useCallback(() => {
        resetFolderForm();
    }, [resetFolderForm]);

    const handleFolderFormChange = useCallback((updater) => {
        setFolderForm((currentForm) => updater(currentForm));
    }, []);

    const handleFolderCoverChange = useCallback((file) => {
        if (!file) {
            setFolderCoverPreview('');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setFolderCoverPreview(String(reader.result || ''));
        };
        reader.readAsDataURL(file);
    }, []);

    const handleSaveFolder = useCallback((formEvent) => {
        formEvent.preventDefault();

        const folderName = folderForm.name.trim();
        if (!folderName) return;

        if (editingFolderId) {
            setFolders((currentFolders) => currentFolders.map((folder) => {
                if (folder.id !== editingFolderId) return folder;

                return {
                    ...folder,
                    name: folderName,
                    description: folderForm.description.trim(),
                    coverImage: folderCoverPreview || folder.coverImage || '',
                };
            }));
            setActiveFolderId(editingFolderId);
        } else {
            const newFolderId = createId('folder');
            setFolders((currentFolders) => [
                {
                    id: newFolderId,
                    name: folderName,
                    description: folderForm.description.trim(),
                    coverImage: folderCoverPreview || '',
                    images: [],
                },
                ...currentFolders,
            ]);
            setActiveFolderId(newFolderId);
        }

        resetFolderForm();
    }, [editingFolderId, folderCoverPreview, folderForm.description, folderForm.name, resetFolderForm]);

    const handleDeleteFolder = useCallback((folderId) => {
        const folderToDelete = folders.find((folder) => folder.id === folderId);
        if (!folderToDelete) return;

        setFolders((currentFolders) => currentFolders.filter((folder) => folder.id !== folderId));

        setActiveFolderId((currentActiveFolderId) => {
            if (currentActiveFolderId !== folderId) return currentActiveFolderId;

            const remainingFolders = folders.filter((folder) => folder.id !== folderId);
            return remainingFolders[0]?.id || null;
        });

        if (editingFolderId === folderId) {
            resetFolderForm();
        }
    }, [editingFolderId, folders, resetFolderForm]);

    const handleSelectFolder = useCallback((folderId) => {
        setActiveFolderId(folderId);
    }, []);

    const handleUploadImages = useCallback(async (folderId, files) => {
        const targetFolderId = folderId || activeFolderId;
        const fileList = Array.from(files || []).filter((file) => file.type.startsWith('image/'));
        if (!fileList.length || !targetFolderId) return;

        const uploadedImages = await Promise.all(fileList.map(async (file) => ({
            id: createId('image'),
            name: file.name,
            src: await readFileAsDataUrl(file),
            uploadedAt: new Date().toISOString(),
        })));

        setFolders((currentFolders) => currentFolders.map((folder) => {
            if (folder.id !== targetFolderId) return folder;

            const nextCoverImage = folder.coverImage || uploadedImages[0]?.src || '';

            return {
                ...folder,
                coverImage: nextCoverImage,
                images: [...uploadedImages, ...folder.images],
            };
        }));
        setActiveFolderId(targetFolderId);
    }, [activeFolderId]);

    const handleDeleteImage = useCallback((folderId, imageId) => {
        setFolders((currentFolders) => currentFolders.map((folder) => {
            if (folder.id !== folderId) return folder;

            return {
                ...folder,
                images: folder.images.filter((image) => image.id !== imageId),
            };
        }));
    }, []);

    const handleSetFolderCover = useCallback((folderId, coverImage) => {
        setFolders((currentFolders) => currentFolders.map((folder) => (
            folder.id === folderId ? { ...folder, coverImage } : folder
        )));
    }, []);

    const selectedFolder = folders.find((folder) => folder.id === activeFolderId) || null;

    return {
        folders,
        activeFolderId,
        selectedFolder,
        editingFolderId,
        folderForm,
        folderCoverPreview,
        isFolderEditorOpen,
        openNewFolderForm,
        openEditFolderForm,
        closeFolderForm,
        handleFolderFormChange,
        handleFolderCoverChange,
        handleSaveFolder,
        handleDeleteFolder,
        handleSelectFolder,
        handleUploadImages,
        handleDeleteImage,
        handleSetFolderCover,
    };
}