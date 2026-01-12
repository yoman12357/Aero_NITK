import React, { useState, useEffect, useRef } from "react";
import "./UltimateCarousel.css";

const UltimateCarousel = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const intervalRef = useRef(null);

  const images = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2071&q=80",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2074&q=80"
  ];

  const totalSlides = images.length;

  const startAutoplay = () => {
    stopAutoplay();
    intervalRef.current = setInterval(() => {
      setSlideIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, 4000);
  };

  const stopAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, []);

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