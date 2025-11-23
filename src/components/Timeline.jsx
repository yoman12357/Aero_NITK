import React, { useEffect, useState } from 'react';
import './Timeline.css';

const Timeline = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Handle scroll progress for color transition
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ============================================================
  // ADD YOUR TIMELINE DATA HERE
  // Each event should have: id, year, title, description, position
  // position: 'left' or 'right'
  // ============================================================
  const timelineData = [
    {
      id: 1,
      year: '2020',
      title: 'Company Founded',
      description: 'Our journey began with a vision to transform the industry.',
      position: 'left'
    },
    {
      id: 2,
      year: '2021',
      title: 'First Product Launch',
      description: 'Successfully launched our flagship product to the market.',
      position: 'right'
    },
    {
      id: 3,
      year: '2022',
      title: 'Series A Funding',
      description: 'Raised $10M to expand our team and operations.',
      position: 'left'
    },
    {
      id: 4,
      year: '2023',
      title: 'International Expansion',
      description: 'Opened offices in 5 new countries across Europe and Asia.',
      position: 'right'
    },
    {
      id: 5,
      year: '2024',
      title: 'Major Partnership',
      description: 'Partnered with industry leaders to enhance our offerings.',
      position: 'left'
    },
    {
      id: 6,
      year: '2025',
      title: 'Innovation Award',
      description: 'Recognized as the most innovative company in our sector.',
      position: 'right'
    }
  ];
  // ============================================================
  // END OF DATA SECTION
  // ============================================================

  return (
    <div className="timeline-container">
      {/* Background overlay for color transition */}
      <div 
        className="color-overlay" 
        style={{ 
          background: `linear-gradient(to bottom, #4A90E2 ${scrollProgress}%, white ${scrollProgress}%)` 
        }}
      ></div>

      <div className="timeline-content">
        <h1 className="timeline-header">Our Journey</h1>

        <div className="timeline">
          {/* Central vertical line */}
          <div className="timeline-line"></div>

          {/* Timeline events */}
          {timelineData.map((event, index) => (
            <div
              key={event.id}
              className={`timeline-event ${event.position} fade-in`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="event-content">
                <div className="event-year">{event.year}</div>
                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">{event.description}</p>
              </div>
              <div className="event-dot"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;