import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import './header.css';
import logoImage from '../images/Aero_NITK_logo.png';

const Header = ({ isScrolled }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }
    const sections = ['home', 'contact'];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { rootMargin: '-50% 0px -50% 0px' });

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [location]);

  const handleHashLink = (e, id) => {
    closeMobileMenu();
    if (location.pathname === '/') {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`app-navbar ${isScrolled ? 'scrolled-layout' : ''}`}>
      <Link to="/" onClick={closeMobileMenu} className="app-navbar-logo-wrapper">
        <img src={logoImage} alt="Logo" className="app-navbar-logo" />
      </Link>

      {/* These spacers handle the sliding transition */}
      <div className="nav-spacer-left"></div>

      <div className={`app-navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="/#home" onClick={(e) => handleHashLink(e, 'home')} className={activeSection === 'home' ? 'active-link' : ''}>HOME</a>
        <NavLink to="/about" onClick={closeMobileMenu} className={({ isActive }) => (isActive ? 'active-link' : '')}>ABOUT</NavLink>
        <NavLink to="/gallery" onClick={closeMobileMenu} className={({ isActive }) => (isActive ? 'active-link' : '')}>GALLERY</NavLink>
        <NavLink to="/team" onClick={closeMobileMenu} className={({ isActive }) => (isActive ? 'active-link' : '')}>TEAM</NavLink>
        <NavLink to="/sponsors" onClick={closeMobileMenu} className={({ isActive }) => (isActive ? 'active-link' : '')}>SPONSORS</NavLink>
        <a href="/#contact" onClick={(e) => handleHashLink(e, 'contact')} className={activeSection === 'contact' ? 'active-link' : ''}>CONTACT</a>
      </div>

      <div className="nav-spacer-right"></div>

      <button className="app-hamburger" onClick={toggleMobileMenu}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          {mobileMenuOpen ? (
            <><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></>
          ) : (
            <><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></>
          )}
        </svg>
      </button>
    </nav>
  );
};

export default Header;