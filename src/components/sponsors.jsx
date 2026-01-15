import React, { useState } from 'react';
import './sponsors.css';
import Header from './header.jsx';
import Footer from './footer.jsx';

const Sponsors = () => {
  const [showBankDetails, setShowBankDetails] = useState(false);
  const toggleBankDetails = () => setShowBankDetails(!showBankDetails);

  const bankDetails = {
    accountName: 'Aero NITK',
    accountNumber: 'XXXX XXXX XXXX XXXX',
    bankName: 'State Bank of India',
    ifscCode: 'SBIN0XXXXXX',
    branch: 'NITK Surathkal Branch',
    upiId: 'aeronitk@sbi',
  };

  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7))`,
  };

  return (
    <div className="sponsors-page">
      {/* Passing isScrolled={true} for centered desktop navbar */}

      {/* HERO SECTION */}
      <header className="sponsors-hero" style={heroStyle}>
        <div className="sponsors-hero-content">
          <h1>
            PARTNER WITH AERO NITK AND BE PART OF OUR <span className="highlight">JOURNEY</span> IN AEROSPACE <span className="highlight">INNOVATION</span>.
          </h1>
          <p>Learn More About Our Team, Projects, And Sponsorship Opportunities.</p>
        </div>
      </header>

      {/* INFO & BROCHURE SECTION */}
      <section id="about" className="brochure-section">
        <div className="container">
          <div className="info-vertical-list">
            <div className="scroll-item">
              <h4>About Aero NITK</h4>
              <p>We proudly constitute the official aeromodelling contingent of NITK Surathkal, ardently devoted to the pursuit of aerospace engineering and the relentless advance of innovation.</p>
            </div>
            <div className="scroll-item">
              <h4>Why Sponsor Us?</h4>
              <p>Our repertoire boasts multiple triumphs in competitive arenas, groundbreaking ventures that continually push the envelope of innovation, and a robust and discerning alumni network.</p>
            </div>
          </div>

          <div id="brochure" className="brochure-view">
            <h3>Preview Brochure</h3>
            <div className="pdf-frame">
              <object
                data="/brochure.pdf"
                type="application/pdf"
                width="100%"
                height="800px"
              >
                <div className="pdf-fallback">
                  <p>Your browser does not support PDFs. <a href="/brochure.pdf" download>Download the brochure here</a>.</p>
                </div>
              </object>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION SECTION - BELOW BROCHURE */}
      <section className="sponsors-cta">
        <div className="cta-container">
          <a className="download-btn" href="/brochure.pdf" download>
            DOWNLOAD BROCHURE
          </a>
          <p className="partnership-inquiry">
            Ready To Sponsor Us? Have Questions About Partnership Opportunities?
          </p>
        </div>
      </section>

      {/* BANK DETAILS SECTION */}
      <section id="bank" className="bank-details-section">
        <div className="container">
          <h2>For sponsorship payments and donations</h2>
          <button className="bank-details-toggle" onClick={toggleBankDetails}>
            View Bank Details <span className={`arrow ${showBankDetails ? 'rotated' : ''}`}>▾</span>
          </button>

          <div className={`bank-details-card ${showBankDetails ? 'visible' : ''}`}>
            <div className="bank-info-grid">
              <div className="bank-info-item"><label>Account Name</label><span>{bankDetails.accountName}</span></div>
              <div className="bank-info-item"><label>Account Number</label><span>{bankDetails.accountNumber}</span></div>
              <div className="bank-info-item"><label>Bank Name</label><span>{bankDetails.bankName}</span></div>
              <div className="bank-info-item"><label>IFSC Code</label><span>{bankDetails.ifscCode}</span></div>
              <div className="bank-info-item"><label>Branch</label><span>{bankDetails.branch}</span></div>
              <div className="bank-info-item"><label>UPI ID</label><span>{bankDetails.upiId}</span></div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sponsors;