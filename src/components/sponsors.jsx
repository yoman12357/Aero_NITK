import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './sponsors.css';
import logoImage from '../images/Aero_NITK_logo.png';
// CORRECTION: Import the background image directly
import heroBackgroundImage from '../images/sponsersbg.jpg'; 
import instagramLogo from '../images/instagram_logo.png';
import youtubeLogo from '../images/youtube_logo.png';
import linkedInLogo from '../images/linkedIn_logo.png';

const Sponsors = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [showEmailDetails, setShowEmailDetails] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);
  const toggleBankDetails = () => setShowBankDetails(!showBankDetails);
  const toggleEmailDetails = () => setShowEmailDetails(!showEmailDetails);

  const bankDetails = {
    accountName: 'Aero NITK',
    accountNumber: 'XXXX XXXX XXXX XXXX',
    bankName: 'State Bank of India',
    ifscCode: 'SBIN0XXXXXX',
    branch: 'NITK Surathkal Branch',
    upiId: 'aeronitk@sbi',
  };

  // Define the inline style object for the hero section
  const heroStyle = {
    // This is applied via inline style because of previous path issues
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${heroBackgroundImage})`,
  };

  return (
    <div className="sponsors-page">
      {/* Navbar (MATCHED TO TEAM.JSX STYLE) */}
      <nav className="navbar">
        <Link to="/" onClick={closeMobileMenu} aria-label="Home">
          <img src={logoImage} alt="Aero NITK Logo" className="navbar-logo" />
        </Link>
        <div className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={closeMobileMenu}>HOME</Link>
          <Link to="/about" onClick={closeMobileMenu}>ABOUT</Link>
          <a href="#why-sponsor" onClick={closeMobileMenu}>WHY SPONSOR</a>
          <a href="#brochure" onClick={closeMobileMenu}>BROCHURE</a>
          {/* CORRECTED: Link to the homepage contact section */}
          <a href="/#contact" onClick={closeMobileMenu}>CONTACT</a> 
        </div>
        <button className="hamburger-menu" onClick={toggleMobileMenu} aria-label="Menu">
          <span>☰</span>
        </button>
      </nav>

      {/* Hero: Apply the corrected inline style */}
      <header className="sponsors-hero" style={heroStyle}>
        <div className="sponsors-hero-content">
          <h1>Partner with Aero NITK and be part of our journey in aerospace innovation</h1>
          <p>Learn more about our team, projects, and sponsorship opportunities</p>
        </div>
      </header>

      {/* About + Why Sponsor (scroll content) */}
      <section id="about" className="brochure-section">
        <div className="container">
          <div className="brochure-container">
            <div className="brochure-scroll-content">
              <div className="scroll-item">
                <h4>About Aero NITK</h4>
                <p>We proudly constitute the official aeromodelling contingent of NITK Surathkal, ardently devoted to the pursuit of aerospace engineering and the relentless advance of innovation.</p>
              </div>
              <div id="why-sponsor" className="scroll-item">
                <h4>Why Sponsor Us?</h4>
                <p>Our repertoire boasts multiple triumphs in competitive arenas, groundbreaking ventures that continually push the envelope of innovation, and a robust and discerning alumni network deeply entrenched in the aerospace industry’s vanguard.</p>
              </div>
              <div className="scroll-item">
                <h4>Benefits for Sponsors</h4>
                <p>Seize unparalleled brand prominence, champion nascent talent, and immerse yourself in the vanguard of avant-garde aerospace research and development.</p>
              </div>
              <div className="scroll-item">
                <h4>Sponsorship Levels</h4>
                <p>A diverse array of sponsorship tiers is meticulously curated to accommodate varying fiscal allotments and align harmoniously with distinct partnership aspirations.</p>
              </div>
            </div>

            {/* MOVED: Brochure is now directly below About/Why sponsor and full-width enabled via CSS */}
            <div id="brochure" className="brochure-content">
              <h3>Download/Preview Brochure</h3>
              {/* Ensure full width */}
              <object
                data="/brochure.pdf"
                type="application/pdf"
                width="100%"
                height="600px"
              >
                <p>
                  Your browser does not support PDFs. Download the brochure
                  <a href="/brochure.pdf" download> here</a>.
                </p>
              </object>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="sponsors-contact">
        <div className="container">
          <div className="contact-buttons">
            
            <a className="contact-btn secondary" href="/brochure.pdf" download>
              Download Brochure
            </a>
          </div>
          <p>Ready to sponsor us? Have questions about partnership opportunities?</p>
        </div>
      </section>
      <section id="bank" className="bank-details-section">
        <div className="container">
          <h2>For sponsorship payments and donations</h2>
          <p><strong>Note:</strong> Please contact us before making any payments to confirm the details and discuss sponsorship terms.</p>

          <button className="bank-details-toggle" onClick={toggleBankDetails}>
            View Bank Details <span className={`arrow ${showBankDetails ? 'rotated' : ''}`}>▾</span>
          </button>

          <div className={`bank-details-card ${showBankDetails ? 'visible' : ''}`}>
            <div className="bank-info-grid">
              <div className="bank-info-item">
                <label>Account Name</label>
                <span>{bankDetails.accountName}</span>
              </div>
              <div className="bank-info-item">
                <label>Account Number</label>
                <span>{bankDetails.accountNumber}</span>
              </div>
              <div className="bank-info-item">
                <label>Bank Name</label>
                <span>{bankDetails.bankName}</span>
              </div>
              <div className="bank-info-item">
                <label>IFSC Code</label>
                <span>{bankDetails.ifscCode}</span>
              </div>
              <div className="bank-info-item">
                <label>Branch</label>
                <span>{bankDetails.branch}</span>
              </div>
              <div className="bank-info-item">
                <label>UPI ID</label>
                <span>{bankDetails.upiId}</span>
              </div>
            </div>

            <div className="bank-details-note">
              <p><strong>Note:</strong> Contact us to confirm details before proceeding with any transaction.</p>
            </div>
          </div>
        </div>
      </section>


      {/* Footer (Consistent Structure) */}
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
          © {new Date().getFullYear()} Aero NITK | Built with <span style={{ color: '#3490eb' }}>💙</span> by Web Team , AeroNITK
        </div>
      </footer>
    </div>
  );
};

export default Sponsors;