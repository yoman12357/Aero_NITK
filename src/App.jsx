import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';

import AeroNITKHomepage from './AeronitkHomepage.jsx';
import Gallery from './components/Gallery.jsx';
import Team from './components/Team.jsx';
import AboutPage from './components/aboutpage.jsx';
import Recruitment from './components/recruitment_page.jsx';
import Sponsors from './components/sponsors.jsx';
import Header from './components/header.jsx';

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Sets to true if user scrolls more than 50px
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <ScrollToTop />
      {/* Header is placed here once, passing the scroll state */}
      <Header isScrolled={isScrolled} />

      <Routes>
        <Route path="/" element={<AeroNITKHomepage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/team" element={<Team />} />
        <Route path="/recruitment" element={<Recruitment />} />
        <Route path="/sponsors" element={<Sponsors />} />
      </Routes>
    </>
  );
};

export default App;