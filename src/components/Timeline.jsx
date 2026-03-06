///time line components onn home page 
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


  const timelineData = [
    {
      year: '2023',
      title: 'Inception',
      description: 'Aero NITK was founded with a vision to innovate in unmanned aerial systems.',
    },
    {
      year: 'Dec 2023',
      title: 'Boeing Competition',
      description: 'National debut at Boeing competition held at IITB, strong first showing.',
    },
    {
      year: 'Feb 2024',
      title: 'NITTE Vayurva ',
      description: 'Finished 4th, narrowly missing the podium.',
    },
    {
      year: 'Dec 2024',
      title: 'IITB TechFest',
      description: 'Secured 3rd place at a national-level tech fest.',
    },
    {
      year: 'Mar 2025',
      title: 'SAE DDC Chennai',
      description: 'Won 2nd place for best aerodynamic analysis.',
    },
    {
      year: 'Nov 2025',
      title: 'JNCC Shivamogga',
      description: 'Dominated competition, securing 1st and 2nd.',
    },
    {
      year: 'Dec 2025',
      title: 'IITB Aeromodelling',
      description: 'Claimed 2nd place at IIT Bombay.',
    },
    {
      year: 'Jan 2026',
      title: 'SAE ADDC',
      description: 'Won 3rd place for best payload dropping mechanism.',
    },
    {
      year: 'Feb 2026',
      title: 'SAE DDC',
      description: 'Won 3rd place for best aerodynamic analysis.',
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