import React, { useState, useEffect } from 'react';
import './TeamsTab.css';
import { client, urlFor } from '../../../client'; 
import { getAuth } from 'firebase/auth';

function TeamsTab() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    const [form, setForm] = useState({
        name: '', linkedIn: '', teamType: 'Member', subsystem: '', role: ''
    });

    const auth = getAuth();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    const API_URL = `${BACKEND_URL}/api/team`;  

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const data = await client.fetch(`*[_type == "teamMember"] | order(_createdAt desc)`);
            setMembers(data);
        } catch (error) {
            console.error("Failed to fetch members:", error);
        }
    };

    // Helper to safely extract Sanity image URLs
    const getImageUrl = (imageSource) => {
        if (!imageSource) return '';
        if (typeof imageSource === 'string') return imageSource;
        try {
            return urlFor(imageSource).url();
        } catch (error) {
            console.error("Error generating image URL:", error);
            return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = () => setPhotoPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) return alert('Please select a photo.');
        
        setLoading(true);

        try {
            const token = await auth.currentUser.getIdToken();

            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('role', form.role);
            formData.append('teamType', form.teamType);
            formData.append('subsystem', form.subsystem);
            formData.append('linkedIn', form.linkedIn);
            formData.append('image', selectedFile);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) throw new Error('Failed to upload');

            await fetchMembers();
            setForm({ name: '', linkedIn: '', teamType: 'Member', subsystem: '', role: '' });
            setPhotoPreview(null);
            setSelectedFile(null);
            alert('Team member added successfully!');

        } catch (error) {
            console.error(error);
            alert('Failed to add team member.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this member?")) return;

        try {
            const token = await auth.currentUser.getIdToken();
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to delete');
            setMembers((prev) => prev.filter((member) => (member._id || member.id) !== id));
        } catch (error) {
            console.error(error);
            alert("Failed to delete member.");
        }
    };

    return (
        <div className="teams-tab">

            {/* HEADER */}
            <div className="teams-tab-header">
                <div>
                    <h2>Team Members</h2>
                    <p>Add and manage members of the Aero NITK team.</p>
                </div>
                <div className="teams-count">
                    {members.length} Members
                </div>
            </div>

            <div className="teams-layout">

                {/* ADD MEMBER FORM */}
                <div className="teams-form-card">
                    <h3>Add Team Member</h3>

                    <form onSubmit={handleSubmit}>
                        {/* NAME */}
                        <div className="teams-form-group">
                            <label htmlFor="team-name">Name</label>
                            <input
                                id="team-name"
                                type="text"
                                name="name"
                                placeholder="Enter name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* PHOTO */}
                        <div className="teams-form-group">
                            <label htmlFor="team-photo">Photo</label>
                            <div className="teams-photo-upload">
                                {photoPreview ? (
                                    <img
                                        src={photoPreview}
                                        alt="Selected team member preview"
                                        className="teams-photo-preview"
                                        onError={(e) => {
                                            console.error('Image failed to load:', photoPreview);
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="teams-photo-placeholder">
                                        <span>+</span>
                                        <p>Upload Photo</p>
                                    </div>
                                )}

                                <input
                                    id="team-photo"
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={handlePhotoChange}
                                    required={!photoPreview}
                                />
                            </div>
                        </div>

                        {/* LINKEDIN */}
                        <div className="teams-form-group">
                            <label htmlFor="team-linkedin">LinkedIn ID</label>
                            <input
                                id="team-linkedin"
                                type="url"
                                name="linkedIn"
                                placeholder="https://linkedin.com/in/..."
                                value={form.linkedIn}
                                onChange={handleChange}
                            />
                        </div>

                        {/* SUBSYSTEM */}
                        <div className="teams-form-group">
                            <label htmlFor="team-subsystem">Sub-system</label>
                            <select
                                id="team-subsystem"
                                name="subsystem"
                                value={form.subsystem}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select sub-system</option>
                                <option value="Aerodynamics">Aerodynamics</option>
                                <option value="Avionics">Avionics</option>
                                <option value="Propulsion">Propulsion</option>
                                <option value="Structures">Structures</option>
                                <option value="Recovery">Recovery</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* ROLE / POST */}
                        <div className="teams-form-group">
                            <label htmlFor="team-post">Post / Role</label>
                            <input
                                id="team-post"
                                type="text"
                                name="role"
                                placeholder="Eg. Team Lead"
                                value={form.role}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            className="teams-add-button"
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add Team Member'}
                        </button>
                    </form>
                </div>

                {/* TEAM MEMBERS LIST */}
                <div className="teams-members-card">
                    <div className="teams-members-header">
                        <h3>Team Members</h3>
                    </div>

                    {members.length === 0 ? (
                        <div className="teams-empty">
                            <div className="teams-empty-icon">👤</div>
                            <h4>No team members yet</h4>
                            <p>Add your first team member using the form.</p>
                        </div>
                    ) : (
                        <div className="teams-members-list">
                            {members.map((member) => {
                                const memberId = member._id || member.id;
                                const photoUrl = getImageUrl(member.image || member.photo);

                                return (
                                    <div className="teams-member" key={memberId}>
                                        {/* PHOTO */}
                                        <img
                                            src={photoUrl || 'https://via.placeholder.com/150'}
                                            alt={member.name}
                                            className="teams-member-photo"
                                        />

                                        {/* DETAILS */}
                                        <div className="teams-member-details">
                                            <h4>{member.name}</h4>
                                            <p>{member.role || member.post}</p>
                                            <span>{member.subsystem}</span>
                                        </div>

                                        {/* LINKEDIN */}
                                        <div className="teams-member-linkedin">
                                            {(member.linkedIn || member.linkedin) ? (
                                                <a
                                                    href={member.linkedIn || member.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    View Profile ↗
                                                </a>
                                            ) : (
                                                <span>No LinkedIn</span>
                                            )}
                                        </div>

                                        {/* DELETE */}
                                        <button
                                            type="button"
                                            className="teams-delete-button"
                                            onClick={() => handleDelete(memberId)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default TeamsTab;