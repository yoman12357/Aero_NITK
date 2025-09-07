
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AeroNITKHomepage from './AeronitkHomepage.jsx';
import Gallery from './components/Gallery.jsx';  
import Team from './components/Team.jsx';        
import Recruitment from './components/recruitment_page.jsx';



const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AeroNITKHomepage />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/team" element={<Team />} />
                <Route path="/recruitment" element={<Recruitment />} />
            </Routes>
        </Router>
    );
};

export default App;