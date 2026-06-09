///Team page in header
import React, { useState } from 'react';
import './Team.css';
import Footer from './footer.jsx';
import { Helmet } from 'react-helmet-async';
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
import bharat_patel from '../images/team-members/Bharat_Patel.jpg';
import bhimu_daddimani from '../images/team-members/Bhimu_Daddimani.jpg';
import chetan_kumar_sah from '../images/team-members/Chetan_Kumar_Sah.jpg';
import dhanasree from '../images/team-members/Dhanasree.jpg';
import g_shifa_khanum_niraj from '../images/team-members/G_Shifa_Khanum.jpg';
import kenge_madhur_niraj from '../images/team-members/Kenge_Madhur_Niraj.jpeg';
import om_srivastava from '../images/team-members/Om_Srivastava.jpg';
import omkar_kharade from '../images/team-members/Omkar_Kharade.png';
import pratham_p_palankar from '../images/team-members/Pratham_P_Palankar.jpg';
import rathod_smit_amitkumar from '../images/team-members/Rathod_Smit_Amitkumar.jpeg';
import ryan_varghese_thomas from '../images/team-members/Ryan_Varghese_Thomas.jpg';
import sairaj from '../images/team-members/Sairaj.jpeg';
import Shaarvari from '../images/team-members/Shaarvari_Prashanth.jpg';
import shubhang_galagali from '../images/team-members/Shubhang_Galagali.jpg';
import soham_anand_jain from '../images/team-members/Soham_Anand_Jain.png';
import tanay_praveen_shekokar from '../images/team-members/Tanay_Praveen_Shekokar.jpeg';
import tejaswini_magani from '../images/team-members/Tejaswini_Magani.jpg';
import thokare_prithviraj_dilip from '../images/team-members/Thokare_Prithviraj_Dilip.jpg';
import tirth_vishalkumar_patel from '../images/team-members/Tirth_Vishalkumar_Patel.jpg';
import varshith_j from '../images/team-members/Varshith_J.jpg';
import anindith from '../images/team-members/Anindith.jpg';
import gouthamSunilKumar from '../images/team-members/Goutham_Sunil_Kumar.jpg';
import gowthambm from '../images/team-members/GowthamBM.JPG';
//import LavnnyaPatil from '../images/team-members/LavnnyaPatil.jpg';
import Nandeesh_Urmesh_Trivedi from '../images/team-members/Nandeesh_Urmesh_Trivedi.jpg';
import R_Adithya from '../images/team-members/R_Adithya.jpg';
import Vedant_Sabnis from '../images/team-members/Vedant_Sabnis.jpg';
import Darshan from '../images/team-members/darshanupadhaya.jpeg'
import nitesh_p from '../images/team-members/Nitesh_P.jpg';
import Shubham_Shah from '../images/team-members/Shubham_Shah.jpeg';
import Pratham_Rao from '../images/team-members/Pratham_Rao.jpeg';
import Harihara_Moorthy from '../images/team-members/Harihara_Moorthy.jpeg';
import linkedInLogo from '../images/linkedIn_logo.png';

/* linkedin links which are replaces but not reused :
  
  https://www.linkedin.com/in/bhimu-d?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
  https://www.linkedin.com/in/lavnnya-patil
  https://www.linkedin.com/in/bharatnitk/
  https://www.linkedin.com/in/goutham-sunil-kumar-a95777253
  https://www.linkedin.com/in/smit-rathod-a2900b312/
  http://linkedin.com/in/adithyar976

*/

