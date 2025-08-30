import React, { useState } from 'react';
import linkedInLogo from '../images/linkedIn_logo.png';
import './Team.css';

const teamHeads = [
  {
    name: 'Bhimu D',
    role: 'Convenor',
    image: '', // Add image URL here
    linkedIn: '',
  },
  {
    name: 'Lavanya',
    role: 'Captain',
    image: '',
    linkedIn: '',
  },
  {
    name: 'Rahul',
    role: 'President',
    image: '',
    linkedIn: '',
  },
  {
    name: 'Head 4',
    role: 'Role 4',
    image: '',
    linkedIn: '',
  },
];

const subsystems = [
  {
    name: 'Web Team',
    members: [
      { name: 'Web Member 1', role: 'Web Role', image: '', linkedIn: '' },
    ],
  },
  {
    name: 'Avionics',
    members: [
      { name: 'Avionics Member 1', role: 'Avionics Role', image: '', linkedIn: '' },
    ],
  },
  {
    name: 'Structures',
    members: [
      { name: 'Structures Member 1', role: 'Structures Role', image: '', linkedIn: '' },
    ],
  },
  {
    name: 'Aerodynamics',
    members: [
      { name: 'Aerodynamics Member 1', role: 'Aerodynamics Role', image: '', linkedIn: '' },
    ],
  },
  {
    name: 'Marketing',
    members: [
      { name: 'Marketing Member 1', role: 'Marketing Role', image: '', linkedIn: '' },
    ],
  },
  {
    name: 'Media',
    members: [
      { name: 'Media Member 1', role: 'Media Role', image: '', linkedIn: '' },
    ],
  },
  {
    name: 'Flight Simulator',
    members: [
      { name: 'Flight Simulator Member 1', role: 'Flight Simulator Role', image: '', linkedIn: '' },
    ],
  },
];

const Team = () => {
  const [openSubsystems, setOpenSubsystems] = useState({});

  const toggleSubsystem = (index) => {
    setOpenSubsystems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <section className="team-section">
      <h2>TEAM HEADS</h2>
      <div className="team-heads">
        <div className="team-grid">
          {teamHeads.map(({ name, role, image, linkedIn }, idx) => (
            <div className="team-member" key={`head-${idx}`} style={{ '--delay': idx }}>
              <img
                src={image || 'https://via.placeholder.com/140'}
                alt={name}
                className="team-photo"
              />
              <h3>{name}</h3>
              <p>{role}</p>
              {linkedIn && (
                <a
                  href={linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="linkedin-link"
                >
                  <img src={linkedInLogo} alt="LinkedIn" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Subsystems */}
      {subsystems.map(({ name, members }, idx) => (
        <div
          key={`subsystem-${idx}`}
          className="subsystem-container"
        >
          <button
            onClick={() => toggleSubsystem(idx)}
            className={`subsystem-toggle ${openSubsystems[idx] ? 'open' : ''}`}
          >
            {name}
            <span className="arrow">{openSubsystems[idx] ? '▲' : '▼'}</span>
          </button>
          {openSubsystems[idx] && (
            <div className="team-grid subsystem-members">
              {members.map(({ name, role, image, linkedIn }, subIdx) => (
                <div
                  className="team-member"
                  key={`member-${idx}-${subIdx}`}
                  style={{ '--delay': subIdx }}
                >
                  <img
                    src={image || 'https://via.placeholder.com/140'}
                    alt={name}
                    className="team-photo"
                  />
                  <h3>{name}</h3>
                  <p>{role}</p>
                  {linkedIn && (
                    <a
                      href={linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="linkedin-link"
                    >
                      <img src={linkedInLogo} alt="LinkedIn" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default Team;
