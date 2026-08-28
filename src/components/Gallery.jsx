import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import './Gallery.css';
import Footer from './footer';

const Gallery = () => {
  const [galleryFolders, setGalleryFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://aeronitk-backend.onrender.com';

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/gallery-folders`);
        const result = await response.json();
        if (result.success) {
          setGalleryFolders(result.folders || []);
        }
      } catch (error) {
        console.error('Failed to fetch gallery folders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [backendUrl]);

  const selectedFolder = galleryFolders?.find((folder) => folder.name === activeFolder) || null;

  // Determine layout dynamically based on the number of images present
  const imageCount = selectedFolder?.images?.length || 0;
  const dynamicLayoutClass = imageCount === 1 ? 'layout-single' : imageCount <= 4 ? 'layout-grid-small' : 'layout-grid-dynamic';

  return (
    <>
      <Helmet>
        <title>Gallery | Aero NITK</title>
        <meta
          name="description"
          content="Explore Aero NITK's events, team moments, aircraft builds, and workshop memories."
        />
        <link rel="canonical" href="https://aeronitk.in/gallery" />
      </Helmet>

      <main className="gallery-section">
        <h1>{selectedFolder ? selectedFolder.name : 'GALLERY'}</h1>

        {loading ? (
          <div className="gallery-loading">Loading gallery...</div>
        ) : selectedFolder ? (
          <>
            <button className="gallery-back" type="button" onClick={() => setActiveFolder(null)}>
              Back
            </button>

            <div className={`gallery-photo-grid ${dynamicLayoutClass}`}>
              {selectedFolder.images && selectedFolder.images.length > 0 ? (
                selectedFolder.images.map((image, index) => (
                  <figure
                    className="gallery-photo standard"
                    key={image._key || index}
                  >
                    <img src={image.src} alt={`${selectedFolder.name} ${index + 1}`} loading="lazy" />
                  </figure>
                ))
              ) : (
                <p>No photos available in this folder yet.</p>
              )}
            </div>
          </>
        ) : (
          <div className="gallery-grid-container">
            <div className="gallery-grid">
              {galleryFolders.map((folder) => (
                <button
                  className="gallery-card"
                  key={folder._id || folder.name}
                  type="button"
                  onClick={() => setActiveFolder(folder.name)}
                >
                  {folder.cover && <img src={folder.cover} alt={`${folder.name} gallery`} loading="lazy" />}
                  <span className="gallery-card-overlay" />
                  <span>{folder.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default Gallery;