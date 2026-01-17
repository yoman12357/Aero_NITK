import React from 'react';
import './Gallery.css';
import Footer from './footer';
import Header from './header';

// --- ALL 18 IMAGE IMPORTS ---
import gallery1 from '../images/Gallery/gallery1.png';
import gallery2 from '../images/Gallery/gallery2.png';
import gallery3 from '../images/Gallery/gallery3.png';
import gallery4 from '../images/Gallery/gallery4.png';
import gallery5 from '../images/Gallery/gallery5.png';
import gallery6 from '../images/Gallery/gallery6.png';
import gallery7 from '../images/Gallery/gallery7.png';
import gallery8 from '../images/Gallery/gallery8.png';
import gallery9 from '../images/Gallery/gallery9.png';
import gallery10 from '../images/Gallery/gallery10.png';
import gallery11 from '../images/Gallery/gallery11.png';
import gallery12 from '../images/Gallery/gallery12.png';
import gallery13 from '../images/Gallery/gallery13.png';
import gallery14 from '../images/Gallery/gallery14.png';
import gallery15 from '../images/Gallery/gallery15.png';
import gallery16 from '../images/Gallery/gallery16.png';
import gallery17 from '../images/Gallery/gallery17.png';
import gallery18 from '../images/Gallery/gallery18.png';

const images = [
  // Only height matters now for the masonry effect; width will fill the column
  { src: gallery1, alt: 'Img 1', height: 300 },
  { src: gallery2, alt: 'Img 2', height: 300 },
  { src: gallery3, alt: 'Img 3', height: 300 },
  { src: gallery4, alt: 'Img 4', height: 300 },
  { src: gallery5, alt: 'Trophy', height: 600 }, // Spans down across 2 rows
  { src: gallery6, alt: 'Img 6', height: 300 },
  { src: gallery7, alt: 'Img 7', height: 300 },
  { src: gallery10, alt: 'Img 10', height: 300 },
  { src: gallery9, alt: 'Img 9', height: 600 },
  { src: gallery8, alt: 'Img 8', height: 300 },
  { src: gallery11, alt: 'Img 11', height: 600 },
  { src: gallery12, alt: 'Img 12', height: 300 },
  { src: gallery14, alt: 'Img 14', height: 600, wide: true },
  { src: gallery13, alt: 'Group Photo', height: 600 },
  { src: gallery15, alt: 'Img 15', height: 300 },
  { src: gallery16, alt: 'Img 16', height: 300 },
  { src: gallery17, alt: 'Img 17', height: 300 },
  { src: gallery18, alt: 'Img 18', height: 300 },
];

const Gallery = () => {
  return (
    <>
      <div className="gallery-section">
        <h2>GALLERY</h2>
        <div className="gallery-grid">
          {images.map((image, idx) => (
            <div
              key={idx}
              className={`gallery-item ${image.wide ? 'wide' : ''}`}
              style={{
                // Mapping height to 10px grid units
                gridRowEnd: `span ${Math.round(image.height / 30)}`,
              }}
            >
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Gallery;