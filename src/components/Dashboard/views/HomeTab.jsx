import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLinkedin, FaUserCircle, FaPlus, FaExternalLinkAlt, FaGraduationCap } from 'react-icons/fa';
import Icon from '../components/Icon.jsx';
import { statDefinitions, quickActions } from '../../dashboardData.js';
import {
    getStoredAlumni,
    addAlumni,
    ALUMNI_UPDATED_EVENT,
    initialBatchCovers
} from '../../../data/alumniData.js';
import AlumniModal from '../components/AlumniModal.jsx';

/**
 * Home tab — stat cards grid, quick actions grid, and Alumni Spotlight section.
 *
 * @param {{
 *   events: Array,
 *   eventsLoading: boolean,
 *   regCounts: Object|null,
 *   regLoading: boolean,
 *   onAddEvent: () => void,
 * }} props
 */
function HomeTab({ events, eventsLoading, regCounts, regLoading, onAddEvent }) {
    const navigate = useNavigate();
    const [alumniData, setAlumniData] = useState(getStoredAlumni);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        const handleUpdate = () => {
            setAlumniData(getStoredAlumni());
        };
        window.addEventListener(ALUMNI_UPDATED_EVENT, handleUpdate);
        window.addEventListener('storage', handleUpdate);
        return () => {
            window.removeEventListener(ALUMNI_UPDATED_EVENT, handleUpdate);
            window.removeEventListener('storage', handleUpdate);
        };
    }, []);

    const batches = useMemo(() => {
        return Object.keys(alumniData).sort((a, b) => b.localeCompare(a));
    }, [alumniData]);

    const totalAlumniCount = useMemo(() => {
        let count = 0;
        batches.forEach(b => {
            count += (alumniData[b] || []).length;
        });
        return count;
    }, [alumniData, batches]);

    // Get 6 featured alumni across batches
    const featuredAlumni = useMemo(() => {
        const list = [];
        batches.forEach(b => {
            (alumniData[b] || []).forEach(m => {
                list.push({ ...m, batch: b });
            });
        });
        return list.slice(0, 6);
    }, [alumniData, batches]);

    const handleSaveAlumni = (memberData) => {
        addAlumni(memberData);
        setAlumniData(getStoredAlumni());
    };

    return (
        <>
            {/* Top Stat Cards */}
            <div className="admin-dashboard-stats">
                {statDefinitions.map((item) => {
                    let value;
                    if (item.key === 'activeEvents') {
                        value = eventsLoading ? '—' : String(events.filter(e => e.statusTone === 'open').length);
                    } else {
                        value = regLoading
                            ? '—'
                            : regCounts
                                ? String(regCounts[item.key] ?? 0)
                                : '—';
                    }

                    return (
                        <article key={item.key} className={`admin-dashboard-stat-card tone-${item.tone}`}>
                            <Icon type={item.icon} />
                            <strong className={(regLoading && item.key !== 'activeEvents') || (eventsLoading && item.key === 'activeEvents') ? 'admin-dashboard-loading-value' : ''}>{value}</strong>
                            <span>{item.label}</span>
                        </article>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="admin-dashboard-quick-actions">
                <h3>Quick Actions</h3>
                <div className="admin-dashboard-actions-grid">
                    <button type="button" className="admin-dashboard-action-card admin-dashboard-action-button tone-green" onClick={onAddEvent}>
                        <Icon type="plus" />
                        <h4>{quickActions[0].title}</h4>
                        <p>{quickActions[0].description}</p>
                    </button>

                    <button
                        type="button"
                        className="admin-dashboard-action-card admin-dashboard-action-button tone-red"
                        onClick={() => navigate('/dashboard/registrations')}
                    >
                        <Icon type="users-action" />
                        <h4>{quickActions[1].title}</h4>
                        <p>{quickActions[1].description}</p>
                    </button>

                    <button
                        type="button"
                        className="admin-dashboard-action-card admin-dashboard-action-button tone-purple"
                        onClick={() => navigate('/dashboard/alumni')}
                    >
                        <FaGraduationCap style={{ width: '38px', height: '38px', color: '#b98eff', marginBottom: '8px' }} />
                        <h4>Manage Alumni</h4>
                        <p>Add, edit or explore alumni directory</p>
                    </button>

                    <article className="admin-dashboard-action-card tone-gold">
                        <Icon type="mail" />
                        <h4>{quickActions[3].title}</h4>
                        <p>{quickActions[3].description}</p>
                    </article>
                </div>
            </div>

            {/* Dedicated Alumni Section */}
            <div className="admin-dashboard-section admin-dashboard-home-alumni-section">
                <div className="admin-dashboard-section-header">
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <h3 className="admin-dashboard-section-title" style={{ margin: 0, padding: 0, border: 'none' }}>
                                Alumni Network & Batches
                            </h3>
                            <span className="admin-dashboard-alumni-count-pill">
                                {totalAlumniCount} Alumni • {batches.length} Batches
                            </span>
                        </div>
                        <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                            Our pride and heritage. High-level overview of graduated members and batch profiles.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button
                            type="button"
                            className="admin-dashboard-add-btn"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <FaPlus style={{ marginRight: '6px' }} />
                            Add Alumni
                        </button>
                        <button
                            type="button"
                            className="admin-dashboard-alumni-secondary-btn"
                            onClick={() => navigate('/dashboard/alumni')}
                        >
                            Full Directory →
                        </button>
                        <Link
                            to="/alumni"
                            className="admin-dashboard-alumni-link-btn"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <span>View All Alumni</span>
                            <FaExternalLinkAlt style={{ fontSize: '0.75rem' }} />
                        </Link>
                    </div>
                </div>

                {/* Batch Showcase Cards */}
                <div className="admin-dashboard-home-batch-cards">
                    {batches.map(batchKey => {
                        const count = (alumniData[batchKey] || []).length;
                        const cover = initialBatchCovers[batchKey] || initialBatchCovers['2025'];
                        return (
                            <div
                                key={batchKey}
                                className="admin-dashboard-home-batch-card"
                                onClick={() => navigate('/dashboard/alumni')}
                            >
                                <div
                                    className="admin-dashboard-home-batch-bg"
                                    style={{ backgroundImage: `url(${cover})` }}
                                >
                                    <div className="admin-dashboard-home-batch-overlay">
                                        <span className="admin-dashboard-home-batch-tag">Graduation Batch</span>
                                        <h4>Batch {batchKey}</h4>
                                        <p>{count} Active Alumni Records</p>
                                        <div className="admin-dashboard-home-batch-actions">
                                            <span className="admin-dashboard-home-batch-btn">
                                                Manage in Dashboard →
                                            </span>
                                            <Link
                                                to={`/alumni/${batchKey}`}
                                                className="admin-dashboard-home-batch-public-link"
                                                onClick={(e) => e.stopPropagation()}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Public View ↗
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Featured Alumni Showcase */}
                <div className="admin-dashboard-home-featured-wrap">
                    <div className="admin-dashboard-home-featured-header">
                        <h4>Recent Alumni Spotlight</h4>
                        <Link to="/dashboard/alumni" className="admin-dashboard-home-view-more">
                            View All ({totalAlumniCount}) →
                        </Link>
                    </div>

                    <div className="admin-dashboard-home-alumni-grid">
                        {featuredAlumni.map((member, idx) => (
                            <div key={member.id || idx} className="admin-dashboard-home-alumni-item">
                                <div className="admin-dashboard-home-alumni-avatar">
                                    {member.image ? (
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                if (e.currentTarget.nextSibling) {
                                                    e.currentTarget.nextSibling.style.display = 'block';
                                                }
                                            }}
                                        />
                                    ) : null}
                                    <FaUserCircle
                                        className="admin-dashboard-alumni-avatar-fallback"
                                        style={{ display: member.image ? 'none' : 'block' }}
                                    />
                                </div>
                                <div className="admin-dashboard-home-alumni-info">
                                    <strong className="admin-dashboard-home-alumni-name">{member.name}</strong>
                                    <div className="admin-dashboard-home-alumni-meta">
                                        <span className="admin-dashboard-home-alumni-badge">Batch {member.batch}</span>
                                        {member.linkedin && (
                                            <a
                                                href={member.linkedin}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="admin-dashboard-home-alumni-linkedin"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <FaLinkedin />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Add Alumni Modal */}
            <AlumniModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleSaveAlumni}
                availableBatches={batches}
            />
        </>
    );
}

export default HomeTab;
