import React, { useState, useEffect } from 'react';
import './Team.css';
import Footer from './footer.jsx';
import { Helmet } from 'react-helmet-async';

// Import all your images
import aadhithya_r_k from '../images/team-members/Aadhithya_R_K.jpg';
import aaron_rajeev_mathew from '../images/team-members/Aaron_Rajeev_Mathew.jpg';
import abhhay_s_sharma from '../images/team-members/Abhhay_S_Sharma.jpg';
import abhinay_p_a from '../images/team-members/Abhinay_P_A.jpg';
import abhishek_m from '../images/team-members/Abhishek_M.jpg';
import abir_saha from '../images/team-members/Abir_Saha.jpg';
import ajay_sharma_sambara from '../images/team-members/Ajay_Sharma_Sambara.jpeg';
import anmol_bohra from '../images/team-members/Anmol_Bohra.jpeg';
import aryan_bokolia from '../images/team-members/Aryan_Bokolia.jpeg';
import aryan_gupta from '../images/team-members/Aryan_Gupta.JPG';
import chetan_kumar_sah from '../images/team-members/Chetan_Kumar_Sah.jpg';
import dhanasree from '../images/team-members/Dhanasree.jpg';
import kenge_madhur_niraj from '../images/team-members/Kenge_Madhur_Niraj.jpeg';
import om_srivastava from '../images/team-members/Om_Srivastava.jpg';
import omkar_kharade from '../images/team-members/Omkar_Kharade.png';
import pratham_p_palankar from '../images/team-members/Pratham_P_Palankar.jpg';
import ryan_varghese_thomas from '../images/team-members/Ryan_Varghese_Thomas.jpg';
import sairaj from '../images/team-members/Sairaj.jpeg';
import Shaarvari from '../images/team-members/Shaarvari_Prashanth.jpg';
import shubhang_galagali from '../images/team-members/Shubhang_Galagali.jpg';
import soham_anand_jain from '../images/team-members/Soham_Anand_Jain.png';
import tejaswini_magani from '../images/team-members/Tejaswini_Magani.jpg';
import thokare_prithviraj_dilip from '../images/team-members/Thokare_Prithviraj_Dilip.jpg';
import tirth_vishalkumar_patel from '../images/team-members/Tirth_Vishalkumar_Patel.jpg';
import varshith_j from '../images/team-members/Varshith_J.jpg';
import anindith from '../images/team-members/Anindith.jpg';
import gowthambm from '../images/team-members/GowthamBM.JPG';
import Nandeesh_Urmesh_Trivedi from '../images/team-members/Nandeesh_Urmesh_Trivedi.jpg';
import R_Adithya from '../images/team-members/R_Adithya.jpg';
import Vedant_Sabnis from '../images/team-members/Vedant_Sabnis.jpg';
import Darshan from '../images/team-members/darshanupadhaya.jpeg';
import nitesh_p from '../images/team-members/Nitesh_P.jpg';
import Shubham_Shah from '../images/team-members/Shubham_Shah.jpeg';
import Pratham_Rao from '../images/team-members/Pratham_Rao.jpeg';
import Harihara_Moorthy from '../images/team-members/Harihara_Moorthy.jpeg';
import linkedInLogo from '../images/linkedIn_logo.png';

const staticTeamHeads = [
  { name: 'VARSHITH.J', role: 'Convener', image: varshith_j, linkedIn: 'https://www.linkedin.com/in/varshith-j-54579628a/?isSelfProfile=false' },
  { name: 'NANDEESH TRIVEDI', role: 'Captain', image: Nandeesh_Urmesh_Trivedi, linkedIn: 'https://www.linkedin.com/in/nandeesh-trivedi-8b7a39308/?isSelfProfile=false' },
  { name: 'VEDANT SABNIS', role: 'Joint Convener', image: Vedant_Sabnis, linkedIn: 'http://www.linkedin.com/in/vedant-sabnis-6603b9280' },
  { name: 'R.ADITHYA', role: 'Vice Captain', image: R_Adithya, linkedIn: 'https://www.linkedin.com/in/adithyar976/' },
  { name: 'TIRTH PATEL', role: 'Chairperson', image: tirth_vishalkumar_patel, linkedIn: 'https://www.linkedin.com/in/tirth-patel-550715321/' },
  { name: 'NITESH.P', role: 'Operations Lead', image: nitesh_p, linkedIn: 'https://www.linkedin.com/in/nitesh-p-ab4108292/?isSelfProfile=false' },
  { name: 'ANINDITH B L', role: 'Outreach Lead', image: anindith, linkedIn: 'https://www.linkedin.com/in/anindithbl/?isSelfProfile=false' },
  { name: 'PRATHAM PALANKAR', role: 'Treasurer', image: pratham_p_palankar, linkedIn: 'https://www.linkedin.com/in/pratham-palankar-277421293' }
];

