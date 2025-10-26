import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Gallery.css';
import instagramLogo from '../images/instagram_logo.png';
import youtubeLogo from '../images/youtube_logo.png';
import linkedInLogo from '../images/linkedIn_logo.png';
import logoImage from '../images/Aero_NITK_logo.png';

import gallery1 from '../images/gallery1.png';
import gallery2 from '../images/gallery2.png';
import gallery3 from '../images/gallery3.png';

const images = [
  { src: gallery1, alt: 'Gallery Image 1' },
  { src: gallery2, alt: 'Gallery Image 2' },
  { src: gallery3, alt: 'Gallery Image 3' }
];

const Gallery = () => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Navbar - Positioned fixed to the top */}
      <nav className="navbar">
        <img src={logoImage} alt="Aero NITK Logo" className="navbar-logo" />
        <div className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={closeMobileMenu}>HOME</Link>
          {/* CORRECTION: Link to the separate /about page */}
          <Link to="/about" onClick={closeMobileMenu}>ABOUT</Link>
          <Link to="/gallery" onClick={closeMobileMenu}>GALLERY</Link>
          <Link to="/team" onClick={closeMobileMenu}>TEAM</Link>
          <Link to="/sponsors" onClick={closeMobileMenu}>SPONSORS</Link>
          <a href="#contact" onClick={closeMobileMenu}>CONTACT</a>
        </div>
        <button
          className="hamburger-menu"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </nav>

      <div className="gallery-section">
        <h2>GALLERY</h2>
        <div className="gallery-grid">
          {images.map((image, idx) => (
            <div
              key={idx}
              className={`gallery-item${hoveredIdx === idx ? ' hovered' : hoveredIdx !== null ? ' blurred' : ''}`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>
      </div>
      
      <footer className="footer">
        <div className="footer-content">
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
        </div>
      </footer>
    </>
  );
};

export default Gallery;