import React from 'react';

import logoImage from '../images/Aero_NITK_logo.png';
import instagramLogo from '../images/instagram_logo.png';
import youtubeLogo from '../images/youtube_logo.png';
import linkedInLogo from '../images/linkedIn_logo.png';



const Footer = () => {
  return (
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
  );
};

export default Footer;