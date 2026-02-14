import React from 'react';
import './Popup.css';

const Popup = ({ open, onClose, children, className = '', containerStyle = {} }) => {
    if (!open) return null;

    const isWorkshop = className.includes('workshop-popup');

    if (isWorkshop) {
        return (
            <div
                className={`workshop-popup-overlay ${className}`}
                role="dialog"
                aria-modal="true"
                onClick={(e) => {
                    if (e.target === e.currentTarget && !className.includes('workshop-popup-bottom-right')) onClose();
                }}
            >
                <div
                    className={`workshop-popup-container ${className}`}
                    style={containerStyle}
                >
                    <button className="workshop-close-btn" onClick={onClose} aria-label="Close">×</button>
                    <div className="workshop-popup-content">{children}</div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`popup-overlay ${className}`}
            role="dialog"
            aria-modal="true"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="popup-card" style={containerStyle}>
                <button className="popup-close" onClick={onClose} aria-label="Close">×</button>
                <div className="popup-body">{children}</div>
            </div>
        </div>
    );
};

export default Popup;