const Team = () => {
  const [activeSubsystem, setActiveSubsystem] = useState('Aerodynamics');

  const teamHeads = [
    { name: 'VARSHITH.J', role: 'Convener', image: varshith_j, linkedIn: 'https://www.linkedin.com/in/varshith-j-54579628a/?isSelfProfile=false' },
    { name: 'NANDEESH TRIVEDI', role: 'Captain', image: Nandeesh_Urmesh_Trivedi, linkedIn: 'https://www.linkedin.com/in/nandeesh-trivedi-8b7a39308/?isSelfProfile=false' },
    {name: 'R.ADITHYA', role: 'Vice Captain', image: R_Adithya, linkedIn: 'https://www.linkedin.com/in/adithyar976/'},
    {name: 'TIRTH PATEL', role: 'Chairperson', image: tirth_vishalkumar_patel, linkedIn: 'https://www.linkedin.com/in/tirth-patel-550715321/'},
    {name: 'PRATHAM PALANKAR', role: 'Treasurer', image: pratham_p_palankar, linkedIn: 'https://www.linkedin.com/in/pratham-palankar-277421293'},
    { name: 'NITESH.P', role: 'Operational Lead', image: nitesh_p, linkedIn: 'https://www.linkedin.com/in/nitesh-p-ab4108292/?isSelfProfile=false' }
    // { name: 'RAHUL N C', role: 'President', image: null, linkedIn: '' }
  ];

  const operationalLeads = [
    //{ name: 'NITESH.P', role: 'Operational Lead', image: nitesh_p, linkedIn: 'https://www.linkedin.com/in/nitesh-p-ab4108292/?isSelfProfile=false' },
    //{ name: 'TANAY SHEKOKAR', role: 'Mentor', image: tanay_praveen_shekokar, linkedIn: 'https://www.linkedin.com/in/tanay-shekokar-04730829b' },
    //{ name: 'GOWTHAM B M', role: 'Media Lead', image: gowthambm, linkedIn: 'http://www.linkedin.com/in/gowthambm' },
    //{ name: 'ANINDITH B L', role: 'Outreach Lead', image: anindith, linkedIn: 'https://www.linkedin.com/in/anindithbl/?isSelfProfile=false' },
    //{ name: 'ARYAN BOKOLIA', role: 'Web Dev Lead', subsystem: 'Web Team', image: aryan_bokolia, linkedIn: 'https://www.linkedin.com/in/aryan-bokolia/?isSelfProfile=false' }
  ];

  const rawMembersData = [
    { name: 'Aryan Bokolia', role: 'Web Dev Lead ', subsystem: 'Web Team', image: aryan_bokolia, linkedIn: 'https://www.linkedin.com/in/aryan-bokolia-365aa4326' },
    { name: 'Darshan Upadhye', role: 'UI/UX Designer', subsystem: 'Web Team', image: Darshan, linkedIn: 'https://www.linkedin.com/in/darshan-upadhye-b20374312?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
    { name: 'Shaarvari Prashanth', role: 'Web Associate', subsystem: 'Web Team', image: Shaarvari, linkedIn: 'https://www.linkedin.com/in/shaarvari-prashanth-5764b6331?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app' },

    { name: 'Kenge Madhur Niraj', role: 'Structures Lead', subsystem: 'Structures', image: kenge_madhur_niraj, linkedIn: 'https://www.linkedin.com/in/madhur-kenge-354238326' },
    //{ name: 'Tirth Vishalkumar Patel', role: 'Fuselage Lead', subsystem: 'Structures', image: tirth_vishalkumar_patel, linkedIn: 'https://www.linkedin.com/in/tirth-patel-550715321/' },
    { name: 'Prithviraj Thokare', role: 'Member', subsystem: 'Structures', image: thokare_prithviraj_dilip, linkedIn: 'https://www.linkedin.com/in/prithviraj-thokare-0232a5380/' },
    { name: 'Om Srivastava', role: 'Member', subsystem: 'Structures', image: om_srivastava, linkedIn: 'https://www.linkedin.com/in/om-srivastava-2k28' },
    { name: 'Abhishek M', role: 'Member', subsystem: 'Media', image: abhishek_m, linkedIn: 'https://www.linkedin.com/in/abhishek-m-959609318/' },

    //{ name: 'Aryan Gupta', role: 'Member', subsystem: 'Aerodynamics', image: aryan_gupta, linkedIn: 'https://www.linkedin.com/in/aryan-g-b27278247' },
    //{ name: 'Madhur Kenge', role: 'Member', subsystem: 'Structures', image: kenge_madhur_niraj, linkedIn: 'https://www.linkedin.com/in/madhur-kenge-354238326' },
    //{ name: 'Abhhay S Sharma', role: 'Member', subsystem: 'Aerodynamics', image: abhhay_s_sharma, linkedIn: 'https://www.linkedin.com/in/abhhay-s-sharma-40142225a' },
    //{ name: 'Omkar Kharade', role: 'Member', subsystem: 'Aerodynamics', image: omkar_kharade, linkedIn: 'https://www.linkedin.com/in/omkar-kharade-53a05232b' },
    { name: 'Shifa Khan', role: 'Member', subsystem: 'Marketing', image: g_shifa_khanum_niraj, linkedIn: 'https://www.linkedin.com/in/shifa-khan-dacimus/' },
    { name: 'Anmol Bohra', role: 'Member', subsystem: 'Structures', image: anmol_bohra, linkedIn: 'https://www.linkedin.com/in/anmol-bohra1403' },
    //{ name: 'Ajay Sharma', role: 'Member', subsystem: 'Avionics', image: ajay_sharma_sambara, linkedIn: 'https://www.linkedin.com/in/ajayshaersamb070692' },
    { name: 'Aaron Mathew', role: 'Member', subsystem: 'Structures', image: aaron_rajeev_mathew, linkedIn: 'https://www.linkedin.com/in/aaron-rajeev-mathew-217561317' },
    { name: 'Sairaj', role: 'Member', subsystem: 'Media', image: sairaj, linkedIn: 'https://www.linkedin.com/in/sairajpatil6015' },
    //{ name: 'Abir Saha', role: 'Member', subsystem: 'Structures', image: abir_saha, linkedIn: 'https://www.linkedin.com/in/abir-saha-b90798324' },
    { name: 'Dhanasree', role: 'Member', subsystem: 'Aerodynamics', image: dhanasree, linkedIn: 'https://www.linkedin.com/in/dhanasree-s-7a1439370' },
    { name: 'Pratham Rao', role: 'Avionics Lead', subsystem: 'Avionics', image: Pratham_Rao, linkedIn: 'https://www.linkedin.com/in/pratham-rao-pr/?isSelfProfile=false' },
    { name: 'Shubhang Galagali', role: 'Simulator Lead', subsystem: 'Avionics', image: shubhang_galagali, linkedIn: 'https://www.linkedin.com/in/galavashubhang' },
    { name: 'Chetan Kumar Sah', role: 'Drone Lead', subsystem: 'Avionics', image: chetan_kumar_sah, linkedIn: 'https://www.linkedin.com/in/sahchetan' },
    { name: 'Soham Jain', role: 'Drone Co-Lead', subsystem: 'Avionics', image: soham_anand_jain, linkedIn: 'https://www.linkedin.com/in/soham-anand-jain/' },
    { name: 'Ryan Thomas', role: 'Member', subsystem: 'Structures', image: ryan_varghese_thomas, linkedIn: 'https://www.linkedin.com/in/ryanthomas2005/' },
    { name: 'Abhinay P A', role: 'Marketing Lead', subsystem: 'Marketing', image: abhinay_p_a, linkedIn: 'https://www.linkedin.com/in/abhinaypa101' },
    //{ name: 'Tejaswini Magani', role: 'Member', subsystem: 'Avionics', image: tejaswini_magani, linkedIn: 'https://www.linkedin.com/in/magani-tejaswini-a70a68346' },
    { name: 'Aadhithya RK', role: 'Member', subsystem: 'Aerodynamics', image: aadhithya_r_k, linkedIn: 'https://www.linkedin.com/in/aadhithya-karthik-558b57382' },
    { name: 'Shubham Shah', role: 'Aerodynamics Lead', subsystem: 'Aerodynamics', image: Shubham_Shah, linkedIn: 'https://www.linkedin.com/in/shubham-shah-445ab9312/?isSelfProfile=false' },
    { name: 'Vedant Sabnis', role: 'CFD Lead', subsystem: 'Aerodynamics', image: Vedant_Sabnis, linkedIn: 'http://www.linkedin.com/in/vedant-sabnis-6603b9280' },
    //{ name: 'Pratham P Palankar', role: 'Aerodynamics Design Lead', subsystem: 'Aerodynamics', image: pratham_p_palankar, linkedIn: 'https://www.linkedin.com/in/pratham-palankar-277421293' },
    //{ name: 'Nitesh ', role: 'LG Lead', subsystem: 'Structures', image: nitesh_p, linkedIn: 'https://www.linkedin.com/in/nitesh-p-ab4108292?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
    //{ name: 'Anindith B L', role: 'Manufacturing Lead', subsystem: 'Structures', image: anindith, linkedIn: 'https://www.linkedin.com/in/anindithbl' },
    { name: 'ANINDITH B L', role: 'Outreach Lead',subsystem: 'Media', image: anindith, linkedIn: 'https://www.linkedin.com/in/anindithbl/?isSelfProfile=false' },
    { name: 'GOWTHAM B M', role: 'Media Lead',subsystem: 'Media', image: gowthambm, linkedIn: 'http://www.linkedin.com/in/gowthambm' },
    //{ name: 'Shubham Shah', role: 'Member', subsystem: 'Aerodynamics', image: Shubham_Shah, linkedIn: 'https://www.linkedin.com/in/shubham-shah-445ab9312?utm_source=share_via&utm_content=profile&utm_medium=member_android' },
    { name: 'Harihara Moorthy', role: 'Member', subsystem: 'Structures', image: Harihara_Moorthy, linkedIn: 'https://www.linkedin.com/in/sri-harihara-moorthy-r-8b5b263a6?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
    { name: 'Omkar Kharade', role: 'SAE DOC Project lead', subsystem: 'Project Leads', image: omkar_kharade, linkedIn: 'https://www.linkedin.com/in/omkar-kharade-53a05232b' },
    { name: 'Ajay Sharma', role: 'NINDAR Project lead', subsystem: 'Project Leads', image: ajay_sharma_sambara, linkedIn: 'https://www.linkedin.com/in/ajayshaersamb070692' },
    { name: 'Magani Tejaswini', role: 'SAE ADDC Project lead', subsystem: 'Project Leads', image: tejaswini_magani, linkedIn: 'https://www.linkedin.com/in/magani-tejaswini-a70a68346' },
    { name: 'Abir Saha', role: 'IITM Project lead', subsystem: 'Project Leads', image: abir_saha, linkedIn: 'https://www.linkedin.com/in/abir-saha-b90798324' },
    { name: 'Aryan Gupta', role: 'Aerothon Project lead', subsystem: 'Project Leads', image: aryan_gupta, linkedIn: 'https://www.linkedin.com/in/aryan-g-b27278247' },
    { name: 'Abhhay Sharma', role: 'IITB Project lead', subsystem: 'Project Leads', image: abhhay_s_sharma, linkedIn: 'https://www.linkedin.com/in/abhhay-s-sharma-40142225a' }
    //{ name: 'Pratham Rao', role: 'Member', subsystem: 'Avionics', image: Pratham_Rao, linkedIn: 'https://www.linkedin.com/in/pratham-rao-pr' },

  ];

  const categories = ['Aerodynamics', 'Structures', 'Avionics', 'Marketing', 'Media', 'Web Team','Project Leads'];

  const getFilteredData = (sub) => {
    const subsystemMembers = rawMembersData.filter(m => m.subsystem === sub);

    const leads = subsystemMembers.filter(m => {
      const isLeadByRole = m.role.toLowerCase().includes('lead') || m.role.toLowerCase().includes('head');
      // Add Darshan and Aryan manually to the leads category via their names
      //const isManualLead = m.name === 'Aryan Bokolia';

      return isLeadByRole ;
    });

    const members = subsystemMembers.filter(m => {
      const isLeadByRole = m.role.toLowerCase().includes('lead') || m.role.toLowerCase().includes('head');
      //const isManualLead = m.name === 'Aryan Bokolia';

      // Exclude them from the "members" list so they aren't duplicated
      return !isLeadByRole ;//&& !isManualLead;
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
            {teamHeads.map((m, i) => <MemberCard key={i} m={m} />)}
          </div>
          <div className="row leads-row">
            {operationalLeads.map((m, i) => <MemberCard key={i} m={m} />)}
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
            {leads.map((m, i) => <MemberCard key={i} m={m} />)}
          </div>

          <div className="figma-divider"></div>

          <div className="row members-below">
            {members.map((m, i) => <MemberCard key={i} m={m} />)}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Team;