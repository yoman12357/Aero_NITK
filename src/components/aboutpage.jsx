import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './aboutpage.css';


import logoImage from '../images/Aero_NITK_logo.png';
import instagramLogo from '../images/instagram_logo.png';
import youtubeLogo from '../images/youtube_logo.png';
import linkedInLogo from '../images/linkedIn_logo.png';
import Header from './header';

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
      {
        threshold: 0.2,
      }
    );

    const elements = document.querySelectorAll('.section-block');
    elements.forEach(el => observer.observe(el));

    return () => elements.forEach(el => observer.unobserve(el));
  }, []);

  return (
    <>
      <Header></Header>

      <div className="about-page-container">
        <header className="about-hero">
          <h1>AERO NITK: WINGS OF INNOVATION</h1>
          <p>We are the official aeromodelling club of NITK Surathkal, dedicated to designing, building, and flying competitive unmanned aerial vehicles (UAVs).</p>
        </header>

        <section className="about-content-section">

          <div className="section-block" data-animation-delay="0.1s">
            <h2>Our Mission</h2>
            <p>Our goal is to foster a culture of technical excellence and innovation in aerospace technology. We strive to provide students with hands-on experience in the entire engineering life cycle, from conceptual design to manufacturing and testing.</p>
          </div>

          <div className="section-block" data-animation-delay="0.3s">
            <h2>Core Projects & Disciplines</h2>
            <ol>
              <li>Aerodynamics: Utilizing CFD software and wind tunnel analysis to optimize flight performance.</li>
              <li>Structures: Focusing on lightweight and robust design using composites and advanced materials.</li>
              <li>Avionics: Implementing complex flight control systems, telemetry, and sensor integration.</li>
              <li>Manufacturing: Precision fabrication using 3D printing, CNC machining, and composite layups.</li>
            </ol>
          </div>

          <div className="section-block" data-animation-delay="0.5s">
            <h2>Achievements</h2>
            <p>Over the years, Aero NITK has consistently achieved top ranks in national and international competitions, showcasing our dedication and skill.</p>
            <ol>
              <li>Placed in the top 5 at SAE Aero Design West/East.</li>
              <li>Winners of various national-level drone and RC competitions.</li>
              <li>Strong track record in developing custom UAV solutions for industrial challenges.</li>
            </ol>
          </div>
        </section>
      </div>

      <footer className="footer">
        <div className="footer-row">
          <img src={logoImage} alt="Aero NITK Logo" className="footer-logo" />
          <div className="footer-icons">
            <a href="https://www.instagram.com/aeronitk/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <img src={instagramLogo} alt="Instagram" className="social-icon" />
            </a>
            <a href="https://www.youtube.com/@AeroNITK" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <img src={youtubeLogo} alt="YouTube" className="social-icon" />
            </a>
            <a href="https://www.linkedin.com/company/aero-nitk" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <img src={linkedInLogo} alt="LinkedIn" className="social-icon" />
            </a>
          </div>
        </div>
        <div className="footer-credit">
          © 2025 Aero NITK | Built with <span style={{ color: '#3490eb' }}>💙</span> by Web Team , AeroNITK
        </div>
      </footer>
    </>
  );
};

export default AboutPage;