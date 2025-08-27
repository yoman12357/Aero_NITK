
import React, { useState } from 'react';
import './Gallery.css';
import gallery1 from '../images/gallery1.png';
import gallery2 from '../images/gallery2.png';
import gallery3 from '../images/gallery3.png';

const images = [
  { src: gallery1, alt: "Gallery Image 1" },
  { src: gallery2, alt: "Gallery Image 2" },
  { src: gallery3, alt: "Gallery Image 3" },
];

const Gallery = () => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <section className="gallery-section">
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
    </section>
  );
};

export default Gallery;