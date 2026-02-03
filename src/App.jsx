import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import Header from './components/header.jsx';

// Pages
import AeroNITKHomepage from './AeronitkHomepage.jsx';
import WorkshopRegistration from './components/workshop_registration.jsx';

import AboutPage from './components/aboutpage.jsx';
import Gallery from './components/Gallery.jsx';
import Team from './components/Team.jsx';
import AlumniPage from './components/AlumniPage.jsx';
import BatchDetails from './components/BatchDetails.jsx';
import Recruitment from './components/recruitment_page.jsx';
import Sponsors from './components/sponsors.jsx';

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Controls if maintenance is active based on your .env file
  const [isMaintenanceActive, setIsMaintenanceActive] = useState(
    import.meta.env.VITE_MAINTENANCE_MODE === 'true'
  );

  useEffect(() => {
    if (!isMaintenanceActive) return;

    // --- TIMER CONFIGURATION ---
    const TIMER_VERSION = "v1"; // Change this (e.g., "v2") to force a reset
    const MINUTES_FOR_TIMER = 30; // Set your desired minutes here
    // ---------------------------

    const storageKey = `maintenanceExpiry_${TIMER_VERSION}`;
    let targetTime = localStorage.getItem(storageKey);

    if (!targetTime) {
      // Calculate new end time
      const duration = MINUTES_FOR_TIMER * 60 * 1000;
      targetTime = Date.now() + duration;

      // Clean up old timer versions to save space
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('maintenanceExpiry_')) localStorage.removeItem(key);
      });

      localStorage.setItem(storageKey, targetTime);
    }

    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = Math.max(0, Math.floor((targetTime - now) / 1000));
      setTimeLeft(difference);

      // Auto-unlock when time hits zero
      if (difference <= 0) {
        setIsMaintenanceActive(false);
        localStorage.removeItem(storageKey);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [isMaintenanceActive]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // --- MAINTENANCE SCREEN RENDER ---
  if (isMaintenanceActive && timeLeft > 0) {
    return (
      <div style={{
        backgroundColor: '#000', color: '#fff', height: '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', fontFamily: 'sans-serif', textAlign: 'center'
      }}>
        <h1 style={{ color: '#ff4d4d', fontSize: '2.5rem' }}>⚠️ STRESS TEST IN PROGRESS</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
          The AeroNITK site is temporarily offline for security testing.
        </p>
        <div style={{
          fontSize: '5rem', fontWeight: 'bold', color: '#fff',
          border: '4px solid #ff4d4d', padding: '20px 50px', borderRadius: '15px',
          boxShadow: '0 0 20px rgba(255, 77, 77, 0.5)'
        }}>
          {formatTime(timeLeft)}
        </div>
        <p style={{ marginTop: '20px', color: '#888' }}>
          Site will automatically restore when the countdown ends.
        </p>
      </div>
    );
  }

  // --- NORMAL SITE RENDER ---
  return (
    <div className="App">
      <ScrollToTop />
      <Header isScrolled={isScrolled} />
      <Routes>
        <Route path="/" element={<AeroNITKHomepage />} />
        <Route path="/workshop_registration" element={<WorkshopRegistration />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/team" element={<Team />} />
        <Route path="/alumni" element={<AlumniPage />} />
        <Route path="/alumni/:year" element={<BatchDetails />} />
        <Route path="/recruitment" element={<Recruitment />} />
        <Route path="/sponsors" element={<Sponsors />} />
      </Routes>
    </div>
  );
};

export default App;