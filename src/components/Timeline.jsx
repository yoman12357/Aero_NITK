import React, { useEffect } from 'react';
import './Timeline.css';

const Timeline = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item) => observer.observe(item));

    return () => items.forEach((item) => observer.unobserve(item));
  }, []);

  // ==========================================
  // EDIT YOUR TIMELINE DATA HERE
  // ==========================================
  const timelineData = [
    {
      year: '2020',
      title: 'Inception',
      description: 'Aero NITK was founded with a vision to innovate in unmanned aerial systems.',
    },
    {
      year: '2021',
      title: 'First Flight',
      description: 'Successfully designed and tested our first fixed-wing prototype, the "Falcon-X".',
    },
    {
      year: '2022',
      title: 'National Recognition',
      description: 'Secured 3rd place at the SAE Aero Design Challenge amongst 50+ teams.',
    },
    {
      year: '2023',
      title: 'Tech Expansion',
      description: 'Expanded into avionics research, developing custom flight controllers.',
    },
    {
      year: '2020',
      title: 'Global Stage',
      description: 'Qualified for the international UAV challenge, showcasing our VTOL drone.',
    },
  ];

  return (
    <div className="timeline-container">
      <h2 className="timeline-header">OUR JOURNEY</h2>
      <div className="timeline">
        {timelineData.map((item, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <span className="timeline-year">{item.year}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;