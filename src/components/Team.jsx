import React, { useState } from 'react';

import linkedInLogo from '../images/linkedIn_logo.png';

import './Team.css';

import aadhithya_r_k from '../images/team-members/Aadhithya_R_K.jpg';
import aaron_rajeev_mathew from '../images/team-members/Aaron_Rajeev_Mathew.jpg';
import abel_thomas_mathew from '../images/team-members/Abel_Thomas_Mathew.jpg';
import abhhay_s_sharma from '../images/team-members/Abhhay_S_Sharma.jpg';
import abhinay_p_a from '../images/team-members/Abhinay_P_A.jpg';
import abhishek_m from '../images/team-members/Abhishek_M.jpg';
import abir_saha from '../images/team-members/Abir_Saha.jpg';
import ajay_sharma_sambara from '../images/team-members/Ajay_Sharma_Sambara.jpeg';
import aman_nagpal from '../images/team-members/Aman_Nagpal.jpg';
import anmol_bohra from '../images/team-members/Anmol_Bohra.jpeg';
import appuganesh from '../images/team-members/Appuganesh.jpeg';
import aryan_bokolia from '../images/team-members/Aryan_Bokolia.jpeg';
import aryan_gupta from '../images/team-members/Aryan_Gupta.JPG';
import bharat_patel from '../images/team-members/Bharat_Patel.jpg';
import bhimu_daddimani from '../images/team-members/Bhimu_Daddimani.jpg';
import chetan_kumar_sah from '../images/team-members/Chetan_Kumar_Sah.jpg';
import dhanasree from '../images/team-members/Dhanasree.jpg';
import g_shifa_khanum_niraj from '../images/team-members/G_Shifa_Khanum.jpg';
import kenge_madhur_niraj from '../images/team-members/Kenge_Madhur_Niraj.jpeg';
import makwana_dhruv_dilipbhai from '../images/team-members/Makwana_Dhruv_Dilipbhai.jpeg';
import nitesh_p from '../images/team-members/Nitesh_P.jpg';
import om_srivastava from '../images/team-members/Om_Srivastava.jpg';
import omkar_kharade from '../images/team-members/Omkar_Kharade.png';
import peddinti_ananta_venkata_seersha from '../images/team-members/Peddinti_Ananta_Venkata_Seersha.jpg';
import pratham_p_palankar from '../images/team-members/Pratham_P_Palankar.jpg';
import rangineni_sai_abhinay from '../images/team-members/Rangineni_Sai_Abhinay.jpg';
import rathod_smit_amitkumar from '../images/team-members/Rathod_Smit_Amitkumar.jpeg';
import ryan_varghese_thomas from '../images/team-members/Ryan_Varghese_Thomas.jpg';
import sairaj from '../images/team-members/Sairaj.jpeg';
import shamit_hoysal from '../images/team-members/Shamit_Hoysal.jpg';
import shubhang_galagali from '../images/team-members/Shubhang_Galagali.jpg';
import soham_anand_jain from '../images/team-members/Soham_Anand_Jain.png';
import tanay_praveen_shekokar from '../images/team-members/Tanay_Praveen_Shekokar.jpeg';
import tejaswini_magani from '../images/team-members/Tejaswini_Magani.jpg';
import thokare_prithviraj_dilip from '../images/team-members/Thokare_Prithviraj_Dilip.jpg';
import tirth_vishalkumar_patel from '../images/team-members/Tirth_Vishalkumar_Patel.jpg';
import varshith_j from '../images/team-members/Varshith_J.jpg';
import akhilesh from '../images/team-members/Akhilesh.jpg';
import anindith from '../images/team-members/Anindith.jpg';
import gouthamSunilKumar from '../images/team-members/Goutham_Sunil_Kumar.jpg';
import gowthambm from '../images/team-members/GowthamBM.JPG';
import LavnnyaPatil from '../images/team-members/LavnnyaPatil.jpg';
import Nandeesh_Urmesh_Trivedi from '../images/team-members/Nandeesh_Urmesh_Trivedi.jpg';
import R_Adithya from '../images/team-members/R_Adithya.jpg';
import Vedant_Sabnis from '../images/team-members/Vedant_Sabnis.jpg';
const teamHeads = [
  {
    name: 'Bhimu Daddimani',
    role: 'Convenor',
    image: bhimu_daddimani,
    linkedIn:
      'https://www.linkedin.com/in/bhimu-d?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
  },
  {
    name: 'Lavnnya',
    role: 'Captain',
    image: LavnnyaPatil,
    linkedIn: 'https://www.linkedin.com/in/lavnnya-patil',
  },
  {
    name: 'Rahul',
    role: 'President',
    image: '',
    linkedIn: '',
  },
  {
    name: 'Tanay Shekokar',
    role: 'Mentor',
    image: tanay_praveen_shekokar,
    linkedIn: 'https://www.linkedin.com/in/tanay-shekokar-04730829b',
  },
];

