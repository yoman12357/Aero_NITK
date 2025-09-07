import React, { useState, useEffect, useRef } from "react";
import "./UltimateCarousel.css";
import gallery1 from '../images/gallery1.png';
import gallery2 from '../images/gallery2.png';
import gallery3 from '../images/gallery3.png';

const UltimateCarousel = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const intervalRef = useRef();

  const images = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2071&q=80",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2074&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1418065460487-3956c3aa1234?auto=format&fit=crop&w=2070&q=80",
    gallery1,
    gallery2,
    gallery3
  ];

  const totalSlides = images.length;

  const changeSlide = (direction) => {
    setSlideIndex((prevIndex) => {
      if (direction > 0) {
        return prevIndex === totalSlides - 1 ? 0 : prevIndex + 1;
      } else {
        return prevIndex === 0 ? totalSlides - 1 : prevIndex - 1;
      }
    });
  };

  const goToSlide = (index) => {
    setSlideIndex(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) changeSlide(1);
    if (isRightSwipe) changeSlide(-1);
  };

  useEffect(() => {
    if (isAutoPlay) {
      intervalRef.current = setInterval(() => {
        changeSlide(1);
      }, 4000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isAutoPlay, slideIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") changeSlide(-1);
      if (e.key === "ArrowRight") changeSlide(1);
      if (e.key === " ") {
        e.preventDefault();
        toggleAutoPlay();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="carousel-container">
      <div className="ultimate-carousel fade-in">
        {isLoading && <div className="loading"></div>}

        <div className="autoplay-btn" onClick={toggleAutoPlay} aria-label={isAutoPlay ? "Pause autoplay" : "Play autoplay"}>
          <i className={`fas ${isAutoPlay ? "fa-pause" : "fa-play"}`} />
        </div>

        <div className="slide-counter">
          {slideIndex + 1} / {totalSlides}
        </div>

        <div
          className="slides-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="slides-wrapper"
            style={{
              transform: `translateX(-${slideIndex * 100}%)`,
            }}
          >
            {images.map((src, idx) => (
              <div key={idx} className="slide">
                <img src={src} alt={`Slide ${idx + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        <div
          className="progress-bar"
          style={{
            width: `${((slideIndex + 1) / totalSlides) * 100}%`,
          }}
        ></div>

        <button className="nav-btn prev" onClick={() => changeSlide(-1)} aria-label="Previous slide">
          <i className="fas fa-chevron-left" />
        </button>

        <button className="nav-btn next" onClick={() => changeSlide(1)} aria-label="Next slide">
          <i className="fas fa-chevron-right" />
        </button>

        <div className="dots-container">
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`dot ${idx === slideIndex ? "active" : ""}`}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UltimateCarousel;
