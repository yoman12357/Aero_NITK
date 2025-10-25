import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './sponsors.css';
import logoImage from '../images/Aero_NITK_logo.png';

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

  return (
    <div className="sponsors-page">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" onClick={closeMobileMenu} aria-label="Home">
          <img src={logoImage} alt="Aero NITK Logo" className="navbar-logo" />
        </Link>
        <div className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={closeMobileMenu}>HOME</Link>
          <a href="#about" onClick={closeMobileMenu}>ABOUT</a>
          <a href="#why-sponsor" onClick={closeMobileMenu}>WHY SPONSOR</a>
          <a href="#brochure" onClick={closeMobileMenu}>BROCHURE</a>
          {/* <a href="#bank" onClick={closeMobileMenu}>BANK</a> */}
          <a href="#contact" onClick={closeMobileMenu}>CONTACT</a>
        </div>
        <button className="hamburger-menu" onClick={toggleMobileMenu} aria-label="Menu">
          <span>☰</span>
        </button>
      </nav>

      {/* Hero */}
      <header className="sponsors-hero">
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
                <p>We are the official aeromodelling team of NITK Surathkal, passionate about aerospace engineering and innovation.</p>
              </div>
              <div id="why-sponsor" className="scroll-item">
                <h4>Why Sponsor Us?</h4>
                <p>Multiple competition wins, innovative projects, and a strong alumni network in the aerospace industry.</p>
              </div>
              <div className="scroll-item">
                <h4>Benefits for Sponsors</h4>
                <p>Get brand visibility, support emerging talent, and be part of cutting-edge aerospace research and development.</p>
              </div>
              <div className="scroll-item">
                <h4>Sponsorship Levels</h4>
                <p>Multiple sponsorship levels available to suit different budget ranges and partnership goals.</p>
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


      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-row">
            <img src={logoImage} alt="Aero NITK" className="footer-logo" />
            <div className="footer-text">
              <p>© {new Date().getFullYear()} Aero NITK. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Sponsors;
