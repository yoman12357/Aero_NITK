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
      <nav className="navbar">
        <Link to="/" onClick={closeMobileMenu} aria-label="Home">
          <img src={logoImage} alt="Aero NITK Logo" className="navbar-logo" />
        </Link>

        <div className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={closeMobileMenu}>HOME</Link>
          <a href="/#about" onClick={closeMobileMenu}>ABOUT</a>
          <Link to="/gallery" onClick={closeMobileMenu}>GALLERY</Link>
          <Link to="/team" onClick={closeMobileMenu}>TEAM</Link>
          <a href="/#contact" onClick={closeMobileMenu}>CONTACT</a>
        </div>

        <button
          className="hamburger-menu"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="nav-links"
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

      <section className="sponsors-hero">
        <div className="sponsors-hero-content">
          <h1>SPONSORS</h1>
          <p>Partner with Aero NITK and be part of our journey in aerospace innovation</p>
        </div>
      </section>

      <section className="brochure-section">
        <div className="container">
          <h2>Sponsorship Brochure</h2>
          <p>Learn more about our team, projects, and sponsorship opportunities</p>

          <div className="brochure-container">
            <div className="brochure-placeholder">
              <div className="brochure-content">
                <h3>Interactive Brochure</h3>
                <object
                  data="/brochure.pdf"
                  type="application/pdf"
                  width="100%"
                  height="600"
                >
                  Can’t display the brochure here.{' '}
                  <a href="/brochure.pdf" target="_blank" rel="noreferrer">
                    Open brochure
                  </a>
                  .
                </object>

                <div style={{ marginTop: '1rem' }}>
                  <a
                    href="/brochure.pdf"
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="contact-btn secondary"
                  >
                    Download brochure
                  </a>
                </div>
              </div>
            </div>

            <div className="brochure-scroll-content">
              <div className="scroll-item">
                <h4>About Aero NITK</h4>
                <p>We are the official aeromodelling team of NITK Surathkal, passionate about aerospace engineering and innovation.</p>
              </div>
              <div className="scroll-item">
                <h4>Our Achievements</h4>
                <p>Multiple competition wins, innovative projects, and a strong alumni network in the aerospace industry.</p>
              </div>
              <div className="scroll-item">
                <h4>Why Sponsor Us?</h4>
                <p>Get brand visibility, support emerging talent, and be part of cutting-edge aerospace research and development.</p>
              </div>
              <div className="scroll-item">
                <h4>Sponsorship Tiers</h4>
                <p>Multiple sponsorship levels available to suit different budget ranges and partnership goals.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bank-details-section">
        <div className="container">
          <h2>Banking Information</h2>
          <p>For sponsorship payments and donations</p>

          <button
            className={`bank-details-toggle ${showBankDetails ? 'active' : ''}`}
            onClick={toggleBankDetails}
            aria-expanded={showBankDetails}
            aria-controls="bank-details-card"
          >
            {showBankDetails ? 'Hide' : 'Show'} Bank Details
            <svg
              className={`arrow ${showBankDetails ? 'rotated' : ''}`}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          <div
            id="bank-details-card"
            className={`bank-details-card ${showBankDetails ? 'visible' : ''}`}
          >
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
              <p><strong>Note:</strong> Please contact us before making any payments to confirm the details and discuss sponsorship terms.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bank-details-section">
        <div className="container">
          <h2>Email</h2>
          <p>Send an email or copy the address below</p>

          <button
            className={`bank-details-toggle ${showEmailDetails ? 'active' : ''}`}
            onClick={toggleEmailDetails}
            aria-expanded={showEmailDetails}
            aria-controls="email-details-card"
          >
            {showEmailDetails ? 'Hide' : 'Show'} Email Details
            <svg
              className={`arrow ${showEmailDetails ? 'rotated' : ''}`}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          <div
            id="email-details-card"
            className={`bank-details-card ${showEmailDetails ? 'visible' : ''}`}
          >
            <div className="bank-info-grid">
              <div className="bank-info-item">
                <label>Email Address</label>
                <span>aeronitk@nitk.edu.in</span>
              </div>
            </div>

            <div className="contact-buttons" style={{ marginTop: '0.5rem' }}>
            
              <button
                type="button"
                className="contact-btn secondary"
                onClick={() => navigator.clipboard?.writeText('aeronitk@nitk.edu.in')}
              >
                Copy address
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="sponsors-contact">
        <div className="container">
          <h2>Get in Touch</h2>
          <p>Ready to sponsor us? Have questions about partnership opportunities?</p>
          <div className="contact-buttons">
           
            <a href="/#contact" className="contact-btn secondary">
              Contact Form
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-row">
            <img src={logoImage} alt="Aero NITK Logo" className="footer-logo" />
            <div className="footer-text">
              <p>© 2025 Aero NITK | Built with 💙 by Web Team, AeroNITK</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Sponsors;
