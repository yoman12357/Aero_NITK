// about page in the header
import React, { useEffect } from 'react';
import './aboutpage.css';
import Footer from './footer.jsx';
import { Helmet } from 'react-helmet-async';

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
      <Helmet>
        <title>About Us | Aero NITK</title>
        <meta
          name="description"
          content="Learn about Aero NITK, the official aeromodelling and drone development club of NITK Surathkal."
        />
        <link rel="canonical" href="https://aeronitk.in/about" />
      </Helmet>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>
              AERONITK : WINGS OF <span className="highlight">INNOVATION</span>
            </h1>
            <p>
              AeroNITK is the official aeromodelling and drone development club
              of NITK Surathkal. Founded in 2018, we are a multidisciplinary
              team of undergraduates who design, build, and fly radio-controlled
              aircraft and autonomous drones from scratch, competing against IITs,
              NITs, and top engineering colleges across India.
            </p>
          </div>
        </div>
      </section>

      <div className="about-page-container">

        {/* About Us */}
        <section className="about-content-section">
          <div className="section-block">
            <h2>About Us</h2>

            <p>
              AeroNITK is the official aeromodelling and drone development club
              of NITK Surathkal. Founded in 2018, we are a multidisciplinary
              team of undergraduates who design, build, and fly radio-controlled
              aircraft and autonomous drones from scratch, competing against IITs,
              NITs, and top engineering colleges across India.
            </p>

            {/* Stats */}
            <div className="about-stats">
              <div className="stat-item">
                <h3>8+</h3>
                <p>Years</p>
              </div>

              <div className="stat-item">
                <h3>75+</h3>
                <p>Active Members</p>
              </div>

              <div className="stat-item">
                <h3>15+</h3>
                <p>UAVs Developed</p>
              </div>

              <div className="stat-item">
                <h3>5+</h3>
                <p>Competitions</p>
              </div>
            </div>
          </div>

          {/* Competitions and Events */}
          <div className="section-block">
            <h2>Competitions and Events</h2>

            <div className="competition-table">
              <div className="competition-row competition-header">
                <div>Competition / Event</div>
                <div>Organizer</div>
              </div>

              <div className="competition-row">
                <div>
                  SAE Drone Development Challenge (SAE-DDC)
                </div>
                <div>
                  SAE Southern India Section
                </div>
              </div>

              <div className="competition-row">
                <div>
                  Autonomous Drone Development Challenge (SAE-ADDC)
                </div>
                <div>
                  SAE Southern India Section
                </div>
              </div>

              <div className="competition-row">
                <div>
                  Boeing National Aeromodelling Competition
                </div>
                <div>
                  IIT Madras
                </div>
              </div>

              <div className="competition-row">
                <div>
                  National Aeromodelling Competition
                </div>
                <div>
                  IIT Bombay TechFest
                </div>
              </div>

              <div className="competition-row">
                <div>
                  SAE Aerothon, Track 2: VTOL
                </div>
                <div>
                  SAE Southern India Section
                </div>
              </div>
            </div>

            <div className="event-highlights">
              <p>
                <strong>Wright Flight:</strong> Organisers of the Wright flight
                event in NITK's techfest Engineer.
              </p>

              <p>
                <strong>Boeing Workshop:</strong> Organised the Boeing-sponsored
                workshop for students to provide hands-on experience in RC plane
                building.
              </p>
            </div>
          </div>

          {/* Technical Disciplines */}
          <div className="section-block">
            <h2>Technical Disciplines</h2>

            <div className="discipline-grid">

              <div className="discipline-card">
                <h3>Aerodynamics</h3>
                <p>
                  Conceptual aircraft design, stability analysis, CFD, and
                  wind-tunnel testing to optimize aerodynamic performance.
                </p>
              </div>

              <div className="discipline-card">
                <h3>Structures</h3>
                <p>
                  Design and analysis of lightweight, high-rigidity airframes
                  using advanced materials and composites for an optimal
                  strength-to-weight ratio.
                </p>
              </div>

              <div className="discipline-card">
                <h3>Avionics</h3>
                <p>
                  Development of flight-control, sensing, telemetry, and
                  autonomous UAV systems using automation, image processing,
                  and machine learning.
                </p>
              </div>

              <div className="discipline-card">
                <h3>Manufacturing</h3>
                <p>
                  Fabrication and assembly of aircraft components using 3D
                  printing, laser cutting, CNC machining, and other precision
                  manufacturing processes.
                </p>
              </div>

            </div>
          </div>

          {/* Achievements */}
          <div className="section-block">
            <h2>Achievements</h2>

            <div className="achievement-list">

              <div className="achievement-item">
                <h3>
                  IIT Bombay National Aeromodelling Competition – Techfest
                </h3>
                <p>
                  <strong>Participation:</strong> 200+ teams across India
                </p>
                <p>
                  <strong>Result:</strong> Runner-up
                </p>
              </div>

              <div className="achievement-item">
                <h3>
                  SAE – Drone Development Challenge (SAE-DDC), 2024–25
                </h3>
                <p>
                  <strong>Participation:</strong> 65+ teams
                </p>
                <ul className="styled-list">
                  <li>2nd – Best Aerodynamics & CFD Analysis</li>
                  <li>2nd – Overall Drag Performance</li>
                  <li>5th – Most Innovative</li>
                  <li>9th – Endurance (90 min)</li>
                </ul>
              </div>

              <div className="achievement-item">
                <h3>
                  SAE India – Autonomous Drone Development Challenge
                  (SAE-ADDC), 2025–26
                </h3>
                <p>
                  <strong>Participation:</strong> 60+ teams
                </p>
                <p>
                  <strong>Result:</strong> 3rd place for Payload Design
                </p>
              </div>

              <div className="achievement-item">
                <h3>
                  RC Plane Flying Competition – JNNCE, Shivamogga
                </h3>
                <p>
                  Two teams from our club participated, bagging 1st and 2nd
                  prize.
                </p>
              </div>

            </div>
          </div>

        </section>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;