import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import Header from './components/header.jsx';

// Pages
import AeroNITKHomepage from './AeronitkHomepage.jsx';
import AboutPage from './components/aboutpage.jsx';
import Gallery from './components/Gallery.jsx';
import Team from './components/Team.jsx';
import AlumniPage from './components/AlumniPage.jsx';
import BatchDetails from './components/BatchDetails.jsx';
import Recruitment from './components/recruitment_page.jsx';
import Sponsors from './components/sponsors.jsx';

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <ScrollToTop />
      <Header isScrolled={isScrolled} />
      <Routes>
        <Route path="/" element={<AeroNITKHomepage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/team" element={<Team />} />

        {/* ENSURE THIS MATCHES YOUR NAVIGATION LINKS (e.g., /alumni) */}
        <Route path="/alumni" element={<AlumniPage />} />
        <Route path="/alumni/:year" element={<BatchDetails />} />

        <Route path="/recruitment" element={<Recruitment />} />
        <Route path="/sponsors" element={<Sponsors />} />
      </Routes>
    </>
  );
};

export default App;