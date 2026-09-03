const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

async function parseJsonResponse(res) {
    const data = await res.json();
    if (!data.success) {
        throw new Error(data.error || 'Request failed');
    }
    return data;
}

function normalizeBatchSummary(b) {
    return {
        id: b._id,
        year: b.batchyear,
        name: b.name || `Batch ${b.batchyear}`,
        description: b.description || '',
        cover: b.coverUrl || null,
        count: b.memberCount || 0
    };
}

function normalizeMember(m) {
    return {
        id: m._key,
        name: m.name,
        role: m.role || '',
        company: m.company || '',
        linkedin: m.linkedin || '',
        image: m.image || null
    };
}

function normalizeBatchDetail(b) {
    return {
        id: b._id,
        year: b.batchyear,
        name: b.name || `Batch ${b.batchyear}`,
        description: b.description || '',
        cover: b.coverUrl || null,
        members: (b.members || []).map(normalizeMember)
    };
}

// ---- READ (used by both admin dashboard and public pages) ----

export async function fetchAlumniBatches() {
    const res = await fetch(`${BACKEND_URL}/api/alumni`);
    const data = await parseJsonResponse(res);
    return (data.batches || []).map(normalizeBatchSummary);
}

export async function fetchAlumniBatchDetail(batchIdOrYear) {
    const res = await fetch(`${BACKEND_URL}/api/alumni/${encodeURIComponent(batchIdOrYear)}`);
    const data = await parseJsonResponse(res);
    if (!data.batch) return null;
    return normalizeBatchDetail(data.batch);
}

// ---- WRITE (admin dashboard only — requires a Firebase ID token) ----

export async function saveAlumniBatch({ batchId, year, name, description, coverFile }, token) {
    const formData = new FormData();
    if (batchId) formData.append('batchId', batchId);
    formData.append('batchyear', year);
    formData.append('name', name || `Batch ${year}`);
    formData.append('description', description || '');
    if (coverFile) formData.append('coverImage', coverFile);

    const res = await fetch(`${BACKEND_URL}/api/save-alumni-batch`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
    });
    const data = await parseJsonResponse(res);
    return data.data;
}

export async function deleteAlumniBatchApi(batchId, token) {
    const res = await fetch(`${BACKEND_URL}/api/alumni/batch/${encodeURIComponent(batchId)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });
    return parseJsonResponse(res);
}

export async function saveAlumniMember({ batchId, memberId, name, role, company, linkedin, imageFile }, token) {
    const formData = new FormData();
    formData.append('batchId', batchId);
    if (memberId) formData.append('memberKey', memberId);
    formData.append('name', name);
    formData.append('role', role || '');
    formData.append('company', company || '');
    formData.append('linkedin', linkedin || '');
    if (imageFile) formData.append('image', imageFile);

    const res = await fetch(`${BACKEND_URL}/api/alumni/member`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
    });
    const data = await parseJsonResponse(res);
    return data.data;
}

export async function deleteAlumniMemberApi(batchId, memberId, token) {
    const res = await fetch(`${BACKEND_URL}/api/alumni/delete-member`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ batchId, memberKey: memberId })
    });
    return parseJsonResponse(res);
}