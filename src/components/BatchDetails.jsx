import React from 'react';
import { useParams } from 'react-router-dom';
import './BatchDetails.css';
import Footer from './footer.jsx';
import linkedInLogo from '../images/linkedIn_logo.png';

const alumniData = {
    "2024": [
        {
            name: "Aryan Bokolia",
            role: "Web Developer",
            image: null,
            linkedIn: "https://www.linkedin.com/in/aryan-bokolia-365aa4326"
        },
    ],
    "2023": [
        {
            name: "MEMBER NAME",
            role: "MEMBER ROLE",
            image: null,
            linkedIn: "LINKEDIN_URL_HERE"
        }
    ]
};

const BatchDetails = () => {
    const { year } = useParams();
    const members = alumniData[year] || [];

    return (
        <div className="batch-page-bg">
            <div className="batch-main-container">
                <h1 className="batch-header-text">ALUMNI BATCH - {year}</h1>

                <div className="batch-members-grid">
                    {members.map((m, i) => (
                        <div key={i} className="batch-member-card">
                            <div className="batch-profile-circle">
                                {m.image ? <img src={m.image} alt={m.name} /> : <div className="batch-placeholder-circle" />}
                            </div>
                            <h3 className="batch-member-name">{m.name}</h3>
                            <p className="batch-member-role">{m.role}</p>

                            {m.linkedIn && (
                                <a href={m.linkedIn} target="_blank" rel="noreferrer" className="batch-linkedin-link">
                                    <img src={linkedInLogo} alt="LinkedIn" className="batch-linkedin-icon" />
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default BatchDetails;