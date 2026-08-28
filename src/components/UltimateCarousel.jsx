///carousel page on home page 
import React, { useState, useEffect, useRef, useCallback } from "react";
import "./UltimateCarousel.css";
import Achievement1 from '../images/Achievements/Achievements_1.webp'
import Achievement2 from '../images/Achievements/Achievements_2.webp'
import Achievement3 from '../images/Achievements/Achievements_3.webp'
import Achievement4 from '../images/Achievements/Achievements_4.webp'


const UltimateCarousel = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const intervalRef = useRef(null);

  const images = [
    Achievement1,
    Achievement2,
    Achievement3,
    Achievement4,

  ];

  const totalSlides = images.length;

  const stopAutoplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    intervalRef.current = setInterval(() => {
      setSlideIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, 4000);
  }, [stopAutoplay, totalSlides]);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  const changeSlide = (direction) => {
    stopAutoplay();
    setSlideIndex((prev) => {
      if (direction > 0) return prev === totalSlides - 1 ? 0 : prev + 1;
      return prev === 0 ? totalSlides - 1 : prev - 1;
    });
    startAutoplay();
  };

  const goToSlide = (index) => {
    stopAutoplay();
    setSlideIndex(index);
    startAutoplay();
  };

  return (
    <div className="carousel-container">
      <div
        className="ultimate-carousel"
        onMouseEnter={stopAutoplay}
        onMouseLeave={startAutoplay}
      >
        <button className="nav-btn prev" onClick={() => changeSlide(-1)}>
          <span className="chevron">‹</span>
        </button>
        <button className="nav-btn next" onClick={() => changeSlide(1)}>
          <span className="chevron">›</span>
        </button>

        <div className="slides-container">
          <div
            className="slides-wrapper"
            style={{ transform: `translateX(-${slideIndex * 100}%)` }}
          >
            {images.map((src, idx) => (
              <div
                key={idx}
                className="slide"
                style={{ backgroundImage: `url(${src})` }}
              />
            ))}
          </div>
        </div>

        <div className="dots-overlay">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`dot ${idx === slideIndex ? "active" : ""}`}
              onClick={() => goToSlide(idx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UltimateCarousel;
