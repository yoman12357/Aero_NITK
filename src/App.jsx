import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import Header from './components/header.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';

// Pages - Lazy Loaded for performance
const AeroNITKHomepage = lazy(() => import('./AeronitkHomepage.jsx'));
const WorkshopRegistration = lazy(() => import('./components/workshop_registration.jsx'));
const AboutPage = lazy(() => import('./components/aboutpage.jsx'));
const Gallery = lazy(() => import('./components/Gallery.jsx'));
const Team = lazy(() => import('./components/Team.jsx'));
const AlumniPage = lazy(() => import('./components/AlumniPage.jsx'));
const AlumniBatchPage = lazy(() => import("./components/AlumniBatchPage"));
const BatchDetails = lazy(() => import('./components/BatchDetails.jsx'));
const Recruitment = lazy(() => import('./components/recruitment_page.jsx'));
const Sponsors = lazy(() => import('./components/sponsors.jsx'));
const NotFound = lazy(() => import('./components/NotFound.jsx'));

import { incrementVisitorCount } from './firebase.js';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const location = useLocation();

  // GA4: track page views on route change
  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', 'G-JFHQQG3DN2', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  // Internal Visitor Tracking (Firebase only, not shown on site)
  useEffect(() => {
    const hasBeenCounted = sessionStorage.getItem('v_counted');
    if (!hasBeenCounted) {
      incrementVisitorCount();
      sessionStorage.setItem('v_counted', 'true');
    }
  }, []);

  // Performance Optimization: Dynamic Prefetching for Gallery & Team
  useEffect(() => {
    // Only prefetch after the initial page is fully interactive
    const timer = setTimeout(() => {
      const links = ['/gallery', '/team'];
      links.forEach(path => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = path;
        document.head.appendChild(link);
      });
      if (import.meta.env.MODE === 'development') {
        console.log("🚀 Critical routes prefetched for instant navigation.");
      }
    }, 3000); // 3-second delay to prioritize current page assets

    return () => clearTimeout(timer);
  }, []);

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
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<AeroNITKHomepage />} />
          <Route path="/workshop_registration" element={<WorkshopRegistration />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/team" element={<Team />} />
          <Route path="/alumni" element={<AlumniPage />} />
          <Route path="/alumni/:batchId" element={<AlumniBatchPage />} />
          <Route path="/alumni/:year" element={<BatchDetails />} />
          <Route path="/recruitment" element={<Recruitment />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;