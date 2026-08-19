import React, { useState } from 'react';
import './TeamsTab.css';

function TeamsTab() {
    const [members, setMembers] = useState([]);

    const [form, setForm] = useState({
        name: '',
        linkedin: '',
        subsystem: '',
        post: '',
    });

    const [photoPreview, setPhotoPreview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
        setPhotoPreview(null);
        return;
    }

    if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        e.target.value = '';
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {
        setPhotoPreview(reader.result);
    };

    reader.onerror = () => {
        console.error('Could not read image');
        setPhotoPreview(null);
    };

    reader.readAsDataURL(file);
};

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!photoPreview) {
            alert('Please select a photo.');
            return;
        }

        const newMember = {
            id: Date.now(),
            name: form.name,
            linkedin: form.linkedin,
            subsystem: form.subsystem,
            post: form.post,
            photo: photoPreview,
        };

        setMembers((prev) => [...prev, newMember]);

        // Reset form
        setForm({
            name: '',
            linkedin: '',
            subsystem: '',
            post: '',
        });

        setPhotoPreview(null);

        // Reset the file input
        e.target.reset();
    };

    const handleDelete = (id) => {
        setMembers((prev) =>
            prev.filter((member) => member.id !== id)
        );
    };

    return (
        <div className="teams-tab">

            {/* HEADER */}
            <div className="teams-tab-header">

                <div>
                    <h2>Team Members</h2>

                    <p>
                        Add and manage members of the Aero NITK team.
                    </p>
                </div>

                <div className="teams-count">
                    {members.length} Members
                </div>

            </div>


            <div className="teams-layout">

                {/* =========================
                    ADD MEMBER FORM
                ========================== */}

                <div className="teams-form-card">

                    <h3>Add Team Member</h3>

                    <form onSubmit={handleSubmit}>

                        {/* NAME */}

                        <div className="teams-form-group">

                            <label htmlFor="team-name">
                                Name
                            </label>

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

                            <label htmlFor="team-photo">
                                Photo
                            </label>

                            <div className="teams-photo-upload">

                                {photoPreview ? (
                                    <img
                                    src={photoPreview}
                                    alt="Selected team member"
                                    className="teams-photo-preview"
                                    onError={(e) => {
                                        console.error('Image failed to load:', photoPreview);
                                        e.currentTarget.style.display = 'none';
                                    }}
/>
                                ) : (
                                    <div className="teams-photo-placeholder">

                                        <span>+</span>

                                        <p>
                                            Upload Photo
                                        </p>

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

                            <label htmlFor="team-linkedin">
                                LinkedIn ID
                            </label>

                            <input
                                id="team-linkedin"
                                type="url"
                                name="linkedin"
                                placeholder="https://linkedin.com/in/..."
                                value={form.linkedin}
                                onChange={handleChange}
                            />

                        </div>


                        {/* SUBSYSTEM */}

                        <div className="teams-form-group">

                            <label htmlFor="team-subsystem">
                                Sub-system
                            </label>

                            <select
                                id="team-subsystem"
                                name="subsystem"
                                value={form.subsystem}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select sub-system
                                </option>

                                <option value="Aerodynamics">
                                    Aerodynamics
                                </option>

                                <option value="Avionics">
                                    Avionics
                                </option>

                                <option value="Propulsion">
                                    Propulsion
                                </option>

                                <option value="Structures">
                                    Structures
                                </option>

                                <option value="Recovery">
                                    Recovery
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>


                        {/* POST */}

                        <div className="teams-form-group">

                            <label htmlFor="team-post">
                                Post
                            </label>

                            <input
                                id="team-post"
                                type="text"
                                name="post"
                                placeholder="Eg. Team Lead"
                                value={form.post}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* BUTTON */}

                        <button
                            type="submit"
                            className="teams-add-button"
                        >
                            Add Team Member
                        </button>

                    </form>

                </div>


                {/* =========================
                    TEAM MEMBERS
                ========================== */}

                <div className="teams-members-card">

                    <div className="teams-members-header">

                        <h3>
                            Team Members
                        </h3>

                    </div>


                    {members.length === 0 ? (

                        <div className="teams-empty">

                            <div className="teams-empty-icon">
                                👤
                            </div>

                            <h4>
                                No team members yet
                            </h4>

                            <p>
                                Add your first team member using
                                the form.
                            </p>

                        </div>

                    ) : (

                        <div className="teams-members-list">

                            {members.map((member) => (

                                <div
                                    className="teams-member"
                                    key={member.id}
                                >

                                    {/* PHOTO */}

                                    <img
                                        src={member.photo}
                                        alt={member.name}
                                        className="teams-member-photo"
                                    />


                                    {/* DETAILS */}

                                    <div className="teams-member-details">

                                        <h4>
                                            {member.name}
                                        </h4>

                                        <p>
                                            {member.post}
                                        </p>

                                        <span>
                                            {member.subsystem}
                                        </span>

                                    </div>


                                    {/* LINKEDIN */}

                                    <div className="teams-member-linkedin">

                                        {member.linkedin ? (
                                            <a
                                                href={member.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View Profile ↗
                                            </a>
                                        ) : (
                                            <span>
                                                No LinkedIn
                                            </span>
                                        )}

                                    </div>


                                    {/* DELETE */}

                                    <button
                                        type="button"
                                        className="teams-delete-button"
                                        onClick={() =>
                                            handleDelete(member.id)
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default TeamsTab;