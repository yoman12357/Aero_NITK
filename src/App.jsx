import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';

import AeroNITKHomepage from './AeronitkHomepage.jsx';
import Gallery from './components/Gallery.jsx';
import Team from './components/Team.jsx';
import AboutPage from './components/aboutpage.jsx';
import Recruitment from './components/recruitment_page.jsx';
import Sponsors from './components/sponsors.jsx';

const App = () => {
  return (
    <>
      <ScrollToTop />
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