const rawMembersData = [
  { name: 'Bharat Patel', role: 'Operation Lead', subsystem: 'Leads', image: bharat_patel, linkedIn: 'https://www.linkedin.com/in/bharatnitk/' },
  { name: 'Rathod Smit Amitkumar', role: 'Web Dev Lead', subsystem: 'Leads', image: rathod_smit_amitkumar, linkedIn: 'https://www.linkedin.com/in/smit-rathod-a2900b312/' },
  { name: 'Tirth Vishalkumar Patel', role: 'Fuselage Lead', subsystem: 'Leads', image: tirth_vishalkumar_patel, linkedIn: 'https://www.linkedin.com/in/tirth-patel-550715321/' },
  { name: 'Prithviraj Thokare', role: 'Structures', subsystem: 'Structures', image: thokare_prithviraj_dilip, linkedIn: 'https://www.linkedin.com/in/prithviraj-thokare-0232a5380/' },
  { name: 'Om Srivastava', role: 'Structures', subsystem: 'Structures', image: om_srivastava, linkedIn: 'www.linkedin.com/in/om-srivastava-2k28' },
  { name: 'Varshith J', role: 'Structures Lead', subsystem: 'Leads', image: varshith_j, linkedIn: 'https://www.linkedin.com/in/varshith-j-54579628a' },
  { name: 'Chetan Kumar Sah', role: 'Drone Lead', subsystem: 'Leads', image: chetan_kumar_sah, linkedIn: 'https://www.linkedin.com/in/sahchetan' },
  { name: 'Abhishek M', role: 'Media', subsystem: 'Media', image: abhishek_m, linkedIn: 'https://docs.google.com/forms/d/e/1FAIpQLSdnJCGnPEBLV5xs67qT846uVN70S-3vj3237C3oarxLaM1Iwg/viewform?usp=send_form' },
  { name: 'Appuganesh', role: 'Rc R&D Lead', subsystem: 'Leads', image: appuganesh, linkedIn: 'www.linkedin.com/in/appuganesh' },
  { name: 'Pratham P Palankar', role: 'Aerodynamics Design Lead', subsystem: 'Leads', image: pratham_p_palankar, linkedIn: 'www.linkedin.com/in/pratham-palankar-277421293' },
  { name: 'Nitesh', role: 'LG Lead', subsystem: 'Leads', image: nitesh_p, linkedIn: 'https://www.linkedin.com/in/nitesh-p-ab4108292?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
  { name: 'Makwana Dhruv', role: 'Aerodynamics', subsystem: 'Aerodynamics', image: makwana_dhruv_dilipbhai, linkedIn: 'https://www.linkedin.com/in/dhruv-makwana-724358327?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app' },
  { name: 'Aryan Gupta', role: 'Aerodynamics', subsystem: 'Aerodynamics', image: aryan_gupta, linkedIn: 'www.linkedin.com/in/aryan-g-b27278247' },
  { name: 'Madhur Kenge', role: 'Structures', subsystem: 'Structures', image: kenge_madhur_niraj, linkedIn: 'www.linkedin.com/in/madhur-kenge-354238326' },
  { name: 'Aryan Bokolia', role: 'Front End Developer', subsystem: 'Web Team', image: aryan_bokolia, linkedIn: 'https://www.linkedin.com/in/aryan-bokolia-365aa4326' },
  { name: 'Abhhay S Sharma', role: 'Aerodynamics', subsystem: 'Aerodynamics', image: abhhay_s_sharma, linkedIn: 'https://www.linkedin.com/in/abhhay-s-sharma-40142225a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
  { name: 'Abel Thomas Mathew', role: 'Avionics', subsystem: 'Avionics', image: abel_thomas_mathew, linkedIn: 'https://www.linkedin.com/in/abelthomasmathew?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
  { name: 'Omkar Kharade', role: 'Aerodynamics', subsystem: 'Aerodynamics', image: omkar_kharade, linkedIn: 'www.linkedin.com/in/omkar-kharade-53a05232b' },
  { name: 'Shifa Khan', role: 'Marketing Team', subsystem: 'Marketing', image: g_shifa_khanum_niraj, linkedIn: 'https://www.linkedin.com/in/shifa-khan-dacimus/' },
  { name: 'Seersha', role: 'Avionics', subsystem: 'Avionics', image: peddinti_ananta_venkata_seersha, linkedIn: 'https://www.linkedin.com/in/seersha-p-a-v-706a52363?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
  { name: 'Rangineni Sai Abhinay', role: 'Avionics', subsystem: 'Avionics', image: rangineni_sai_abhinay, linkedIn: 'https://www.linkedin.com/in/sai-abhinay-0a475733a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
  { name: 'Anmol Bohra', role: 'Structures', subsystem: 'Structures', image: anmol_bohra, linkedIn: 'https://www.linkedin.com/in/anmol-bohra1403?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app' },
  { name: 'Ajay Sharma Sambara', role: 'Avionics', subsystem: 'Avionics', image: ajay_sharma_sambara, linkedIn: 'www.linkedin.com/in/ajayshaersamb070692' },
  { name: 'Aaron Rajeev Mathew', role: 'Structures', subsystem: 'Structures', image: aaron_rajeev_mathew, linkedIn: 'www.linkedin.com/in/aaron-rajeev-mathew-217561317' },
  { name: 'Sairaj', role: 'Media', subsystem: 'Media', image: sairaj, linkedIn: 'https://www.linkedin.com/in/sairajpatil6015?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app' },
  { name: 'Abir Saha', role: 'Structures', subsystem: 'Structures', image: abir_saha, linkedIn: 'https://www.linkedin.com/in/abir-saha-b90798324?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
  { name: 'Dhanasree', role: 'Aerodynamics', subsystem: 'Aerodynamics', image: dhanasree, linkedIn: 'https://www.linkedin.com/in/dhanasree-s-7a1439370?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
  { name: 'Soham Anand Jain', role: 'Cig head, Drone', subsystem: 'Leads', image: soham_anand_jain, linkedIn: 'https://www.linkedin.com/in/soham-anand-jain/' },
  { name: 'Ryan Varghese Thomas', role: 'Structures Wing Member', subsystem: 'Structures', image: ryan_varghese_thomas, linkedIn: 'https://www.linkedin.com/in/ryanthomas2005/' },
  { name: 'Shamit Hoysal', role: 'Avionics', subsystem: 'Avionics', image: shamit_hoysal, linkedIn: 'https://www.linkedin.com/in/shamit-hoysal-6066072b9/' },
  { name: 'Abhinay P A', role: 'Marketing Team Lead', subsystem: 'Leads', image: abhinay_p_a, linkedIn: 'https://www.linkedin.com/in/abhinaypa101' },
  { name: 'Shubhang S. Galagali', role: 'Simulator Lead', subsystem: 'Leads', image: shubhang_galagali, linkedIn: 'https://www.linkedin.com/in/galavashubhang' },
  { name: 'Magani Tejaswini', role: 'Avionics', subsystem: 'Avionics', image: tejaswini_magani, linkedIn: 'https://www.linkedin.com/in/magani-tejaswini-a70a68346?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
  { name: 'Aman Nagpal', role: 'Avionics', subsystem: 'Avionics', image: aman_nagpal, linkedIn: 'www.linkedin.com/in/aman-nagpal-781721345' },
  { name: 'Aadhithya RK', role: 'Aerodynamics', subsystem: 'Aerodynamics', image: aadhithya_r_k, linkedIn: 'www.linkedin.com/in/aadhithya-karthik-558b57382' },
 { name: 'Nandeesh Urmesh Trivedi', role: 'Aerodynamics Lead', subsystem: 'Leads', image: Nandeesh_Urmesh_Trivedi, linkedIn: 'https://www.linkedin.com/in/nandeesh-trivedi-8b7a39308?utm_source=share&&utm_campaign=share_via&&utm_content=profile&&utm_medium=android_app' },
  { name: 'Goutham Sunil Kumar', role: 'Outreach Lead', subsystem: 'Leads', image: gouthamSunilKumar, linkedIn: 'https://www.linkedin.com/in/goutham-sunil-kumar-a95777253' },
  { name: 'Anindith B L', role: 'Manufacturing Lead', subsystem: 'Leads', image: anindith, linkedIn: 'https://www.linkedin.com/in/anindithbl' },
  { name: 'Vedant Sabnis', role: 'Aerodynamic / CFD Lead', subsystem: 'Leads', image: Vedant_Sabnis, linkedIn: 'http://www.linkedin.com/in/vedant-sabnis-6603b9280' },
  // Newly added names without changing any roles (placeholders)
  { name: 'Gowtham B M', role: 'Media Head', subsystem: 'Media', image: gowthambm, linkedIn: 'http://www.linkedin.com/in/gowthambm' },
  { name: 'Akhilesh', role: 'Avionics', subsystem: 'Avionics', image: akhilesh, linkedIn: 'https://www.linkedin.com/in/akhilesh-vadde-b0a6b2364?utm_source=share&&utm_campaign=share_via&&utm_content=profile&&utm_medium=android_app' },
  { name: 'R Adithya', role: 'Avionics Lead', subsystem: 'Leads', image:R_Adithya, linkedIn: 'http://linkedin.com/in/adithyar976' },
];

const orderedSubsystemNames = [
  'Leads',
  'Web Team',
  'Avionics',
  'Structures',
  'Aerodynamics',
  'Marketing',
  'Media',
  'Flight Simulator',
];

const groupMembersBySubsystem = (members) => {
  const map = new Map();
  members.forEach(({ subsystem, name, role, image, linkedIn }) => {
    if (!map.has(subsystem)) {
      map.set(subsystem, []);
    }
    map.get(subsystem).push({ name, role, image, linkedIn });
  });
  return map;
};

const groupedMembers = groupMembersBySubsystem(rawMembersData);

const finalSubsystems = [
  ...orderedSubsystemNames.filter((name) => groupedMembers.has(name)).map((name) => ({
    name,
    members: groupedMembers.get(name),
  })),
  ...Array.from(groupedMembers.entries())
    .filter(([name]) => !orderedSubsystemNames.includes(name))
    .map(([name, members]) => ({ name, members })),
];

const Team = () => {
  const [openSubsystems, setOpenSubsystems] = useState({});

  const toggleSubsystem = (index) => {
    setOpenSubsystems((prev) => ({
      [index]: !prev[index],
    }));
  };

  return (
    <section className="team-section">
      <h2>TEAM HEADS</h2>
      <div className="team-grid team-heads">
        {teamHeads.map(({ name, role, image, linkedIn }, idx) => (
          <div key={idx} className="team-member" style={{ '--delay': idx }}>
            {image && <img src={image} alt={name} className="team-photo" />}
            <h3>{name}</h3>
            <p>{role}</p>
            {linkedIn && (
              <a href={linkedIn} className="linkedin-link" target="_blank" rel="noopener noreferrer">
                <img src={linkedInLogo} alt="LinkedIn" />
              </a>
            )}
          </div>
        ))}
      </div>

      <h2>SUBSYSTEMS</h2>
      <div className="subsystem-button-grid">
        {finalSubsystems.map(({ name }, idx) => (
          <button
            key={idx}
            className={`subsystem-grid-btn ${openSubsystems[idx] ? 'active' : ''}`}
            onClick={() => toggleSubsystem(idx)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="team-grid subsystem-members">
        {finalSubsystems.map(({ members }, idx) =>
          openSubsystems[idx]
            ? members.map(({ name, role, image, linkedIn }, subIdx) => (
                <div key={subIdx} className="team-member" style={{ '--delay': subIdx }}>
                  {image && <img src={image} alt={name} className="team-photo" />}
                  <h3>{name}</h3>
                  <p>{role}</p>
                  {linkedIn && (
                    <a href={linkedIn} className="linkedin-link" target="_blank" rel="noopener noreferrer">
                      <img src={linkedInLogo} alt="LinkedIn" />
                    </a>
                  )}
                </div>
              ))
            : null
        )}
      </div>
    </section>
  );
};

export default Team;
