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

import React, { useState } from 'react';
import './AlumniPage.css';
import Footer from './footer.jsx';

import alumniImg1 from '../images/alumni/alumni1.png';

const AlumniPage = () => {
    const [selectedBatch, setSelectedBatch] = useState(null);

    const alumniBatches = [
        { id: '2024', title: '2024', img: alumniImg1 },
        { id: '2025', title: '2025', img: alumniImg1 },
    ];

    const alumniData = {
        "2024": [
            { name: "OJAS AGRAWAL", linkedin: "https://share.google/CPtcO871FQiCzy1A4" },
            { name: "Abhiraj Pravin Mengade", linkedin: "https://share.google/o4uz5MDg6JSPFbZRk" },
            { name: "Mehul Todi", linkedin: "https://in.linkedin.com/in/mehul-todi" },
            { name: "Madhav Kumar", linkedin: "https://in.linkedin.com/in/minimaddy" },
            { name: "Mohammad Bilal", linkedin: "https://ae.linkedin.com/in/bilalsheni" },
            { name: "Chirag R", linkedin: "https://in.linkedin.com/in/chirag-r-b090a4218" },
            { name: "Rahul Gaikwad", linkedin: "https://in.linkedin.com/in/rahulgaikwad9a" },
            { name: "Manish", linkedin: "https://in.linkedin.com/in/bmanishkumar" },
            { name: "Hrishikesh Kulkarni", linkedin: "https://in.linkedin.com/in/hrishi-9b098b217" },
            { name: "Adithyan Mundayadu", linkedin: "https://in.linkedin.com/in/adithyanv" },
            { name: "Anirudh Singh Solanki", linkedin: "https://in.linkedin.com/in/anirudh-singh-solanki-69bb191bb" },
            { name: "Dharaneedaran K S", linkedin: "https://in.linkedin.com/in/dharaneedaran-kalyanam-sendhil-724497206" },
            { name: "Saniya Bhargava", linkedin: "https://ie.linkedin.com/in/saniyabhargava" },
            { name: "Vinamra Parakh", linkedin: "https://in.linkedin.com/in/vinamra-parakh-9b20a6218" },
            { name: "Kaustubh Khedkar", linkedin: "https://in.linkedin.com/in/kaustubh-khedkar-844290216" },
            { name: "Amey Maheshwari", linkedin: "https://in.linkedin.com/in/amey-maheshwari-236681225" },
            { name: "D Karan", linkedin: "https://in.linkedin.com/in/karandhinakaran" },
            { name: "Siddh Narhari", linkedin: "https://www.linkedin.com/in/siddhnarhari" },
            { name: "Karan Devendra Panchal", linkedin: "https://in.linkedin.com/in/karan-panchal-58a823202" },
            { name: "Akash Deepak Shah", linkedin: "https://in.linkedin.com/in/akash-shah-6a293a217" },
            { name: "Aviral Vinit", linkedin: "https://in.linkedin.com/in/aviral-vinit-a2a610202" },
            { name: "Samith Hegde", linkedin: "https://in.linkedin.com/in/samith-hegde" },
            { name: "Sukrit Dass T M", linkedin: "https://in.linkedin.com/in/sukrit-dass" }
        ],

        "2025": [
            { name: "Harshit Ravindra Gawade", linkedin: "https://in.linkedin.com/in/harshit-gawade-3187a5197" },
            { name: "Mauli Mehulkumar Patel", linkedin: "https://in.linkedin.com/in/mauli-patel-42450922a" },
            { name: "Raghavendra", linkedin: "https://in.linkedin.com/in/draghav" },
            { name: "SIDHAARTH SREDHARAN", linkedin: "https://www.linkedin.com/in/sidhaarth-murali/" },
            { name: "Imamhusen.H.K", linkedin: "https://in.linkedin.com/in/imamhusen-konasagar-11932022a" },
            { name: "Keshav Mittal", linkedin: "https://in.linkedin.com/in/keshav-mittal-93012123b" },
            { name: "Aditya Raj Kashyap", linkedin: "https://in.linkedin.com/in/aditya-raj-kashyap-074559254" },
            { name: "Anirved Pandey", linkedin: "https://in.linkedin.com/in/anirved-pandey-8a5485272" },
            { name: "Chhote Lal Bairwa", linkedin: "https://in.linkedin.com/in/cldadr" },
            { name: "Vidit", linkedin: "https://in.linkedin.com/in/vidit-gala-0165a0235" },
            { name: "N Ranjith Shetty", linkedin: "https://in.linkedin.com/in/ranjith-shetty-034a96224" },
            { name: "Aditya Prakash Prabhu", linkedin: "https://in.linkedin.com/in/aditya-prakash-a1d2i3" },
            { name: "Joel Jojo Painuthara", linkedin: "https://in.linkedin.com/in/joeljojop" },
            { name: "Karan S", linkedin: "https://in.linkedin.com/in/karan-sheoran-06935360" },
            { name: "Kuntimalla Jashwanth", linkedin: "https://in.linkedin.com/in/kuntimallajashwanthnitk" },
            { name: "N Dhruva", linkedin: "https://in.linkedin.com/in/n-dhruva" },
            { name: "Sreehari Krishnan", linkedin: "https://in.linkedin.com/in/sreeharikrishnan-nitk" },
            { name: "Suraj Gupta", linkedin: "https://in.linkedin.com/in/suraj789" },
            { name: "Amit Sharma", linkedin: "https://in.linkedin.com/in/ams201301" },
            { name: "Anurag Mahto", linkedin: "https://in.linkedin.com/in/anurag-mahto-973545310" },
            { name: "Vedant Tarale", linkedin: "https://in.linkedin.com/in/vedant-tarale" },
            { name: "Dadi Vishnu Vardhan", linkedin: "https://in.linkedin.com/in/vishnu-vardhan-dadi-756145224" },
            { name: "Rajashri Varadaraj", linkedin: "https://in.linkedin.com/in/rajashri-varadaraj-6b375b232" }
            // Remaining 2025 list can continue similarly if needed
        ]
    };

    return (
        <div className="alumni-page-wrapper">
            <main className="alumni-container">
                <h1 className="alumni-header-text">ALUMNI</h1>

                <div className="alumni-grid">
                    {alumniBatches.map((batch) => (
                        <div
                            key={batch.id}
                            className="alumni-card"
                            onClick={() => setSelectedBatch(batch.id)}
                            style={{ cursor: "pointer" }}
                        >
                            <img
                                src={batch.img}
                                alt={`Batch ${batch.title}`}
                                className="alumni-img"
                            />
                            <div className="batch-overlay-text">{batch.title}</div>
                        </div>
                    ))}
                </div>

                {selectedBatch && (
                    <div className="alumni-list-section">
                        <h2>Batch {selectedBatch}</h2>

                        {alumniData[selectedBatch]?.map((alumni, index) => (
                            <div key={index} className="alumni-list-item">
                                {alumni.linkedin ? (
                                    <a
                                        href={alumni.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {alumni.name}
                                    </a>
                                ) : (
                                    <span>{alumni.name}</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default AlumniPage;