const staticStudentMentors = [
  { name: 'SHUBHANG GALAGALI', role: 'Student Mentor', image: shubhang_galagali, linkedIn: 'https://www.linkedin.com/in/galavashubhang' },
  { name: 'SOHAM JAIN', role: 'Student Mentor', image: soham_anand_jain, linkedIn: 'https://www.linkedin.com/in/soham-anand-jain/' },
  { name: 'CHETAN KUMAR SAH', role: 'Student Mentor', image: chetan_kumar_sah, linkedIn: 'https://www.linkedin.com/in/sahchetan' }
];

const staticRawMembersData = [
  { name: 'Aryan Bokolia', role: 'Web Lead', subsystem: 'Web Team', image: aryan_bokolia, linkedIn: 'https://www.linkedin.com/in/aryan-bokolia-365aa4326' },
  { name: 'Darshan Upadhye', role: 'UI/UX Designer', subsystem: 'Web Team', image: Darshan, linkedIn: 'https://www.linkedin.com/in/darshan-upadhye-b20374312' },
  { name: 'Shaarvari Prashanth', role: 'Web Associate', subsystem: 'Web Team', image: Shaarvari, linkedIn: 'https://www.linkedin.com/in/shaarvari-prashanth-5764b6331' },
  { name: 'Kenge Madhur Niraj', role: 'Structures Lead', subsystem: 'Structures', image: kenge_madhur_niraj, linkedIn: 'https://www.linkedin.com/in/madhur-kenge-354238326' },
  { name: 'Abir Saha', role: 'IITM Lead', subsystem: 'Structures', image: abir_saha, linkedIn: 'https://www.linkedin.com/in/abir-saha-b90798324' },
  { name: 'Aaron Mathew', role: 'VTOL Co-Lead', subsystem: 'Structures', image: aaron_rajeev_mathew, linkedIn: 'https://www.linkedin.com/in/aaron-rajeev-mathew-217561317' },
  { name: 'Harihara Moorthy', role: 'DDC Co-Lead', subsystem: 'Structures', image: Harihara_Moorthy, linkedIn: 'https://www.linkedin.com/in/sri-harihara-moorthy-r-8b5b263a6' },
  { name: 'Om Srivastava', role: 'Member', subsystem: 'Structures', image: om_srivastava, linkedIn: 'https://www.linkedin.com/in/om-srivastava-2k28' },
  { name: 'Anmol Bohra', role: 'Member', subsystem: 'Structures', image: anmol_bohra, linkedIn: 'https://www.linkedin.com/in/anmol-bohra1403' },
  { name: 'Prithviraj Thokare', role: 'Member', subsystem: 'Structures', image: thokare_prithviraj_dilip, linkedIn: 'https://www.linkedin.com/in/prithviraj-thokare-0232a5380/' },
  { name: 'Abhishek M', role: 'Member', subsystem: 'Media', image: abhishek_m, linkedIn: 'https://www.linkedin.com/in/abhishek-m-959609318/' },
  { name: 'Sairaj', role: 'Member', subsystem: 'Media', image: sairaj, linkedIn: 'https://www.linkedin.com/in/sairajpatil6015' },
  { name: 'Aadhithya RK', role: 'Member', subsystem: 'Aerodynamics', image: aadhithya_r_k, linkedIn: 'https://www.linkedin.com/in/aadhithya-karthik-558b57382' },
  { name: 'Dhanasree', role: 'Member', subsystem: 'Aerodynamics', image: dhanasree, linkedIn: 'https://www.linkedin.com/in/dhanasree-s-7a1439370' },
  { name: 'Pratham Rao', role: 'Avionics Lead', subsystem: 'Avionics', image: Pratham_Rao, linkedIn: 'https://www.linkedin.com/in/pratham-rao-pr/?isSelfProfile=false' },
  { name: 'Ajay Sharma', role: 'NIDAR Lead', subsystem: 'Avionics', image: ajay_sharma_sambara, linkedIn: 'https://www.linkedin.com/in/ajayshaersamb070692' },
  { name: 'Magani Tejaswini', role: 'ADDC Lead', subsystem: 'Avionics', image: tejaswini_magani, linkedIn: 'https://www.linkedin.com/in/magani-tejaswini-a70a68346' },
  { name: 'Ryan Thomas', role: 'Member', subsystem: 'Structures', image: ryan_varghese_thomas, linkedIn: 'https://www.linkedin.com/in/ryanthomas2005/' },
  { name: 'Abhinay P A', role: 'Marketing Lead', subsystem: 'Marketing', image: abhinay_p_a, linkedIn: 'https://www.linkedin.com/in/abhinaypa101' },
  { name: 'Shubham Shah', role: 'Aerodynamics Lead', subsystem: 'Aerodynamics', image: Shubham_Shah, linkedIn: 'https://www.linkedin.com/in/shubham-shah-445ab9312/?isSelfProfile=false' },
  { name: 'Omkar Kharade', role: 'DDC Lead', subsystem: 'Aerodynamics', image: omkar_kharade, linkedIn: 'https://www.linkedin.com/in/omkar-kharade-53a05232b' },
  { name: 'Aryan Gupta', role: 'VTOL Lead', subsystem: 'Aerodynamics', image: aryan_gupta, linkedIn: 'https://www.linkedin.com/in/aryan-g-b27278247' },
  { name: 'Abhhay Sharma', role: 'IITB Lead', subsystem: 'Aerodynamics', image: abhhay_s_sharma, linkedIn: 'https://www.linkedin.com/in/abhhay-s-sharma-40142225a' },
  { name: 'GOWTHAM B M', role: 'Media Lead', subsystem: 'Media', image: gowthambm, linkedIn: 'http://www.linkedin.com/in/gowthambm' }
];

