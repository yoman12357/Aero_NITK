import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './header.css';
import logoImage from '../images/Aero_NITK_logo.png';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Scroll Spy Logic
  useEffect(() => {
    // Only run scroll spy on the homepage
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    const sections = ['home', 'contact'];
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Trigger when section is in the middle of the viewport
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [location]);

  return (
    <nav className="app-navbar">
      <img src={logoImage} alt="Aero NITK Logo" className="app-navbar-logo" />

      <div className={`app-navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
        {/* Updated Anchor Links for Scroll Spy */}
        <a
          href="/#home"
          onClick={closeMobileMenu}
          className={activeSection === 'home' ? 'active-link' : ''}
        >
          HOME
        </a>

        <NavLink to="/about" onClick={closeMobileMenu} className={({ isActive }) => (isActive ? 'active-link' : '')}>ABOUT</NavLink>
        <NavLink to="/gallery" onClick={closeMobileMenu} className={({ isActive }) => (isActive ? 'active-link' : '')}>GALLERY</NavLink>
        <NavLink to="/team" onClick={closeMobileMenu} className={({ isActive }) => (isActive ? 'active-link' : '')}>TEAM</NavLink>
        <NavLink to="/sponsors" onClick={closeMobileMenu} className={({ isActive }) => (isActive ? 'active-link' : '')}>SPONSORS</NavLink>

        <a
          href="/#contact"
          onClick={closeMobileMenu}
          className={activeSection === 'contact' ? 'active-link' : ''}
        >
          CONTACT
        </a>
      </div>

      <button className="app-hamburger" onClick={toggleMobileMenu}>
        {mobileMenuOpen ? (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        )}
      </button>
    </nav>
  );
};

export default Header;