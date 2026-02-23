// ///Gallery page in the header
// import React from 'react';
// import './Gallery.css';
// import Footer from './footer';

// import gallery1 from '/gallery_1.png';
// import gallery2 from '/gallery_2.png';
// import gallery3 from '/gallery_3.png';
// import gallery4 from '/gallery_4.png';
// import gallery5 from '/gallery_5.png';
// import gallery6 from '/gallery_6.png';
// import gallery7 from '/gallery_7.png';
// import gallery8 from '/gallery_8.png';
// // import gallery9 from '/gallery_9.png';
// // import gallery10 from '/gallery_10.png';
// import gallery11 from '/gallery_11.png';
// import gallery12 from '/gallery_12.png';
// import gallery13 from '/gallery_13.png';
// import gallery14 from '/gallery_14.png';
// import gallery15 from '/gallery_15.png';
// import gallery16 from '/gallery_16.png';
// import gallery17 from '/gallery_17.png';
// import gallery18 from '/gallery_18.png';

// const images = [
//   { src: gallery1, alt: 'Img 1', height: 300 },
//   { src: gallery2, alt: 'Img 2', height: 300 },
//   { src: gallery3, alt: 'Img 3', height: 300 },
//   { src: gallery4, alt: 'Img 4', height: 300 },
//   { src: gallery5, alt: 'Trophy', height: 600 }, // Spans down across 2 rows
//   { src: gallery6, alt: 'Img 6', height: 300 },
//   { src: gallery7, alt: 'Img 7', height: 300 },
//   { src: gallery8, alt: 'Img 8', height: 300 },
//   // { src: gallery9, alt: 'Group photo',height: 600},
//   // { src: gallery10, alt: 'Img 10', height: 600 },
//   { src: gallery11, alt: 'Img 11', height: 300 },
//   { src: gallery12, alt: 'Img 12', height: 300 },
//   { src: gallery13, alt: 'Img 14', height: 300},
//   { src: gallery14, alt: 'Group Photo', height: 600 ,wide:true},
//   { src: gallery15, alt: 'Img 15', height: 600 },
//   { src: gallery16, alt: 'Img 16', height: 300 },
//   { src: gallery17, alt: 'Img 17', height: 600 },
//   { src: gallery18, alt: 'Img 18', height: 300 },
// ];

// const Gallery = () => {
//   return (
//     <>
//       <div className="gallery-section">
//         <h2>GALLERY</h2>
//         <div className="gallery-grid">
//           {images.map((image, idx) => (
//             <div
//               key={idx}
//               className={`gallery-item ${image.wide ? 'wide' : ''}`}
//               style={{
//                 gridRowEnd: `span ${Math.round(image.height / 30)}`,
//               }}
//             >
//               <img src={image.src} alt={image.alt} />
//             </div>
//           ))}
//         </div>
//       </div>
//       <Footer />

//     </>
//   );
// };

// export default Gallery;

// Gallery page
import React from 'react';
import './Gallery.css';
import Footer from './footer';
import { Helmet } from 'react-helmet-async';

// Images (Vite / public folder)
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

/**
 * rowSpan × grid-auto-rows = height
 * colSpan × column width = width
 */
const images = [
  { src: gallery1, alt: 'Img 1', rowSpan: 10, colSpan: 1 },
  { src: gallery2, alt: 'Img 2', rowSpan: 10, colSpan: 1 },
  { src: gallery3, alt: 'Img 3', rowSpan: 10, colSpan: 1 },

  { src: gallery4, alt: 'Img 4', rowSpan: 10, colSpan: 1 },
  { src: gallery5, alt: 'Trophy', rowSpan: 20, colSpan: 1 },

  { src: gallery6, alt: 'Img 6', rowSpan: 10, colSpan: 1 },
  { src: gallery7, alt: 'Img 7', rowSpan: 10, colSpan: 1 },
  { src: gallery8, alt: 'Img 8', rowSpan: 10, colSpan: 1 },

  { src: gallery9, alt: 'Img 9', rowSpan: 20, colSpan: 2 },
  { src: gallery10, alt: 'Img 10', rowSpan: 20, colSpan: 1 },


  { src: gallery11, alt: 'Img 11', rowSpan: 10, colSpan: 1 },
  { src: gallery12, alt: 'Img 12', rowSpan: 10, colSpan: 1 },
  { src: gallery13, alt: 'Img 13', rowSpan: 10, colSpan: 1 },

  { src: gallery14, alt: 'Group Photo', rowSpan: 20, colSpan: 3 },

  { src: gallery15, alt: 'Img 15', rowSpan: 20, colSpan: 1 },
  { src: gallery16, alt: 'Img 16', rowSpan: 10, colSpan: 1 },
  { src: gallery17, alt: 'Img 17', rowSpan: 20, colSpan: 1 },
  { src: gallery18, alt: 'Img 18', rowSpan: 10, colSpan: 1 },

  { src: gallery19, alt: 'Img 19', rowSpan: 20, colSpan: 2 },
  { src: gallery20, alt: 'Img 20', rowSpan: 10, colSpan: 1 },
  { src: gallery21, alt: 'Img 21', rowSpan: 10, colSpan: 1 },

  { src: gallery22, alt: 'Img 22', rowSpan: 10, colSpan: 1 },
  { src: gallery23, alt: 'Img 23', rowSpan: 10, colSpan: 1 },
  { src: gallery24, alt: 'Img 24', rowSpan: 10, colSpan: 1 },

  { src: gallery25, alt: 'Img 25', rowSpan: 20, colSpan: 2 },
  { src: gallery26, alt: 'Img 26', rowSpan: 10, colSpan: 1 },
  { src: gallery27, alt: 'Img 27', rowSpan: 10, colSpan: 1 },

  { src: gallery28, alt: 'Img 28', rowSpan: 10, colSpan: 1 },
  { src: gallery29, alt: 'Img 29', rowSpan: 10, colSpan: 1 },
  { src: gallery30, alt: 'Img 30', rowSpan: 10, colSpan: 1 },

  { src: gallery31, alt: 'Img 31', rowSpan: 20, colSpan: 1 },
  { src: gallery32, alt: 'Img 32', rowSpan: 10, colSpan: 1 },
  { src: gallery33, alt: 'Img 33', rowSpan: 10, colSpan: 1 },
  { src: gallery34, alt: 'Img 34', rowSpan: 10, colSpan: 1 },
  { src: gallery35, alt: 'Img 35', rowSpan: 10, colSpan: 1 },
];

const Gallery = () => {
  return (
    <>
      <Helmet>
        <title>Gallery | Aero NITK</title>
        <meta name="description" content="Explore a collection of memories and technical milestones from Aero NITK's journey in aeromodelling." />
        <link rel="canonical" href="https://aeronitk.in/gallery" />
      </Helmet>
      <div className="gallery-section">
        <h1>GALLERY</h1>

        <div className="gallery-grid">
          {images.map((image, idx) => (
            <div
              key={idx}
              className="gallery-item"
              style={{
                gridRowEnd: `span ${image.rowSpan}`,
                gridColumnEnd: `span ${image.colSpan}`,
              }}
            >
              <img src={image.src} alt={image.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Gallery;

