// File: src/components/Team.jsx

import React from 'react';
import linkedInLogo from '../images/linkedIn_logo.png'; // LinkedIn icon image
import './Team.css';

const teamHeads = [
  {
    name: 'Bhimu D',
    role: 'Convenor',
    image: '',
    linkedIn: ' ',
  },
  {
    name: 'Lavanya',
    role: 'Captain',
    image: ' ',
    linkedIn: ' ',
  },
  {
    name: 'Rahul',
    role: 'President',
    image: ' ',
    linkedIn: ' ',
  },
  // Add more heads as needed
];

const Team = () => {
  return (
    <section className="team-section">
      <h2>TEAM HEADS</h2>
      <div className="team-grid">
        {teamHeads.map(({ name, role, image, linkedIn }, idx) => (
          <div key={idx} className="team-member" style={{ '--delay': idx }}>
            <img src={image} alt={`${name} profile`} className="team-photo" />
            <h3>{name}</h3>
            <p>{role}</p>
            <a
              href={linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="linkedin-link"
              aria-label={`LinkedIn profile of ${name}`}
            >
              <img src={linkedInLogo} alt="LinkedIn Logo" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Team;