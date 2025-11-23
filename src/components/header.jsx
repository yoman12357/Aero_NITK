import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './header.css';
// Adjust the path below based on your folder structure (e.g., '../../images/' or './images/')
import logoImage from '../images/Aero_NITK_logo.png'; 

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <img src={logoImage} alt="Aero NITK Logo" className="navbar-logo" />
      <div className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
        {/* Note: You might want to use Link for 'home' if it routes to a separate page, 
            or keep <a> for scroll-to-id behavior on the homepage */}
        <a href="/#home" onClick={closeMobileMenu}>HOME</a>
        <Link to="/about" onClick={closeMobileMenu}>ABOUT</Link>
        <Link to="/gallery" onClick={closeMobileMenu}>GALLERY</Link>
        <Link to="/team" onClick={closeMobileMenu}>TEAM</Link>
        <Link to="/sponsors" onClick={closeMobileMenu}>SPONSORS</Link>
        <Link to="/recruitment" onClick={closeMobileMenu}>RECRUITMENT</Link>
        <a href="/#contact" onClick={closeMobileMenu}>CONTACT</a>
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
  );
};

export default Header;