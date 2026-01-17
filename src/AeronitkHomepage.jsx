import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import './AeronitkHomepage.css';
import aboutDrone from './images/drone.png';

import plane1 from './images/plane1.png';
import plane2 from './images/plane2.png';
import plane3 from './images/plane3.png';
import dronePic from './images/drone-pic.png';
import UltimateCarousel from './components/UltimateCarousel.jsx';
import contactus from './images/contactus.webp'
import Footer from './components/footer.jsx';
import BlurText from "./components/effects/bt.jsx";
import Timeline from './components/Timeline.jsx';

const AeroNITKHomepage = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (isHomePage) {
      document.body.classList.add('homepage');
    } else {
      document.body.classList.remove('homepage');
    }
    return () => {
      document.body.classList.remove('homepage');
    };
  }, [isHomePage]);



  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

  return (
    <div className="page-wrapper">

      <section className="hero-section" id="home">
        <div className="hero-container">
          {/* Main Animated Title */}
          <div className="hero-title-wrapper">
            <BlurText
              text="AERO NITK"
              className="hero-title"
              delay={150}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleAnimationComplete}
            />
          </div>

          {/* Static Subtitle */}
          <p className="hero-subtitle">WINGS OF TEAM WORK</p>
        </div>


      </section>

      <section className="about-section" id="about">
        <div className="about-content">
          <div className="about-text">
            <h2>ABOUT</h2>
            <p>
              Aero NITK is the official aeromodelling and aviation-focused student team of NITK Surathkal. As a student initiative supported by the institute, we design, analyze, and build RC planes, UAVs, and autonomous drones, combining creativity with engineering precision.
            </p>
            <Link to="/about" className="learn-more-btn">Learn More</Link>
          </div>
          <div className="about-image">
            <img src={aboutDrone} alt="Aero NITK Drone" />
          </div>
        </div>
      </section>

      <section className="carousel-section">
        <UltimateCarousel />
        <Timeline />
      </section>
      <section className="pre-contact-image" style={{ width: '100%', textAlign: 'center' }}>
        <img
          src={contactus}
          alt="Pre-contact decoration"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </section>

      <section className="contact-section" id="contact">
        <img src={plane1} className="contact-img plane-top-left" alt="Plane Top Left" />
        <img src={dronePic} className="contact-img drone-bottom-left" alt="Drone Bottom Left" />
        <img src={plane2} className="contact-img plane-top-right" alt="Plane Top Right" />
        <img src={plane3} className="contact-img plane-bottom-right" alt="Plane Bottom Right" />

        <div className="contact-card">

          <h4>Contact us</h4>
          <h2>GET IN TOUCH</h2>
          <form className="contact-form" onSubmit={e => { e.preventDefault(); alert("Submitted!"); }}>
            <div className="form-row">
              <div className="input-group">
                <label>First name</label>
                <input type="text" placeholder="First name" required />
              </div>
              <div className="input-group">
                <label>Last name</label>
                <input type="text" placeholder="Last name" required />
              </div>
            </div>
            <div className="input-group">
              <label>Email</label>
              <input type="email" placeholder="you@company.com" required />
            </div>
            <div className="input-group">
              <label>Message</label>
              <textarea rows={4} required />
            </div>
            <button type="submit" className="submit-btn">SUBMIT</button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AeroNITKHomepage;