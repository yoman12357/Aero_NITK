import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import './AeronitkHomepage.css';
import aboutDrone from './images/drone.png';

import plane1 from './images/plane1.png';
import plane2 from './images/plane2.png';
import plane3 from './images/plane3.png';
import dronePic from './images/drone-pic.png';
import UltimateCarousel from './components/UltimateCarousel.jsx';
import Header from './components/header.jsx';
import Footer from './components/footer.jsx';
import BlurText from "./components/effects/bt.jsx";
import Timeline from './components/Timeline.jsx';

const AeroNITKHomepage = () => {
  const [showScrollDown, setShowScrollDown] = useState(true);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (isHomePage) {
      document.body.classList.add('homepage');
    } else {
      document.body.classList.remove('homepage');
    }
    return () => {
      document.body.classList.remove('homepage');
    };
  }, [isHomePage]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollDown(window.scrollY <= 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

  return (
    <div className="page-wrapper">
      <Header></Header>
      {1 ? (
        <>
          <section className="hero-section" id="home">
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 0,
            }}>
            </div>

            {/* Wrapper div controls the size and spacing */}
            <div className="text-8xl mb-8" style={{ paddingLeft: '55px', fontSize: '6rem', fontWeight: 'bold' }}>
              <BlurText
                text="AERO NITK   "
                className="hero-title"  // <--- This matches the new CSS class
                delay={150}
                animateBy="words"
                direction="top"
                onAnimationComplete={handleAnimationComplete}
              />
            </div>
            {showScrollDown && (
              <div className="scroll-down bounce-indicator">
                SCROLL DOWN
                <svg className="scroll-arrow" xmlns="http://www.w3.org/2000/svg"
                  width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="white" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </div>
            )}
          </section>
          {/* NOTE: Since ABOUT is now a separate page, this section is redundant. 
                     You can remove or repurpose the content here. Keeping it for now. */}
          <section className="about-section" id="about">
            <div className="about-content">
              <div className="about-text">
                <h2>ABOUT</h2>
                <p>
                  The official NITK Surathkal student consortium, masterfully transmutes aviatic passion into tangible, high-performance aeromodelling and unmanned aerial vehicle designs, fostering a culture of trenchant innovation and empirical engineering excellence.
                </p>
                <Link to="/about" className="learn-more-btn">Learn More</Link>
              </div>
              <div className="about-image">
                <img src={aboutDrone} alt="Aero NITK Drone" />
              </div>
            </div>
          </section>

          <section className="carousel-section">
            <UltimateCarousel />
            <Timeline></Timeline>
          </section>
          <section className="contact-section" id="contact">
            <img src={plane1} className="contact-img plane-top-left" alt="Plane Top Left" />
            <img src={dronePic} className="contact-img drone-bottom-left" alt="Drone Bottom Left" />
            <img src={plane2} className="contact-img plane-top-right" alt="Plane Top Right" />
            <img src={plane3} className="contact-img plane-bottom-right" alt="Plane Bottom Right" />
            <div className="contact-card">
              <h4>Contact us</h4>
              <h2>Get in touch</h2>
              <form className="contact-form" onSubmit={e => { e.preventDefault(); alert("Submitted!"); }}>
                <div className="form-row">
                  <input type="text" placeholder="First name" required />
                  <input type="text" placeholder="Last name" required />
                </div>
                <input type="email" placeholder="email" required />
                <textarea placeholder="Message" rows={4} required />
                <button type="submit" className="submit-btn">SUBMIT</button>
              </form>
            </div>
          </section>
        </>
      ) : (
        <div style={{ minHeight: '100vh', paddingTop: '125px', background: '#fff' }}>
        </div>
      )}

      <Footer></Footer>
    </div>
  );
};

export default AeroNITKHomepage;