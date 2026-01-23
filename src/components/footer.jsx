import React from 'react';
import { useLocation } from 'react-router-dom';
import './footer.css';
import logoImage from '../images/Aero_NITK_logo.png';

const Footer = () => {
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  return (
    <div className={`pagewrapper ${isHomePage ? 'home-bg' : 'other-bg'}`}>
      <footer className="footer">
        <div className="footer-main-content">
          <div className="footer-logo-section">
            <img src={logoImage} alt="Aero NITK Logo" className="footer-logo" />
          </div>

          <div className="footer-links-container">
            <div className="footer-column">
              <h3>Social</h3>
              <a href="https://www.instagram.com/aeronitk/" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://www.youtube.com/@AeroNITK" target="_blank" rel="noreferrer">Youtube</a>
              <a href="https://www.linkedin.com/company/aero-nitk" target="_blank" rel="noreferrer">Linkedin</a>
            </div>

            <div className="footer-column">
              <h3>About us</h3>
              <a href="/about">About</a>
              <a href="/team">Team</a>
              <a href="/sponsors">Sponsor's</a>
            </div>

            <div className="footer-column contact-col">
              <h3>Contact Us</h3>
              <p>Email : XYZ@Gmail.com</p>
              <p>Phone No : +91 xxxxxxxxxx</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 Aero NITK | Built with <span className="heart">💙</span> by Web Team, AeroNITK
        </div>
      </footer>
    </div>
  );
};

export default Footer;