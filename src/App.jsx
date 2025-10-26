import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TargetCursor from './components/Effects/TargetCursor.jsx';
import './components/Effects/TargetCursor.jsx';

// Import all necessary components
import AeroNITKHomepage from './AeronitkHomepage.jsx';
import Gallery from './components/Gallery.jsx';
import Team from './components/Team.jsx';
// Import the new AboutPage component
import AboutPage from './components/AboutPage.jsx'; 
// Uncommented Recruitment (assuming it's ready to be used)
import Recruitment from './components/recruitment_page.jsx'; 
import Sponsors from './components/sponsors.jsx';

const images = [
{ id: 1, img: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format" },
{ id: 2, img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format" },
{ id: 3, img: "https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format" },
{ id: 4, img: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format" }
];

const App = () => {
return (
<>
<TargetCursor spinDuration={2} hideDefaultCursor={true} />

<Router>
<Routes>
<Route path="/" element={<AeroNITKHomepage />} />
{/* ADDED: Route for the new AboutPage */}
<Route path="/about" element={<AboutPage />} /> 
<Route path="/gallery" element={<Gallery />} />
<Route path="/team" element={<Team />} />
{/* Uncommented Recruitment Route */}
<Route path="/recruitment" element={<Recruitment />} /> 
<Route path="/sponsors" element={<Sponsors />} />
</Routes>
</Router>
</>
);
};

export default App;