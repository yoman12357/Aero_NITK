import React, { useState } from 'react';
import { formatRelativeTime } from '../services/registrationService.js';

/**
 * Registrations tab — displays recent registrations in a table.
 *
 * @param {{
 *   recentRegistrations: Array,
 *   regLoading: boolean,
 * }} props
 */
function RegistrationsTab({ recentRegistrations, regLoading }) {
    // The payment screenshot (stored as a base64 data URL directly on the
    // Firestore registration document — no Firebase Storage) is only opened
    // in a modal on click, rather than shown inline in every row, so the
    // table stays readable once there are many registrations.
    const [activeScreenshot, setActiveScreenshot] = useState(null); // { name, url } | null

    return (
        <div className="admin-dashboard-section">
            <h3 className="admin-dashboard-section-title">All Registrations</h3>

            {regLoading ? (
                <div className="admin-dashboard-reg-loading">Loading registrations…</div>
            ) : recentRegistrations.length === 0 ? (
                <div className="admin-dashboard-reg-empty">No registrations found yet.</div>
            ) : (
                <div className="admin-dashboard-reg-table-wrap">
                    <table className="admin-dashboard-reg-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Event</th>
                                <th>Branch</th>
                                <th>Roll No</th>
                                <th>Screenshot</th>
                                <th>Registered</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentRegistrations.map((reg) => (
                                <tr key={reg.id}>
                                    <td>{reg.name || '—'}</td>
                                    <td>
                                        <span className={`admin-dashboard-reg-badge ${reg.registrationType === 'workshop' ? 'badge-workshop' : 'badge-wright'}`}>
                                            {reg.registrationLabel || '—'}
                                        </span>
                                    </td>
                                    <td>{reg.branch || '—'}</td>
                                    <td className="admin-dashboard-reg-mono">{reg.rollNo || '—'}</td>
                                    <td>
                                        {reg.paymentScreenshot ? (
                                            <button
                                                type="button"
                                                className="admin-dashboard-reg-view-btn"
                                                onClick={() => setActiveScreenshot({
                                                    name: reg.name || 'Registration',
                                                    url: reg.paymentScreenshot
                                                })}
                                            >
                                                View
                                            </button>
                                        ) : (
                                            '—'
                                        )}
                                    </td>
                                    <td className="admin-dashboard-reg-time">{formatRelativeTime(reg.submittedAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeScreenshot && (
                <div
                    className="admin-dashboard-modal-backdrop"
                    onClick={() => setActiveScreenshot(null)}
                    role="presentation"
                >
                    <div
                        className="admin-dashboard-modal admin-dashboard-screenshot-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Payment screenshot — ${activeScreenshot.name}`}
                        onClick={(modalEvent) => modalEvent.stopPropagation()}
                    >
                        <div className="admin-dashboard-modal-header">
                            <div>
                                <p className="admin-dashboard-modal-kicker">Payment Proof</p>
                                <h3>{activeScreenshot.name}</h3>
                            </div>

                            <button
                                type="button"
                                className="admin-dashboard-modal-close"
                                onClick={() => setActiveScreenshot(null)}
                                aria-label="Close screenshot"
                            >
                                ×
                            </button>
                        </div>

                        <img
                            src={activeScreenshot.url}
                            alt={`Payment screenshot for ${activeScreenshot.name}`}
                            className="admin-dashboard-screenshot-image"
                        />

                        <div className="admin-dashboard-modal-actions">
                            <a
                                href={activeScreenshot.url}
                                download={`${activeScreenshot.name.replace(/\s+/g, '_')}_payment_screenshot.jpg`}
                                className="admin-dashboard-modal-secondary admin-dashboard-screenshot-download"
                            >
                                Download
                            </a>

                            <button
                                type="button"
                                className="admin-dashboard-modal-primary"
                                onClick={() => setActiveScreenshot(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RegistrationsTab;
