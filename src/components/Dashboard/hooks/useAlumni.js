import { useState, useEffect, useCallback } from 'react';
import {
    getStoredBatches,
    saveStoredBatches,
    addBatchFolder,
    updateBatchFolder,
    deleteBatchFolder,
    getStoredAlumni,
    saveStoredAlumni,
    addAlumni,
    updateAlumni,
    deleteAlumni,
    ALUMNI_UPDATED_EVENT
} from '../../../data/alumniData.js';

export function useAlumni() {
    const [batches, setBatches] = useState(getStoredBatches);
    const [alumniData, setAlumniData] = useState(getStoredAlumni);

    const refreshData = useCallback(() => {
        setBatches(getStoredBatches());
        setAlumniData(getStoredAlumni());
    }, []);

    useEffect(() => {
        const handleUpdated = () => {
            refreshData();
        };

        window.addEventListener(ALUMNI_UPDATED_EVENT, handleUpdated);
        return () => {
            window.removeEventListener(ALUMNI_UPDATED_EVENT, handleUpdated);
        };
    }, [refreshData]);

    const handleAddBatch = useCallback((batchData) => {
        addBatchFolder(batchData);
        refreshData();
    }, [refreshData]);

    const handleEditBatch = useCallback((batchId, batchData) => {
        updateBatchFolder(batchId, batchData);
        refreshData();
    }, [refreshData]);

    const handleDeleteBatch = useCallback((batchId) => {
        deleteBatchFolder(batchId);
        refreshData();
    }, [refreshData]);

    const handleAddMember = useCallback((batchId, memberData) => {
        addAlumni({ ...memberData, batch: batchId });
        refreshData();
    }, [refreshData]);

    const handleEditMember = useCallback((batchId, memberId, memberData) => {
        updateAlumni(batchId, memberId, memberData);
        refreshData();
    }, [refreshData]);

    const handleDeleteMember = useCallback((batchId, memberId) => {
        deleteAlumni(batchId, memberId);
        refreshData();
    }, [refreshData]);

    return {
        batches,
        alumniData,
        handleAddBatch,
        handleEditBatch,
        handleDeleteBatch,
        handleAddMember,
        handleEditMember,
        handleDeleteMember,
        refreshData
    };
}
