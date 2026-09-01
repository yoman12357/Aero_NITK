import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Footer from "./footer.jsx";
import "./AlumniPage.css";
import { Helmet } from 'react-helmet-async';
import ProfileCard from "./ui/ProfileCard.jsx";
import { getStoredAlumni, ALUMNI_UPDATED_EVENT } from "../data/alumniData.js";

const AlumniBatchPage = () => {
  const { batchId } = useParams();
  const [alumniData, setAlumniData] = useState(getStoredAlumni);

  useEffect(() => {
    const handleUpdate = () => {
      setAlumniData(getStoredAlumni());
    };
    window.addEventListener(ALUMNI_UPDATED_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(ALUMNI_UPDATED_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const alumniList = alumniData[batchId] || [];

  return (
    <div className="alumni-page-wrapper">
      <Helmet>
        <title>Batch {batchId} Alumni | Aero NITK</title>
        <meta name="description" content={`Explore the records and member details for the Aero NITK Alumni Batch ${batchId}.`} />
        <link rel="canonical" href={`https://aeronitk.in/alumni/${batchId}`} />
      </Helmet>
      <main className="alumni-container">
        <h1 className="alumni-header-text">Batch {batchId}</h1>

        {alumniList.length === 0 ? (
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

