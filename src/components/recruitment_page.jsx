import React from 'react';
import './recruitment_page.css'; // Corrected import to match file name

const Recruitment = () => {
  return (
    <section className="recruitment-section">
      <div className="recruitment-card">
        <h2>JOIN OUR TEAM</h2>
        <p className="recruitment-intro">
          Are you passionate about aviation, drones, and aeromodelling? Aero NITK is looking for enthusiastic and dedicated students to join our team!
        </p>
        
        <div className="recruitment-content">
          <div className="recruitment-col">
            <h3>WHAT WE DO</h3>
            <ul>
              <li>Design, build, and fly RC planes and UAVs.</li>
              <li>Compete in national and international aeromodelling competitions.</li>
              <li>Conduct research and development in aeronautical engineering.</li>
              <li>Organize workshops and events to share our knowledge.</li>
            </ul>
          </div>
          
          <div className="recruitment-col">
            <h3>WHAT WE'RE LOOKING FOR</h3>
            <ul>
              <li>Passion for aviation and engineering.</li>
              <li>A curious and creative mindset.</li>
              <li>Willingness to learn and work in a team.</li>
              <li>Problem-solving skills and a strong work ethic.</li>
            </ul>
          </div>
        </div>
        
        <a href="......................." target="_blank" rel="noopener noreferrer" className="apply-btn">
          APPLY NOW
        </a>
      </div>
    </section>
  );
};

export default Recruitment;