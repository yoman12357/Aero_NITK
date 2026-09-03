import { useState, useEffect, useCallback } from 'react';
import { auth } from '../../../firebase';
import {
    fetchAlumniBatches,
    fetchAlumniBatchDetail,
    saveAlumniBatch,
    deleteAlumniBatchApi,
    saveAlumniMember,
    deleteAlumniMemberApi
} from '../../../data/alumniData.js';

async function getAuthToken() {
    if (auth && auth.currentUser) {
        return auth.currentUser.getIdToken();
    }
    return '';
}

export function useAlumni() {
    const [batches, setBatches] = useState([]);
    const [alumniData, setAlumniData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refreshData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const batchList = await fetchAlumniBatches();
            setBatches(batchList);

            const details = await Promise.all(
                batchList.map((b) => fetchAlumniBatchDetail(b.id))
            );

            const dataMap = {};
            details.forEach((detail, idx) => {
                if (!detail) return;
                const idKey = batchList[idx].id;
                const yearKey = batchList[idx].year;
                dataMap[idKey] = detail.members;
                if (yearKey && yearKey !== idKey) {
                    dataMap[yearKey] = detail.members;
                }
            });
            setAlumniData(dataMap);
        } catch (err) {
            console.error('Error loading alumni data:', err);
            setError(err.message || 'Failed to load alumni data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const resolveBatchDocId = useCallback((batchId) => {
        const existing = batches.find((b) => b.id === batchId || b.year === batchId);
        return existing ? existing.id : batchId;
    }, [batches]);

    const handleAddBatch = useCallback(async (batchData) => {
        try {
            const token = await getAuthToken();
            await saveAlumniBatch({
                year: batchData.year,
                name: batchData.name,
                description: batchData.description,
                coverFile: batchData.coverFile || null
            }, token);
            await refreshData();
        } catch (err) {
            console.error('Error adding batch:', err);
            alert(err.message || 'Error adding batch');
        }
    }, [refreshData]);

    const handleEditBatch = useCallback(async (batchId, batchData) => {
        try {
            const token = await getAuthToken();
            await saveAlumniBatch({
                batchId: resolveBatchDocId(batchId),
                year: batchData.year,
                name: batchData.name,
                description: batchData.description,
                coverFile: batchData.coverFile || null
            }, token);
            await refreshData();
        } catch (err) {
            console.error('Error editing batch:', err);
            alert(err.message || 'Error editing batch');
        }
    }, [resolveBatchDocId, refreshData]);

    const handleDeleteBatch = useCallback(async (batchId) => {
        try {
            const token = await getAuthToken();
            await deleteAlumniBatchApi(resolveBatchDocId(batchId), token);
            await refreshData();
        } catch (err) {
            console.error('Error deleting batch:', err);
            alert(err.message || 'Error deleting batch');
        }
    }, [resolveBatchDocId, refreshData]);

    const handleAddMember = useCallback(async (batchId, memberData) => {
        try {
            const token = await getAuthToken();
            await saveAlumniMember({
                batchId: resolveBatchDocId(batchId),
                name: memberData.name,
                role: memberData.role,
                company: memberData.company,
                linkedin: memberData.linkedin,
                imageFile: memberData.imageFile || null
            }, token);
            await refreshData();
        } catch (err) {
            console.error('Error adding member:', err);
            alert(err.message || 'Error adding member');
        }
    }, [resolveBatchDocId, refreshData]);

    const handleEditMember = useCallback(async (batchId, memberId, memberData) => {
        try {
            const token = await getAuthToken();
            await saveAlumniMember({
                batchId: resolveBatchDocId(batchId),
                memberId,
                name: memberData.name,
                role: memberData.role,
                company: memberData.company,
                linkedin: memberData.linkedin,
                imageFile: memberData.imageFile || null
            }, token);
            await refreshData();
        } catch (err) {
            console.error('Error editing member:', err);
            alert(err.message || 'Error editing member');
        }
    }, [resolveBatchDocId, refreshData]);

    const handleDeleteMember = useCallback(async (batchId, memberId) => {
        try {
            const token = await getAuthToken();
            await deleteAlumniMemberApi(resolveBatchDocId(batchId), memberId, token);
            await refreshData();
        } catch (err) {
            console.error('Error deleting member:', err);
            alert(err.message || 'Error deleting member');
        }
    }, [resolveBatchDocId, refreshData]);

    return {
        batches,
        alumniData,
        loading,
        error,
        handleAddBatch,
        handleEditBatch,
        handleDeleteBatch,
        handleAddMember,
        handleEditMember,
        handleDeleteMember,
        refreshData
    };
}