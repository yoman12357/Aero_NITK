import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './Gallery.css';
import Footer from './footer';
import gallery1 from '/gallery_1.png';
import gallery2 from '/gallery_2.png';
import gallery3 from '/gallery_3.png';
import gallery4 from '/gallery_4.png';
import gallery5 from '/gallery_5.png';
import gallery6 from '/gallery_6.png';
import gallery7 from '/gallery_7.png';
import gallery8 from '/gallery_8.png';
import gallery9 from '/gallery_9.png';
import gallery10 from '/gallery_10.png';
import gallery11 from '/gallery_11.png';
import gallery12 from '/gallery_12.png';
import gallery13 from '/gallery_13.png';
import gallery14 from '/gallery_14.png';
import gallery15 from '/gallery_15.png';
import gallery16 from '/gallery_16.png';
import gallery17 from '/gallery_17.png';
import gallery18 from '/gallery_18.png';
import gallery19 from '/gallery_19.png';
import gallery20 from '/gallery_20.png';
import gallery21 from '/gallery_21.png';
import gallery22 from '/gallery_22.png';
import gallery23 from '/gallery_23.png';
import gallery24 from '/gallery_24.png';
import gallery25 from '/gallery_25.png';
import gallery26 from '/gallery_26.png';
import gallery27 from '/gallery_27.png';
import gallery28 from '/gallery_28.png';
import gallery29 from '/gallery_29.png';
import gallery30 from '/gallery_30.png';
import gallery31 from '/gallery_31.png';
import gallery32 from '/gallery_32.png';
import gallery33 from '/gallery_33.png';
import gallery34 from '/gallery_34.png';
import gallery35 from '/gallery_35.png';

const galleryFolders = [
  {
    title: 'Events',
    cover: gallery5,
    layout: 'events',
    images: [
      { src: gallery2, size: 'standard' },
      { src: gallery26, size: 'standard' },
      { src: gallery5, size: 'tall' },
      { src: gallery9, size: 'wide' },
      { src: gallery31, size: 'standard' },
      { src: gallery15, size: 'standard' },
      { src: gallery11, size: 'tall' },
      { src: gallery14, size: 'wide' },
    ],
  },
  {
    title: 'Team',
    cover: gallery35,
    layout: 'team',
    images: [
      { src: gallery35, size: 'standard' },
      { src: gallery28, size: 'standard' },
      { src: gallery21, size: 'standard' },
      { src: gallery19, size: 'wide' },
      { src: gallery7, size: 'standard' },
      { src: gallery1, size: 'standard' },
      { src: gallery12, size: 'standard' },
      { src: gallery13, size: 'standard' },
    ],
  },
  {
    title: 'Aircrafts',
    cover: gallery34,
    layout: 'aircrafts',
    images: [
      { src: gallery34, size: 'standard' },
      { src: gallery10, size: 'tall' },
      { src: gallery3, size: 'standard' },
      { src: gallery23, size: 'standard' },
      { src: gallery24, size: 'standard' },
      { src: gallery27, size: 'wide' },
      { src: gallery29, size: 'tall' },
      { src: gallery30, size: 'standard' },
    ],
  },
  {
    title: 'Workshop',
    cover: gallery22,
    layout: 'workshop',
    images: [
      { src: gallery22, size: 'standard' },
      { src: gallery16, size: 'standard' },
      { src: gallery33, size: 'standard' },
      { src: gallery6, size: 'standard' },
      { src: gallery4, size: 'standard' },
      { src: gallery18, size: 'standard' },
      { src: gallery20, size: 'standard' },
      { src: gallery6, size: 'standard' },
      { src: gallery32, size: 'standard' },
      
    ],
  },
];

const Gallery = () => {
  const [activeFolder, setActiveFolder] = useState(null);
  const selectedFolder = galleryFolders.find((folder) => folder.title === activeFolder);

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
        <h1>{selectedFolder ? selectedFolder.title : 'GALLERY'}</h1>

        {selectedFolder ? (
          <>
            <button className="gallery-back" type="button" onClick={() => setActiveFolder(null)}>
              Back
            </button>

            <div className={`gallery-photo-grid ${selectedFolder.layout}`}>
              {selectedFolder.images.map((image, index) => (
                <figure
                  className={`gallery-photo ${image.size}`}
                  key={`${selectedFolder.title}-${index}`}
                >
                  <img src={image.src} alt={`${selectedFolder.title} ${index + 1}`} loading="lazy" />
                </figure>
              ))}
            </div>
          </>
        ) : (
          <div className="gallery-grid">
            {galleryFolders.map((folder) => (
              <button
                className="gallery-card"
                key={folder.title}
                type="button"
                onClick={() => setActiveFolder(folder.title)}
              >
                <img src={folder.cover} alt={`${folder.title} gallery`} loading="lazy" />
                <span className="gallery-card-overlay" />
                <span>{folder.title}</span>
              </button>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default Gallery;
