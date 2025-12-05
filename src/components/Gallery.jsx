import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Gallery.css';
import instagramLogo from '../images/instagram_logo.png';
import youtubeLogo from '../images/youtube_logo.png';
import linkedInLogo from '../images/linkedIn_logo.png';
import logoImage from '../images/Aero_NITK_logo.png';

import gallery1 from '../images/gallery1.png';
import gallery2 from '../images/gallery2.png';
import gallery3 from '../images/gallery3.png';
import Header from './header';
import Footer from './footer';

const images = [
  { src: gallery1, alt: 'Gallery Image 1' },
  { src: gallery2, alt: 'Gallery Image 2' },
  { src: gallery3, alt: 'Gallery Image 3' }
];

const Gallery = () => {
  const [hoveredIdx, setHoveredIdx] = useState(null);


  return (
    <>
      <Header></Header>
      <div className="gallery-section">
        <h2>GALLERY</h2>
        <div className="gallery-grid">
          {images.map((image, idx) => (
            <div
              key={idx}
              className={`gallery-item${hoveredIdx === idx ? ' hovered' : hoveredIdx !== null ? ' blurred' : ''}`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>
      </div>

      <Footer></Footer>
    </>
  );
};

export default Gallery;