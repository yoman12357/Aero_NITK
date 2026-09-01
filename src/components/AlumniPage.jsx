// import React from 'react';
// import { Link } from 'react-router-dom';
// import './AlumniPage.css';
// import Footer from './footer.jsx';

// import alumniImg1 from '../images/alumni/alumni1.png';
// // import alumniImg2 from '../images/alumini/alumni2.png';

// const AlumniPage = () => {
//     const alumniBatches = [
//         { id: '2024', title: '2024', img: alumniImg1 },
//         // { id: 'BATCH', title: 'BATCH', img: alumniImg2 },
//     ];

//     return (
//         <div className="alumni-page-wrapper">
//             <main className="alumni-container">
//                 <h1 className="alumni-header-text">ALUMNI</h1>

//                 <div className="alumni-grid">
//                     {alumniBatches.map((batch) => (
//                         <Link to={`/alumni/${batch.id}`} key={batch.id} className="alumni-card-link">
//                             <div className="alumni-card">
//                                 <div className="alumni-card-overlay">
//                                     <img
//                                         src={batch.img}
//                                         alt={`Batch ${batch.title}`}
//                                         className="alumni-img"
//                                         onError={(e) => { e.target.src = 'https://via.placeholder.com/604x342?text=Image+Not+Found'; }}
//                                     />
//                                     <div className="batch-overlay-text">{batch.title}</div>
//                                 </div>
//                             </div>
//                         </Link>
//                     ))}
//                 </div>
//             </main>
//             <Footer />
//         </div>
//     );
// };

// export default AlumniPage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AlumniPage.css';
import Footer from './footer.jsx';
import { Helmet } from 'react-helmet-async';
import { getStoredAlumni, getStoredBatches, initialBatchCovers, ALUMNI_UPDATED_EVENT } from '../data/alumniData.js';

const AlumniPage = () => {
    const [alumniData, setAlumniData] = useState(getStoredAlumni);
    const [batches, setBatches] = useState(getStoredBatches);

    useEffect(() => {
        const handleUpdate = () => {
            setAlumniData(getStoredAlumni());
            setBatches(getStoredBatches());
        };
        window.addEventListener(ALUMNI_UPDATED_EVENT, handleUpdate);
        window.addEventListener('storage', handleUpdate);
        return () => {
            window.removeEventListener(ALUMNI_UPDATED_EVENT, handleUpdate);
            window.removeEventListener('storage', handleUpdate);
        };
    }, []);

    // Combine batch folders with any additional batches present in alumni data
    const batchMap = new Map();
    batches.forEach(b => {
        batchMap.set(b.id || b.year, {
            id: b.id || b.year,
            title: b.year || b.name || b.id,
            img: b.cover || initialBatchCovers[b.id] || initialBatchCovers['2025'],
            count: (alumniData[b.id] || alumniData[b.year] || []).length
        });
    });

    Object.keys(alumniData).forEach(key => {
        if (!batchMap.has(key)) {
            batchMap.set(key, {
                id: key,
                title: key,
                img: initialBatchCovers[key] || initialBatchCovers['2025'],
                count: (alumniData[key] || []).length
            });
        }
    });

    const alumniBatches = Array.from(batchMap.values()).sort((a, b) => b.id.localeCompare(a.id));

    return (
        <div className="alumni-page-wrapper">
            <Helmet>
                <title>Alumni | Aero NITK</title>
                <meta name="description" content="Our alumni are our pride. Explore the achievements and career paths of former Aero NITK members." />
                <link rel="canonical" href="https://aeronitk.in/alumni" />
            </Helmet>
            <main className="alumni-container">
                <h1 className="alumni-header-text">ALUMNI</h1>

                <div className="alumni-grid">
                    {alumniBatches.map((batch) => (
                        <Link
                            to={`/alumni/${batch.id}`}
                            key={batch.id}
                            className="alumni-card-link"
                        >
                            <div className="alumni-card">
                                <img
                                    src={batch.img}
                                    alt={`Batch ${batch.title}`}
                                    className="alumni-img"
                                    loading="lazy"
                                />
                                <div className="batch-overlay-text">
                                    {batch.title}
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
