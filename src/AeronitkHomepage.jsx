import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { db, collection, addDoc, serverTimestamp } from './firebase';
import './AeronitkHomepage.css';

import aboutDrone from './images/drone.png';
import plane1 from './images/plane1.png';
import plane2 from './images/plane2.png';
import plane3 from './images/plane3.png';
import dronePic from './images/drone-pic.png';
import UltimateCarousel from './components/UltimateCarousel.jsx';
import contactus from './images/contactus.webp';
import Footer from './components/footer.jsx';
import BlurText from "./components/effects/bt.jsx";
import Timeline from './components/Timeline.jsx';

const AeroNITKHomepage = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "contact_submissions"), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        message: formData.message,
        submittedAt: serverTimestamp()
      });

      await emailjs.send(
        'service_4d4ymu4',
        'template_30emeep',
        {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          message: formData.message,
        },
        'fqdVPbYlWDMrpqGwl'
      );

      alert("Success! Your message was sent.");
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
    } catch (err) {
      console.error("Submission error:", err);
      alert("Submission failed. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <section className="hero-section" id="home">
        <div className="hero-container">
          <BlurText text="AERO NITK" className="hero-title" delay={150} animateBy="words" direction="top" />
          <BlurText text="WINGS OF TEAMWORK" className="hero-subtitle" delay={300} animateBy="words" direction="top" />
        </div>
      </section>

      <section className="about-section" id="about">
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
      </section>

      <section className="carousel-section">
        <UltimateCarousel />
        <Timeline />
      </section>

      <section className="contact-section" id="contact">
        <img src={plane1} className="contact-img plane-top-left" alt="decor" />
        <img src={dronePic} className="contact-img drone-bottom-left" alt="decor" />
        <img src={plane2} className="contact-img plane-top-right" alt="decor" />
        <img src={plane3} className="contact-img plane-bottom-right" alt="decor" />

        <div className="contact-card">
          <h4>Contact us</h4>
          <h2>GET IN TOUCH</h2>
          <form className="contact-form" onSubmit={handleContactSubmit}>
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
    </div>
  );
};

export default AeroNITKHomepage;