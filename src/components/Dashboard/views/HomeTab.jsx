import React from 'react';
import Icon from '../components/Icon.jsx';
import { statDefinitions, quickActions } from '../../dashboardData.js';

/**
 * Home tab — stat cards grid and quick actions grid.
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
    return (
        <>
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
                            <strong className={regLoading && item.key !== 'activeEvents' || eventsLoading && item.key === 'activeEvents' ? 'admin-dashboard-loading-value' : ''}>{value}</strong>
                            <span>{item.label}</span>
                        </article>
                    );
                })}
            </div>

            <div className="admin-dashboard-quick-actions">
                <h3>Quick Actions</h3>
                <div className="admin-dashboard-actions-grid">
                    <button type="button" className="admin-dashboard-action-card admin-dashboard-action-button tone-green" onClick={onAddEvent}>
                        <Icon type="plus" />
                        <h4>{quickActions[0].title}</h4>
                        <p>{quickActions[0].description}</p>
                    </button>

                    {quickActions.slice(1).map((action) => (
                        <article key={action.title} className={`admin-dashboard-action-card tone-${action.tone}`}>
                            <Icon type={action.icon === 'users' ? 'users-action' : action.icon} />
                            <h4>{action.title}</h4>
                            <p>{action.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </>
    );
}

export default HomeTab;
