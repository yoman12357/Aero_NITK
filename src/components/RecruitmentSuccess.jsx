import React from 'react';
import './RecruitmentSuccess.css';
import Footer from './footer.jsx';
import { Helmet } from 'react-helmet-async';

const RecruitmentSuccess = () => {
  return (
    <>
      <Helmet>
        <title>Recruitment Success | Aero NITK</title>
        <meta name="description" content="Thank you for applying to join Aero NITK! Your application has been successfully submitted." />
        <link rel="canonical" href="https://aeronitk.in/recruitment-success" />
      </Helmet>
      
      <section className="success-section">
        <div className="success-container">
          <div className="success-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h1 className="success-title">Thank You!</h1>
          <p className="success-message">
            Your application to join Aero NITK has been successfully submitted. 
            We're excited to review your application and will get back to you soon!
          </p>
          
          <div className="success-actions">
            <div className="unstop-section">
              <h3 className="section-heading">UNSTOP</h3>
              <div className="unstop-row">
                <a href="https://unstop.com/o/e4yoEUt?lb=PVdiNfqQ&utm_medium=Share&utm_source=competitions&utm_campaign=Bharatpatel17" className="action-btn primary-btn" target="_blank" rel="noopener noreferrer">
                  Technical Registration
                </a>
                <a href="https://unstop.com/o/aZglcms?lb=PVdiNfqQ&utm_medium=Share&utm_source=competitions&utm_campaign=Bharatpatel17" className="action-btn primary-btn" target="_blank" rel="noopener noreferrer">
                  Web Registration
                </a>
              </div>
            </div>
            <div className="whatsapp-section">
              <h3 className="section-heading">WHATSAPP COMMUNITY</h3>
              <a href="https://chat.whatsapp.com/LnoyCk9reE2KfRmWOgOil3?mode=gi_t" className="action-btn secondary-btn whatsapp-btn" target="_blank" rel="noopener noreferrer">
                Join Our Community
              </a>
            </div>
          </div>
          
          
          
          
          
          <div className="success-footer">
            <p><strong>POC:</strong> Varshith J | +91 87620 56779</p>
            <p><strong>Email:</strong> varshithj.231me359@nitk.edu.in</p>
            <p>For any queries, feel free to contact us at the above details</p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default RecruitmentSuccess;