const Team = () => {
  const [activeSubsystem, setActiveSubsystem] = useState('Aerodynamics');
  const [dynamicMembers, setDynamicMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      try {
        const response = await fetch(`${BACKEND_URL}/api/team`);
        if (response.ok) {
          const data = await response.json();
          const formattedData = data.map(m => ({
            name: m.name,
            role: m.role,
            teamType: m.teamType, // <-- Added this vital mapping
            subsystem: m.subsystem || m.category,
            image: m.imageUrl || m.image,
            linkedIn: m.linkedIn || m.linkedin
          }));
          setDynamicMembers(formattedData);
        }
      } catch (err) {
        console.error('Failed to fetch dynamic team members from backend:', err);
      }
    };

    fetchMembers();
  }, []);

  // Helper function to merge dynamic and static data without duplicating names
  const mergeArrays = (staticArr, dynamicArr) => {
    return [
      ...staticArr,
      ...dynamicArr.filter(dm => !staticArr.some(sm => sm.name.toLowerCase() === dm.name.toLowerCase()))
    ];
  };

  // 1. Separate CMS members by their teamType
  const dynamicHeads = dynamicMembers.filter(m => m.teamType === 'Head');
  const dynamicMentors = dynamicMembers.filter(m => m.teamType === 'Mentor');
  // Subsystem members are either strictly 'Member' or have no teamType defined (fallback)
  const dynamicSubsystemMembers = dynamicMembers.filter(m => m.teamType === 'Member' || !m.teamType);

  // 2. Merge them properly with their respective static sections
  const allHeads = mergeArrays(staticTeamHeads, dynamicHeads);
  const allMentors = mergeArrays(staticStudentMentors, dynamicMentors);
  const allSubsystemMembers = mergeArrays(staticRawMembersData, dynamicSubsystemMembers);

  const categories = ['Aerodynamics', 'Structures', 'Avionics', 'Marketing', 'Media', 'Web Team'];

  // 3. Filter only the merged subsystem array for the active category tabs
  const getFilteredData = (sub) => {
    const subsystemMembers = allSubsystemMembers.filter(m => m.subsystem === sub);

    const leads = subsystemMembers.filter(m => {
      const roleLower = (m.role || '').toLowerCase();
      return roleLower.includes('lead') || roleLower.includes('head');
    });

    const members = subsystemMembers.filter(m => {
      const roleLower = (m.role || '').toLowerCase();
      return !roleLower.includes('lead') && !roleLower.includes('head');
    });

    return { leads, members };
  };

  const MemberCard = ({ m }) => (
    <div className="team-card">
      <div className="profile-circle">
        {m.image ? <img src={m.image} alt={m.name} loading="lazy" /> : <div className="placeholder-circle" />}
      </div>
      <h3 className="name">{m.name}</h3>
      <p className="role">{m.role}</p>
      {m.linkedIn && (
        <a href={m.linkedIn} className="linkedin-link" target="_blank" rel="noreferrer">
          <img src={linkedInLogo} alt="LinkedIn" className="large-linkedin" />
        </a>
      )}
    </div>
  );

  const { leads, members } = getFilteredData(activeSubsystem);

  return (
    <div className="team-page-bg">
      <Helmet>
        <title>Our Team | Aero NITK</title>
        <meta name="description" content="Meet the passionate students behind Aero NITK - from aerodynamics enthusiasts to avionics experts." />
        <link rel="canonical" href="https://aeronitk.in/team" />
      </Helmet>
      <div className="team-main-container">

        <section className="section-group">
          <h2 className="section-label">TEAM HEADS</h2>
          <div className="row heads-row">
            {/* Map over the newly merged allHeads array */}
            {allHeads.map((m, i) => <MemberCard key={`head-${i}`} m={m} />)}
          </div>
          <h3 className="subsection-label">STUDENT MENTORS</h3>
          <div className="row mentors-row">
            {/* Map over the newly merged allMentors array */}
            {allMentors.map((m, i) => <MemberCard key={`mentor-${i}`} m={m} />)}
          </div>
        </section>

        <div className="figma-divider"></div>

        <section className="section-group">
          <h2 className="section-label">SUB SYSTEMS</h2>
          <div className="sub-nav-pill">
            {categories.map(sub => (
              <button
                key={sub}
                className={`sub-nav-item ${activeSubsystem === sub ? 'active' : ''}`}
                onClick={() => setActiveSubsystem(sub)}
              >
                {sub}
              </button>
            ))}
          </div>

          <div className="row leads-above">
            {leads.map((m, i) => <MemberCard key={`lead-${i}`} m={m} />)}
          </div>

          <div className="figma-divider"></div>

          <div className="row members-below">
            {members.map((m, i) => <MemberCard key={`member-${i}`} m={m} />)}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Team;
