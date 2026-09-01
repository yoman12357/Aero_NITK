import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { db, collection, addDoc, serverTimestamp } from './firebase';
import './AeronitkHomepage.css';

import plane1 from './images/plane1.png';
import plane2 from './images/plane2.png';
import plane3 from './images/plane3.png';
import dronePic from './images/drone-pic.png';
import UltimateCarousel from './components/UltimateCarousel.jsx';
// eslint-disable-next-line no-unused-vars
import contactus from './images/contactus.webp';
import Footer from './components/footer.jsx';
import BlurText from "./components/effects/bt.jsx";
import Timeline from './components/Timeline.jsx';
import Popup from './components/Popup.jsx'; // adjust path if needed
import { Helmet } from 'react-helmet-async';


const AeroNITKHomepage = () => {
  // const [showWorkshopPopup, setShowWorkshopPopup] = useState(false); // workshop popup disabled
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    hp_field: '' // Honeypot field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showPopup, setShowPopup] = useState(false); // New state for popup

  // Workshop popup auto-trigger — disabled
  // useEffect(() => {
  //   if (isHomePage) {
  //     const t = setTimeout(() => setShowWorkshopPopup(true), 1400);
  //     return () => clearTimeout(t);
  //   } else {
  //     setShowPopup(false);
  //   }
  // }, [isHomePage]);

  useEffect(() => {
    if (isHomePage) document.body.classList.add('homepage');
    else document.body.classList.remove('homepage');
    return () => document.body.classList.remove('homepage');
  }, [isHomePage]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    // 1. Honeypot check
    if (formData.hp_field) {
      console.warn("Bot detected via honeypot.");
      return;
    }

    // 2. Data Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (formData.firstName.trim().length < 2) {
      alert("First name must be at least 2 characters long.");
      return;
    }
    if (formData.message.trim().length < 10) {
      alert("Message must be at least 10 characters long.");
      return;
    }

    setIsSubmitting(true);

    let firestoreOk = false;
    let emailOk = false;

    // Step 1: Save to Firestore
    try {
      await addDoc(collection(db, "contact_submissions"), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        message: formData.message,
        submittedAt: serverTimestamp()
      });
      firestoreOk = true;
      console.log("✅ Firestore: saved successfully");
    } catch (err) {
      console.error("❌ Firestore error:", err);
    }

    // Step 2: Send email via EmailJS
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          message: formData.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      emailOk = true;
      console.log("✅ EmailJS: sent successfully");
    } catch (err) {
      console.error("❌ EmailJS error:", err);
    }

    if (firestoreOk || emailOk) {
      if (window.gtag) {
        window.gtag('event', 'contact_form_submit', {
          'event_category': 'Engagement',
          'event_label': 'Homepage Contact'
        });
      }
      setIsPopupOpen(true);
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
    } else {
      alert("Submission failed. Check console for details.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Aero NITK | Wings of Teamwork</title>
        <meta name="description" content="Official Aeromodelling Club of NITK Surathkal. We design, build, and fly RC Planes, UAVs, and Autonomous Drones." />
        <link rel="canonical" href="https://aeronitk.in/" />
        <meta property="og:title" content="Aero NITK | Wings of Teamwork" />
        <meta property="og:description" content="Design, Build, Fly. The official Aeromodelling team of NITK Surathkal." />
        <meta property="og:url" content="https://aeronitk.in/" />
      </Helmet>
      <section className="hero-section" id="home">
        <div className="hero-container">
          <BlurText text="AERONITK" className="hero-title" delay={150} animateBy="words" direction="top" />
          <BlurText text="WINGS OF TEAMWORK" className="hero-subtitle" delay={300} animateBy="words" direction="top" />
        </div>
      </section>
      {/* Workshop popup — disabled
      <Popup
        open={showWorkshopPopup}
        onClose={() => setShowWorkshopPopup(false)}
        className="workshop-popup-bottom-right workshop-popup"
        containerStyle={{ '--popup-width': '400px', '--popup-height': '180px' }}
      >
        <div className="workshop-icon"></div>
        <h4 className="workshop-title">SKYVERSE AERO MODELLING WORKSHOP</h4>
        <p className="workshop-date">Register now — slots are limited!</p>
        <button
          onClick={() => {
            setShowWorkshopPopup(false);
            navigate('/workshop_registration');
          }}
          className="workshop-register-btn"
        >
          REGISTER NOW
        </button>
        <p className="workshop-date">Workshop dates: <strong>6th, 7th & 8th March</strong></p>
      </Popup>
      */}

      {/* <section className="about-section" id="about">
        <div className="about-content">
          <div className="about-text">
            <h2>ABOUT</h2>
            <p>Aero NITK is the official Aeromodelling and Aviation-focused student team of NITK Surathkal. We Design, Analyze, and Build RC Planes, UAVs, and Autonomous Drones.</p><br />
            <Link to="/about" className="learn-more-btn">LEARN MORE</Link>
          </div>
          <div className="about-image">
            <img src={aboutDrone} alt="Aero NITK Drone" />
          </div>
        </div>
      </section> */}

      <section className="carousel-section">
        <UltimateCarousel />
        <Timeline />
      </section>

      <section className="contact-section" id="contact">
        <img src={plane1} className="contact-img plane-top-left" alt="decor" loading="lazy" />
        <img src={dronePic} className="contact-img drone-bottom-left" alt="decor" loading="lazy" />
        <img src={plane2} className="contact-img plane-top-right" alt="decor" loading="lazy" />
        <img src={plane3} className="contact-img plane-bottom-right" alt="decor" loading="lazy" />

        <div className="contact-card">
          <h4>Contact us</h4>
          <h2>GET IN TOUCH</h2>
          <form className="contact-form" onSubmit={handleContactSubmit}>
            {/* Honeypot field (hidden from users) */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <input
                type="text"
                name="hp_field"
                value={formData.hp_field}
                onChange={handleChange}
                tabIndex="-1"
                autoComplete="off"
              />
            </div>
            <div className="form-row">
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" required />
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" required />
            </div>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@company.com" required />
            <textarea name="message" value={formData.message} onChange={handleChange} rows={4} placeholder="Your message..." required />
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'SENDING...' : 'SUBMIT'}
            </button>
          </form>
        </div>
      </section>
      <Footer />

      <Popup open={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
        <h2>Success!</h2>
        <p>Your message was sent successfully. We'll get back to you soon.</p>
      </Popup>

    </div>
  );
};

export default AeroNITKHomepage;
