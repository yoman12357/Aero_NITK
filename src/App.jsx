// File: src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AeroNITKHomepage from './AeronitkHomepage.jsx';
import Gallery from './components/Gallery.jsx';  // Import your Gallery component
import Team from './components/Team.jsx';        // Import your Team component (if you have it)
import Recruitment from './components/recruitment_page.jsx';
import ImageCarousel from './components/ImageCarousel';

// Added this line to import the Recruitment component
// import ThemeToggle from './components/ThemeToggle';


const App = () => {
    return (
        <Router>
            {/* <ThemeToggle /> */}
            <Routes>
                <Route path="/" element={<AeroNITKHomepage />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/team" element={<Team />} />
                <Route path="/recruitment" element={<Recruitment />} />
<Route path="/carousel" element={<ImageCarousel />} />
                {/* Add other routes like /about, /contact as needed */}
            </Routes>
        </Router>
    );
};

export default App;
