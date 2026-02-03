import React from 'react';
import './Popup.css';

const Popup = ({ open, onClose, children, className = '' }) => {
    if (!open) return null;
    return (
        <div className={`popup-overlay ${className}`} role="dialog" aria-modal="true">
            <div className="popup-card">
                <button className="popup-close" onClick={onClose} aria-label="Close">×</button>
                <div className="popup-body">{children}</div>
            </div>
        </div>
    );
};

export default Popup;