import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AlumniPage.css';
import Footer from './footer.jsx';
import { Helmet } from 'react-helmet-async';
import { fetchAlumniBatches } from '../data/alumniData.js';
import defaultBatchCover from '../images/alumni/alumni1.png';

const AlumniPage = () => {
    const [alumniBatches, setAlumniBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const batches = await fetchAlumniBatches();
                if (isMounted) {
                    setAlumniBatches(
                        [...batches].sort((a, b) => (b.year || '').localeCompare(a.year || ''))
                    );
                }
            } catch (err) {
                console.error('Error loading alumni batches:', err);
                if (isMounted) setError('Could not load alumni batches. Please try again later.');
            } finally {
                if (isMounted) setLoading(false);
            }
        })();
        return () => { isMounted = false; };
    }, []);

    return (
        <div className="alumni-page-wrapper">
            <Helmet>
                <title>Alumni | Aero NITK</title>
                <meta name="description" content="Our alumni are our pride. Explore the achievements and career paths of former Aero NITK members." />
                <link rel="canonical" href="https://aeronitk.in/alumni" />
            </Helmet>
            <main className="alumni-container">
                <h1 className="alumni-header-text">ALUMNI</h1>

                {loading ? (
                    <div style={{ color: '#aaa', textAlign: 'center', margin: '40px 0' }}>
                        Loading alumni batches...
                    </div>
                ) : error ? (
                    <div style={{ color: '#ff6b6b', textAlign: 'center', margin: '40px 0' }}>
                        {error}
                    </div>
                ) : alumniBatches.length === 0 ? (
                    <div style={{ color: '#aaa', textAlign: 'center', margin: '40px 0' }}>
                        No alumni batches published yet.
                    </div>
                ) : (
                    <div className="alumni-grid">
                        {alumniBatches.map((batch) => (
                            <Link
                                to={`/alumni/${batch.year || batch.id}`}
                                key={batch.id}
                                className="alumni-card-link"
                            >
                                <div className="alumni-card">
                                    <img
                                        src={batch.cover || defaultBatchCover}
                                        alt={`Batch ${batch.name || batch.year}`}
                                        className="alumni-img"
                                        loading="lazy"
                                        onError={(e) => { e.target.src = defaultBatchCover; }}
                                    />
                                    <div className="batch-overlay-text">
                                        {batch.name || batch.year}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default AlumniPage;