import React, { useState } from 'react';
import './recruitment_page.css';
import Footer from './footer.jsx';
import { saveApplicant } from '../firebase.js';
import { Helmet } from 'react-helmet-async';

const teams = ["Web Team", "Structures", "Media", "Avionics", "Aerodynamics", "Marketing"];
const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
const branches = [
  "Computer Science and Engineering", "Artificial Intelligence", "Information Technology",
  "Electronics and Communication Engineering", "Electrical and Electronics Engineering",
  "Computational and Data Science", "Mechanical Engineering", "Mathematical and Computational Sciences",
  "Civil Engineering", "Chemical Engineering", "Metallurgical and Materials Engineering", "Mining Engineering"
];

const RecruitmentForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNo: "",
    phone: "",
    branch: "",
    semester: "",
    selectedTeams: [],
    whyJoin: "",
    hp_field: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTeamSelect = (team) => {
    setFormData((prev) => {
      let newSelected = [...prev.selectedTeams];
      if (newSelected.includes(team)) {
        newSelected = newSelected.filter((t) => t !== team);
      } else {
        if (newSelected.length >= 3) {
          newSelected.shift();
        }
        newSelected.push(team);
      }
      return { ...prev, selectedTeams: newSelected };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot check
    if (formData.hp_field) {
      console.warn("Bot detected via honeypot.");
      return;
    }

    if (formData.selectedTeams.length !== 3) {
      alert("Please select exactly three teams to indicate your 1st and 2nd priority.");
      return;
    }

    setIsSubmitting(true);
    const result = await saveApplicant(formData);
    setIsSubmitting(false);

    if (result.success) {
      if (window.gtag) {
        window.gtag('event', 'recruitment_apply_submit', {
          'event_category': 'Engagement',
          'event_label': 'Join Our Team'
        });
      }
      alert("Application submitted successfully!");
      setFormData({
        name: "", email: "", rollNo: "", phone: "",
        branch: "", semester: "",
        selectedTeams: [], whyJoin: ""
      });
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
        {/* Header moved outside the form to be styled independently */}
        <h2 className="recruitment-title">JOIN OUR TEAM</h2>

        <form className="recruitment-card" onSubmit={handleSubmit}>
          {/* Honeypot field */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <input type="text" name="hp_field" value={formData.hp_field} onChange={handleInputChange} tabIndex="-1" autoComplete="off" />
          </div>
          <label>NAME
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Your Full Name" />
          </label>
          <label>E-Mail
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="E-mail" />
          </label>

          <label>ROLL NUMBER
            <input type="text" name="rollNo" value={formData.rollNo} onChange={handleInputChange} required placeholder="Your Roll Number" />
          </label>

          <label>PHONE NUMBER
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="10-Digit Number" pattern="[0-9]{10}" />
          </label>

          <label>BRANCH
            <select name="branch" value={formData.branch} onChange={handleInputChange} required>
              <option value="" disabled hidden>Select Here</option>
              {branches.map((br, idx) => (
                <option key={idx} value={br} style={{ color: '#ffffff' }}>
                  {br}
                </option>
              ))}
            </select>
          </label>

          <label>SEMESTER
            <select name="semester" value={formData.semester} onChange={handleInputChange} required>
              <option value="" disabled hidden>Select Here</option>
              {semesters.map((sem, idx) => (
                <option key={idx} value={sem} style={{ color: '#ffffff' }}>
                  {sem}
                </option>
              ))}
            </select>
          </label>

          <fieldset>
            {/* Update preference legend in recruitment_page.jsx if needed */}
            <legend>SELECT PREFERENCE ORDER (1ST, 2ND, 3RD)</legend>
            <div className="teams-checkboxes">
              {teams.map((team) => {
                const priorityIndex = formData.selectedTeams.indexOf(team);
                return (
                  <label key={team} className="team-checkbox">
                    <input
                      type="checkbox"
                      checked={priorityIndex !== -1}
                      onChange={() => handleTeamSelect(team)}
                    />
                    {team}
                    {priorityIndex !== -1 && (
                      <span className="priority-badge"> (P{priorityIndex + 1})</span>
                    )}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <label>WHY DO YOU WANT TO JOIN AERONITK?
            <textarea
              name="whyJoin"
              value={formData.whyJoin}
              onChange={handleInputChange}
              required
              placeholder="Tell us about your interest and motivation..."
              rows="4"
            />
          </label>

          <button className="apply-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "SUBMITTING..." : "APPLY NOW"}
          </button>
        </form>
      </section>
      <Footer />
    </>
  );
};

export default RecruitmentForm;