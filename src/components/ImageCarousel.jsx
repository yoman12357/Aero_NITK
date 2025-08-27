import React, { useState, useEffect, useRef } from 'react';
import './ImageCarousel.css';

// It is crucial to use the correct import paths for your image files.
// Please ensure the paths below match your project structure.
import img1 from '../images/gallery1.png';
import img2 from '../images/gallery2.png';
import img3 from '../images/gallery3.png';

const images = [img1, img2, img3];

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  // useEffect to handle the auto-scrolling behavior
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 2500);

    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex]);

  // Function to change the slide when an arrow button is clicked
  const goToSlide = (index) => {
    setCurrentIndex(index);
    clearTimeout(timeoutRef.current);
  };

  // Calculate the index for the previous and next slides
  const prevIndex = (currentIndex - 1 + images.length) % images.length;
  const nextIndex = (currentIndex + 1) % images.length;

  return (
    <section className="carousel-section">
      <h2 className="carousel-heading">CAROUSEL</h2>
      <div className="carousel-strip">
        {/* The left side slide */}
        <div className="carousel-slide side left">
          <img src={images[prevIndex]} alt={`Slide ${prevIndex + 1}`} />
        </div>

        {/* The main, active slide with the arrows positioned inside */}
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

        {/* The right side slide */}
        <div className="carousel-slide side right">
          <img src={images[nextIndex]} alt={`Slide ${nextIndex + 1}`} />
        </div>
      </div>
    </section>
  );
};

export default ImageCarousel;
