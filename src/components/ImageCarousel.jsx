import React, { useState, useEffect, useRef } from 'react';
import './ImageCarousel.css';

import img1 from '../images/gallery1.png';
import img2 from '../images/gallery2.png';
import img3 from '../images/gallery3.png';

const images = [img1, img2, img3];

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 2500);

    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    clearTimeout(timeoutRef.current);
  };

  const prevIndex = (currentIndex - 1 + images.length) % images.length;
  const nextIndex = (currentIndex + 1) % images.length;

  return (
    <section className="carousel-section">
      <h2 className="carousel-heading">CAROUSEL</h2>
      <div className="carousel-strip">
        <div className="carousel-slide side left">
          <img src={images[prevIndex]} alt={`Slide ${prevIndex + 1}`} />
        </div>

        <div className="carousel-slide active">
          <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} />
          <button 
            className="carousel-arrow left" 
            onClick={() => goToSlide(prevIndex)} 
            aria-label="Previous Slide">
            &#10094;
          </button>
          <button 
            className="carousel-arrow right" 
            onClick={() => goToSlide(nextIndex)} 
            aria-label="Next Slide">
            &#10095;
          </button>
        </div>

        <div className="carousel-slide side right">
          <img src={images[nextIndex]} alt={`Slide ${nextIndex + 1}`} />
        </div>
      </div>
    </section>
  );
};

export default ImageCarousel;