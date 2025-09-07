import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AeronitkHomepage.css';
import logoImage from './images/Aero_NITK_logo.png';
import planeImage from './images/planes.png';
import aboutDrone from './images/drone.png';
import dronesImage from './images/drones.png';
import Aeronitk from './images/Aeronitk.png';

import instagramLogo from './images/instagram_logo.png';
import youtubeLogo from './images/youtube_logo.png';
import linkedInLogo from './images/linkedIn_logo.png';

import plane1 from './images/plane1.png';
import plane2 from './images/plane2.png';
import plane3 from './images/plane3.png';
import dronePic from './images/drone-pic.png';
import UltimateCarousel from './components/UltimateCarousel.jsx';

const AeroNITKHomepage = () => {
    const [showScrollDown, setShowScrollDown] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollDown(window.scrollY <= 60);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="page-wrapper">

            <nav className="navbar">
                <img src={logoImage} alt="Aero NITK Logo" className="navbar-logo" />
                <div className="navbar-links">
                    <a href='#home'>HOME</a>
                    <a href='#about'>ABOUT</a>
                    <Link to="/gallery">GALLERY</Link>
                    <Link to="/team">TEAM</Link>
                    <Link to="/recruitment">RECRUITMENT</Link>
                    <Link to="/sponsors">SPONSORS</Link>
                    <a href='#contact'>CONTACT</a>
                </div>
            </nav>

            <section className="hero-section" id="home">
                <div className="hero-spline-bg">
                    <img src={Aeronitk} alt="Aero NITK Hero" />
                    {/* Removed spline-viewer component */}
                </div>
                {showScrollDown && (
                    <div className="scroll-down bounce-indicator">
                        SCROLL DOWN
                        <svg className="scroll-arrow" xmlns="http://www.w3.org/2000/svg"
                            width="24" height="24" viewBox="0 0 24 24"
                            fill="none" stroke="white" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <polyline points="19 12 12 19 5 12" />
                        </svg>
                    </div>
                )}
            </section>

            <section className="about-section" id="about">
                <div className="about-content">
                    <div className="about-text">
                        <h2>ABOUT</h2>
                        <p>
                            Aero NITK is the official aeromodelling and aviation-focused student team of NITK Surathkal.
                            <br />
                            We design, analyze, and build RC planes, UAVs, and autonomous drones, combining creativity with engineering precision.
                        </p>
                        <button className="learn-more-btn">Learn More</button>
                    </div>
                    <div className="about-image">
                        <img src={aboutDrone} alt="Aero NITK Drone" />
                    </div>
                </div>
            </section>

            <section className="projects-section" id="projects">
                <h2>PROJECTS</h2>
                <div className="projects-grid">
                    <div className="project-card">
                        <img src={planeImage} alt="Planes" />
                    </div>
                    <div className="project-card">
                        <img src={dronesImage} alt="Drones" />
                    </div>
                </div>
            </section>

            <section className="page-wrapper">
                <UltimateCarousel></UltimateCarousel>
            </section>

            <section className="contact-section" id="contact">
                <img src={plane1} className="contact-img plane-top-left" alt="Plane Top Left" />
                <img src={dronePic} className="contact-img drone-bottom-left" alt="Drone Bottom Left" />
                <img src={plane2} className="contact-img plane-top-right" alt="Plane Top Right" />
                <img src={plane3} className="contact-img plane-bottom-right" alt="Plane Bottom Right" />

                <div className="contact-card">
                    <h4>Contact us</h4>
                    <h2>Get in touch</h2>
                    <form className="contact-form" onSubmit={e => { e.preventDefault(); alert("Submitted!"); }}>
                        <div className="form-row">
                            <input type="text" placeholder="First name" required />
                            <input type="text" placeholder="Last name" required />
                        </div>
                        <input type="email" placeholder="email" required />
                        <textarea placeholder="Message" rows={4} required />
                        <button type="submit" className="submit-btn">SUBMIT</button>
                    </form>
                </div>
            </section>

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
        </div>
    );
};

export default AeroNITKHomepage;
