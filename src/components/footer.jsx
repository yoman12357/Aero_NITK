import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './footer.css';
import logoImage from '../images/Aero_NITK_logo.png';

const Footer = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleSocialClick = (platform) => {
    if (window.gtag) {
      window.gtag('event', 'social_link_click', {
        'event_category': 'Engagement',
        'event_label': platform
      });
    }
  };

  return (
    <div className={`pagewrapper ${isHomePage ? 'home-bg' : 'other-bg'}`}>
      <footer className="footer">
        <div className="footer-main-content">
          <div className="footer-logo-section">
            <Link to="/">
              <img src={logoImage} alt="Aero NITK Logo" className="footer-logo" />
            </Link>
          </div>

          <div className="footer-links-container">
            <div className="footer-column">
              <h3>Socials</h3>
              <a href="https://www.instagram.com/aeronitk/" target="_blank" rel="noreferrer" onClick={() => handleSocialClick('Instagram')}>Instagram</a>
              <a href="https://www.youtube.com/@AeroNITK" target="_blank" rel="noreferrer" onClick={() => handleSocialClick('YouTube')}>YouTube</a>
              <a href="https://www.linkedin.com/company/aero-nitk" target="_blank" rel="noreferrer" onClick={() => handleSocialClick('LinkedIn')}>LinkedIn</a>
            </div>

            <div className="footer-column">
              <h3>About Us</h3>
              <a href="/about">About</a>
              <a href="/team">Team</a>
              <a href="/sponsors">Sponsors</a>
            </div>

            <div className="footer-column contact-col">
              <h3>Contact Us</h3>
              <p>E-mail: <a href="mailto:varshithj.231me359@nitk.edu.in">varshithj.231me359@nitk.edu.in</a></p>
              <p>Phone No: +91 87620 56779</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          © AeroNITK 2026 | Built with <span className="heart">💙</span> by Web Team, AeroNITK
        </div>
      </footer>
    </div>
  );
};

export default Footer;