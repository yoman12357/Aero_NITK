import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './recruitment_page.css';
import instagramLogo from '../images/instagram_logo.png';
import youtubeLogo from '../images/youtube_logo.png';
import linkedInLogo from '../images/linkedIn_logo.png';
import logoImage from '../images/Aero_NITK_logo.png';
import Header from './header';

const teams = [
  "Web Team",
  "Avionics",
  "Structures",
  "Aerodynamics",
  "Marketing",
  "Media",
  "Flight Simulator",
];

const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    phone: "",
    branch: branches[0],
    semester: semesters[0],
    selectedTeams: [],
  });

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTeamSelect = (team) => {
    setFormData((prev) => {
      let newSelected = [...prev.selectedTeams];
      if (newSelected.includes(team)) {
        newSelected = newSelected.filter((t) => t !== team);
      } else if (newSelected.length < 2) {
        newSelected.push(team);
      }
      return { ...prev, selectedTeams: newSelected };
    });
  };

  return (
    <>
      <Header></Header>
      <section className="recruitment-section">
        <form
          className="recruitment-card"
          action="https://formspree.io/f/xzzazdpe"
          method="POST"
          onSubmit={(e) => {
            if (formData.selectedTeams.length !== 2) {
              e.preventDefault();
              alert("Please select exactly two teams.");
            }
          }}
        >
          <h2>JOIN OUR TEAM</h2>

          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Your full name"
            />
          </label>

          <label>
            Roll Number:
            <input
              type="text"
              name="rollNo"
              value={formData.rollNo}
              onChange={handleInputChange}
              required
              placeholder="Your roll number"
            />
          </label>

          <label>
            Phone Number:
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="Your phone number"
              pattern="[0-9]{10}"
            />
          </label>

          <label>
            Branch:
            <select name="branch" value={formData.branch} onChange={handleInputChange} required>
              {branches.map((br, idx) => (
                <option key={idx} value={br}>{br}</option>
              ))}
            </select>
          </label>

          <label>
            Semester:
            <select name="semester" value={formData.semester} onChange={handleInputChange} required>
              {semesters.map((sem, idx) => (
                <option key={idx} value={sem}>{sem}</option>
              ))}
            </select>
          </label>

          <fieldset>
            <legend>Choose exactly two teams:</legend>
            <div className="teams-checkboxes">
              {teams.map((team) => (
                <label key={team} className="team-checkbox">
                  <input
                    type="checkbox"
                    name="selectedTeams"
                    value={team}
                    checked={formData.selectedTeams.includes(team)}
                    onChange={() => handleTeamSelect(team)}
                    disabled={
                      !formData.selectedTeams.includes(team) &&
                      formData.selectedTeams.length >= 2
                    }
                  />
                  {team}
                </label>
              ))}
            </div>
          </fieldset>

          {formData.selectedTeams.map((team, idx) => (
            <input key={idx} type="hidden" name="selectedTeams[]" value={team} />
          ))}

          <button className="apply-btn" type="submit">
            APPLY NOW
          </button>
        </form>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-row">
            <img src={logoImage} alt="Aero NITK Logo" className="footer-logo" />
            <div className="footer-icons">
              <a href="https://www.instagram.com/aeronitk/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <img src={instagramLogo} alt="Instagram" className="social-icon" />
              </a>
              <a href="https://www.youtube.com/@AeroNITK" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <img src={youtubeLogo} alt="YouTube" className="social-icon" />
              </a>
              <a href="https://www.linkedin.com/company/aero-nitk" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <img src={linkedInLogo} alt="LinkedIn" className="social-icon" />
              </a>
            </div>
          </div>
          <div className="footer-credit">
            © 2025 Aero NITK | Built with <span style={{ color: '#3490eb' }}>💙</span> by Web Team , AeroNITK
          </div>
        </div>
      </footer>
    </>
  );
};

export default RecruitmentForm;