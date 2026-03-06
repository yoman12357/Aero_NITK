// import React, { useState } from 'react';
// import './recruitment_page.css';
// import Footer from './footer.jsx';
// import { saveApplicant } from '../firebase.js';
// import { Helmet } from 'react-helmet-async';

// const teams = ["Technical", "Web team", "Designer", "Media", "Marketing"];
// const years = ["1st Year", "2nd Year"];
// const branches = [
//   "Computer Science and Engineering", "Artificial Intelligence", "Information Technology",
//   "Electronics and Communication Engineering", "Electrical and Electronics Engineering",
//   "Computational and Data Science", "Mechanical Engineering", "Mathematical and Computational Sciences",
//   "Civil Engineering", "Chemical Engineering", "Metallurgical and Materials Engineering", "Mining Engineering"
// ];

// const RecruitmentForm = () => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     rollNo: "",
//     phone: "",
//     branch: "",
//     year: "",
//     selectedTeam: "",
//     whyJoin: "",
//     hp_field: ""
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleTeamSelect = (team) => {
//     setFormData((prev) => ({ ...prev, selectedTeam: team }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // 1. Honeypot check
//     if (formData.hp_field) {
//       console.warn("Bot detected via honeypot.");
//       return;
//     }

//     // 2. Data Validation
//     const emailRegex = /^[^\s@]+@nitk\.edu\.in$/;
//     if (!emailRegex.test(formData.email)) {
//       alert("Please enter a valid NITK email address (@nitk.edu.in).");
//       return;
//     }
//     if (formData.name.trim().length < 3) {
//       alert("Name must be at least 3 characters.");
//       return;
//     }
//     if (!/^(251|241)/.test(formData.rollNo)) {
//       alert("Roll number must start with 251 or 241.");
//       return;
//     }
//     if (!/^[0-9]{10}$/.test(formData.phone)) {
//       alert("Phone number must be exactly 10 digits.");
//       return;
//     }

//     if (!formData.selectedTeam) {
//       alert("Please select one team to join.");
//       return;
//     }

//     setIsSubmitting(true);
//     const result = await saveApplicant(formData);
//     setIsSubmitting(false);

//     if (result.success) {
//       if (window.gtag) {
//         window.gtag('event', 'recruitment_apply_submit', {
//           'event_category': 'Engagement',
//           'event_label': 'Join Our Team'
//         });
//       }
//       window.location.href = '/recruitment-success';
//     }
//   };

//   return (
//     <>
//       <Helmet>
//         <title>Recruitment | Aero NITK</title>
//         <meta name="description" content="Join Aero NITK! We are looking for passionate students to join our technical and marketing subsystems." />
//         <link rel="canonical" href="https://aeronitk.in/recruitment" />
//       </Helmet>
//       <section className="recruitment-section">
//         {/* Header moved outside the form to be styled independently */}
//         <h2 className="recruitment-title">JOIN OUR TEAM</h2>

//         <form className="recruitment-card" onSubmit={handleSubmit}>
//           {/* Honeypot field */}
//           <div style={{ display: 'none' }} aria-hidden="true">
//             <input type="text" name="hp_field" value={formData.hp_field} onChange={handleInputChange} tabIndex="-1" autoComplete="off" />
//           </div>
//           <label>NAME
//             <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Your Full Name" />
//           </label>
//           <label>E-Mail
//             <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="E-mail" />
//           </label>

//           <label>ROLL NUMBER
//             <input type="text" name="rollNo" value={formData.rollNo} onChange={handleInputChange} required placeholder="Your Roll Number" />
//           </label>

//           <label>PHONE NUMBER
//             <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="10-Digit Number" pattern="[0-9]{10}" />
//           </label>

//           <label>BRANCH
//             <select name="branch" value={formData.branch} onChange={handleInputChange} required>
//               <option value="" disabled hidden>Select Here</option>
//               {branches.map((br, idx) => (
//                 <option key={idx} value={br} style={{ color: '#ffffff' }}>
//                   {br}
//                 </option>
//               ))}
//             </select>
//           </label>

//           <label>YEAR
//             <select name="year" value={formData.year} onChange={handleInputChange} required>
//               <option value="" disabled hidden>Select Here</option>
//               {years.map((year, idx) => (
//                 <option key={idx} value={year} style={{ color: '#ffffff' }}>
//                   {year}
//                 </option>
//               ))}
//             </select>
//           </label>

//           <fieldset>
//             <legend>SELECT YOUR PREFERRED TEAM</legend>
//             <div className="teams-checkboxes">
//               {teams.map((team) => (
//                 <label key={team} className="team-checkbox">
//                   <input
//                     type="radio"
//                     name="teamSelection"
//                     checked={formData.selectedTeam === team}
//                     onChange={() => handleTeamSelect(team)}
//                   />
//                   <span>{team}</span>
//                 </label>
//               ))}
//             </div>
//           </fieldset>

//           <label>WHY DO YOU WANT TO JOIN AERONITK?
//             <textarea
//               name="whyJoin"
//               value={formData.whyJoin}
//               onChange={handleInputChange}
//               required
//               placeholder="Tell us about your interest and motivation..."
//               rows="4"
//             />
//           </label>

//           <button className="apply-btn" type="submit" disabled={isSubmitting}>
//             {isSubmitting ? "SUBMITTING..." : "APPLY NOW"}
//           </button>
//         </form>
//       </section>
//       <Footer />
//     </>
//   );
// };

// export default RecruitmentForm;

import React, { useState } from 'react';
import './recruitment_page.css';
import Footer from './footer.jsx';
import { saveApplicant, checkEmailExists } from '../firebase.js';
import { Helmet } from 'react-helmet-async';

const teams = ["Technical", "Web team", "Designer", "Media", "Marketing"];

const years = ["1st Year", "2nd Year"];

const branches = [
  "Computer Science and Engineering",
  "Artificial Intelligence",
  "Information Technology",
  "Electronics and Communication Engineering",
  "Electrical and Electronics Engineering",
  "Computational and Data Science",
  "Mechanical Engineering",
  "Mathematical and Computational Sciences",
  "Civil Engineering",
  "Chemical Engineering",
  "Metallurgical and Materials Engineering",
  "Mining Engineering"
];

const RecruitmentForm = () => {

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNo: "",
    phone: "",
    branch: "",
    year: "",
    selectedTeam: "",
    whyJoin: "",
    hp_field: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTeamSelect = (team) => {
    setFormData((prev) => ({
      ...prev,
      selectedTeam: team
    }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    // Honeypot
    if (formData.hp_field) {
      console.warn("Bot detected.");
      return;
    }

    // EMAIL VALIDATION
    const emailRegex = /^[^\s@]+@nitk\.edu\.in$/;

    if (!emailRegex.test(formData.email)) {
      alert("Only NITK email IDs (@nitk.edu.in) are allowed.");
      return;
    }

    // NAME VALIDATION
    if (formData.name.trim().length < 3) {
      alert("Name must be at least 3 characters.");
      return;
    }

    // ROLL NUMBER VALIDATION
    const rollRegex = /^(251|241)[0-9]+$/;

    if (!rollRegex.test(formData.rollNo)) {
      alert("Roll number must start with 251 or 241.");
      return;
    }

    // PHONE VALIDATION
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    // TEAM VALIDATION
    if (!formData.selectedTeam) {
      alert("Please select exactly one team.");
      return;
    }

    if (formData.whyJoin.trim().length < 50) {
      alert("Please write at least 50 characters explaining why you want to join Aero NITK.");
      return;
    }

    setIsSubmitting(true);

    // CHECK DUPLICATE EMAIL
    const emailExists = await checkEmailExists(formData.email);

    if (emailExists) {
      setIsSubmitting(false);
      alert("This email has already been used for registration.");
      return;
    }

    // SAVE DATA
    const result = await saveApplicant(formData);

    setIsSubmitting(false);

    if (result.success) {

      if (window.gtag) {
        window.gtag('event', 'recruitment_apply_submit', {
          event_category: 'Engagement',
          event_label: 'Join Our Team'
        });
      }

      window.location.href = '/recruitment-success';
    }

  };

  return (
    <>
      <Helmet>
        <title>Recruitment | Aero NITK</title>
        <meta name="description" content="Join Aero NITK! We are looking for passionate students to join our technical and marketing subsystems." />
        <link rel="canonical" href="https://aeronitk.in/recruitment" />
      </Helmet>

      <section className="recruitment-section">

        <h2 className="recruitment-title">JOIN OUR TEAM</h2>

        <form className="recruitment-card" onSubmit={handleSubmit}>

          {/* Honeypot */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <input
              type="text"
              name="hp_field"
              value={formData.hp_field}
              onChange={handleInputChange}
              tabIndex="-1"
              autoComplete="off"
            />
          </div>

          <label>NAME
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Your Full Name"
            />
          </label>

          <label>E-Mail
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="example@nitk.edu.in"
            />
          </label>

          <label>ROLL NUMBER
            <input
              type="text"
              name="rollNo"
              value={formData.rollNo}
              onChange={handleInputChange}
              required
              placeholder="251xxxxx or 241xxxxx"
            />
          </label>

          <label>PHONE NUMBER
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="10 Digit Number"
              pattern="[0-9]{10}"
            />
          </label>

          <label>BRANCH
            <select
              name="branch"
              value={formData.branch}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled hidden>Select Here</option>

              {branches.map((br, idx) => (
                <option key={idx} value={br}>
                  {br}
                </option>
              ))}

            </select>
          </label>

          <label>YEAR
            <select
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              required
            >

              <option value="" disabled hidden>Select Year</option>

              {years.map((year, idx) => (
                <option key={idx} value={year}>
                  {year}
                </option>
              ))}

            </select>
          </label>

          <fieldset>

            <legend>SELECT YOUR TEAM</legend>

            <div className="teams-checkboxes">

              {teams.map((team) => (

                <label key={team} className="team-checkbox">

                  <input
                    type="radio"
                    name="teamSelection"
                    checked={formData.selectedTeam === team}
                    onChange={() => handleTeamSelect(team)}
                  />

                  <span>{team}</span>

                </label>

              ))}

            </div>

          </fieldset>

          <label>WHY DO YOU WANT TO JOIN AERONITK?
            <textarea
              name="whyJoin"
              value={formData.whyJoin}
              onChange={handleInputChange}
              required
              minLength={50}
              placeholder="Tell us about your interest..."
              rows="4"
            />
          </label>

          <button
            className="apply-btn"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "SUBMITTING..." : "APPLY NOW"}
          </button>

        </form>

      </section>

      <Footer />
    </>
  );

};

export default RecruitmentForm;