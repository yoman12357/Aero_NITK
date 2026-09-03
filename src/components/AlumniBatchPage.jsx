import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Footer from "./footer.jsx";
import "./AlumniPage.css";
import { Helmet } from 'react-helmet-async';
import ProfileCard from "./ui/ProfileCard.jsx";
import { fetchAlumniBatchDetail } from "../data/alumniData.js";

const AlumniBatchPage = () => {
  const { batchId } = useParams();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const data = await fetchAlumniBatchDetail(batchId);
        if (isMounted) setBatch(data);
      } catch (err) {
        console.error('Error loading batch details:', err);
        if (isMounted) setError('Could not load this batch. Please try again later.');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [batchId]);

  const alumniList = batch?.members || [];

  return (
    <div className="alumni-page-wrapper">
      <Helmet>
        <title>Batch {batchId} Alumni | Aero NITK</title>
        <meta name="description" content={`Explore the records and member details for the Aero NITK Alumni Batch ${batchId}.`} />
        <link rel="canonical" href={`https://aeronitk.in/alumni/${batchId}`} />
      </Helmet>
      <main className="alumni-container">
        <h1 className="alumni-header-text">Batch {batch?.year || batchId}</h1>

        {loading ? (
          <div style={{ color: '#aaa', textAlign: 'center', margin: '40px 0', fontSize: '1.1rem' }}>
            Loading alumni...
          </div>
        ) : error ? (
          <div style={{ color: '#ff6b6b', textAlign: 'center', margin: '40px 0', fontSize: '1.1rem' }}>
            {error}
          </div>
        ) : alumniList.length === 0 ? (
          <div style={{ color: '#aaa', textAlign: 'center', margin: '40px 0', fontSize: '1.1rem' }}>
            No alumni records found for Batch {batchId}.
          </div>
        ) : (
          <div className="alumni-list-grid">
            {alumniList.map((alumni, index) => (
              <ProfileCard
                key={alumni.id || index}
                name={alumni.name}
                image={alumni.image}
                linkedin={alumni.linkedin}
              />
            ))}
          </div>
        )}

        <Link to="/alumni" className="back-button">
          ← Back to Alumni
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default AlumniBatchPage;