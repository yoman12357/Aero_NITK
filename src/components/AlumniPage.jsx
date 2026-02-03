import React from 'react';
import { Link } from 'react-router-dom';
import './AlumniPage.css';
import Footer from './footer.jsx';

import alumniImg1 from '../images/alumni/alumni1.png';
// import alumniImg2 from '../images/alumini/alumni2.png';

const AlumniPage = () => {
    const alumniBatches = [
        { id: '2024', title: '2024', img: alumniImg1 },
        // { id: 'BATCH', title: 'BATCH', img: alumniImg2 },
    ];

    return (
        <div className="alumni-page-wrapper">
            <main className="alumni-container">
                <h1 className="alumni-header-text">ALUMNI</h1>

                <div className="alumni-grid">
                    {alumniBatches.map((batch) => (
                        <Link to={`/alumni/${batch.id}`} key={batch.id} className="alumni-card-link">
                            <div className="alumni-card">
                                <div className="alumni-card-overlay">
                                    <img
                                        src={batch.img}
                                        alt={`Batch ${batch.title}`}
                                        className="alumni-img"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/604x342?text=Image+Not+Found'; }}
                                    />
                                    <div className="batch-overlay-text">{batch.title}</div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AlumniPage;