import React from 'react';
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
                                    <td className="admin-dashboard-reg-time">{formatRelativeTime(reg.submittedAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default RegistrationsTab;
