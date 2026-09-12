import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import './Gallery.css';
import Footer from './footer';

const SUMMARY_CACHE_KEY = 'gallery-summary-cache-v1';
const folderDetailCacheKey = (id) => `gallery-folder-detail-v1-${id}`;

function readCache(key) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // sessionStorage full or unavailable — silently skip caching
  }
}

const Gallery = () => {
  const [galleryFolders, setGalleryFolders] = useState(() => readCache(SUMMARY_CACHE_KEY) || []);
  const [hasLoadedSummaryOnce, setHasLoadedSummaryOnce] = useState(() => !!readCache(SUMMARY_CACHE_KEY));
  const [activeFolderId, setActiveFolderId] = useState(null);
  const [folderDetails, setFolderDetails] = useState({}); // in-memory cache: { [folderId]: { images, ... } }
  const fetchedFolderIds = useRef(new Set());

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://aeronitk-backend.onrender.com';

  useEffect(() => {
    let isMounted = true;
    // Always refresh in the background, even if we already showed cached
    // data instantly — this keeps things eventually-consistent without
    // ever blocking the page with a loading state.
    (async () => {
      try {
        const response = await fetch(`${backendUrl}/api/gallery-summary`);
        const result = await response.json();
        if (isMounted && result.success) {
          setGalleryFolders(result.folders || []);
          writeCache(SUMMARY_CACHE_KEY, result.folders || []);
        }
      } catch (error) {
        console.error('Failed to fetch gallery folders:', error);
      } finally {
        if (isMounted) setHasLoadedSummaryOnce(true);
      }
    })();
    return () => { isMounted = false; };
  }, [backendUrl]);

  const openFolder = useCallback(async (folder) => {
    setActiveFolderId(folder._id);

    // Hydrate instantly from sessionStorage if we've opened this folder
    // before in this tab, even after a full page reload.
    if (!folderDetails[folder._id]) {
      const cached = readCache(folderDetailCacheKey(folder._id));
      if (cached) {
        setFolderDetails((prev) => ({ ...prev, [folder._id]: cached }));
      }
    }

    // Don't refetch a folder we've already fetched fresh this session.
    if (fetchedFolderIds.current.has(folder._id)) return;
    fetchedFolderIds.current.add(folder._id);

    try {
      const response = await fetch(`${backendUrl}/api/gallery-folders/${folder._id}`);
      const result = await response.json();
      if (result.success && result.folder) {
        setFolderDetails((prev) => ({ ...prev, [folder._id]: result.folder }));
        writeCache(folderDetailCacheKey(folder._id), result.folder);
      }
    } catch (error) {
      console.error('Failed to fetch folder details:', error);
      fetchedFolderIds.current.delete(folder._id); // allow retry on next open
    }
  }, [backendUrl, folderDetails]);

  const summaryFolder = galleryFolders.find((f) => f._id === activeFolderId) || null;
  const detailFolder = activeFolderId ? folderDetails[activeFolderId] : null;
  const selectedFolder = detailFolder || summaryFolder;

  const images = detailFolder?.images || [];
  const imageCount = images.length;
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

        {selectedFolder ? (
          <>
            <button className="gallery-back" type="button" onClick={() => setActiveFolderId(null)}>
              Back
            </button>

            <div className={`gallery-photo-grid ${dynamicLayoutClass}`}>
              {images.length > 0 ? (
                images.map((image, index) => (
                  <figure className="gallery-photo standard" key={image._key || index}>
                    <img
                      src={image.src}
                      alt={`${selectedFolder.name} ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                ))
              ) : detailFolder ? (
                <p>No photos available in this folder yet.</p>
              ) : null}
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
                  onClick={() => openFolder(folder)}
                >
                  {folder.cover && (
                    <img
                      src={folder.cover}
                      alt={`${folder.name} gallery`}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  <span className="gallery-card-overlay" />
                  <span>{folder.name}</span>
                </button>
              ))}
              {hasLoadedSummaryOnce && galleryFolders.length === 0 && (
                <p>No gallery folders published yet.</p>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default Gallery;