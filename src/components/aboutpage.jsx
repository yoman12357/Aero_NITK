import React, { useEffect } from 'react';
import './aboutpage.css';
import Header from './header';
import Footer from './footer.jsx'; // Using the updated footer we made

const AboutPage = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = document.querySelectorAll('.section-block');
    elements.forEach(el => observer.observe(el));

    return () => elements.forEach(el => observer.unobserve(el));
  }, []);

  return (
    <div className="about-page-wrapper">
      <Header />

      <section className="about-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>
              AERO NITK : WINGS OF <span className="highlight">INNOVATION</span>
            </h1>
            <p>
              We Are The Official Aeromodelling Club Of NITK Surathkal, Dedicated To Designing, Building, And Flying Competitive Unmanned Aerial Vehicles (UAVs).
            </p>
          </div>
        </div>
      </section>

      <div className="about-page-container">
        <section className="about-content-section">
          <div className="section-block">
            <h2>Our Mission</h2>
            <p>Our goal is to foster a culture of technical excellence and innovation in aerospace technology. We strive to provide students with hands-on experience in the entire engineering life cycle, from conceptual design to manufacturing and testing.</p>
          </div>

          <div className="section-block">
            <h2>Core Projects & Disciplines</h2>
            <ol className="styled-list">
              <li><strong>Aerodynamics:</strong> Utilizing CFD software and wind tunnel analysis to optimize flight performance.</li>
              <li><strong>Structures:</strong> Focusing on lightweight and robust design using composites and advanced materials.</li>
              <li><strong>Avionics:</strong> Implementing complex flight control systems, telemetry, and sensor integration.</li>
              <li><strong>Manufacturing:</strong> Precision fabrication using 3D printing, CNC machining, and composite layups.</li>
            </ol>
          </div>

          <div className="section-block">
            <h2>Achievements</h2>
            <p>Over the years, Aero NITK has consistently achieved top ranks in national and international competitions, showcasing our dedication and skill.</p>
            <ul className="styled-list">
              <li>Placed in the top 5 at SAE Aero Design West/East.</li>
              <li>Winners of various national-level drone and RC competitions.</li>
              <li>Strong track record in developing custom UAV solutions for industrial challenges.</li>
            </ul>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;