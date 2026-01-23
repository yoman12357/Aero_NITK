///recuruitment form 
import React, { useState } from 'react';
import './recruitment_page.css';
import Footer from './footer.jsx';
import { saveApplicant } from '../firebase.js';

const teams = ["Web Team", "Avionics", "Structures", "Aerodynamics", "Marketing", "Media", "Flight Simulator"];
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
    rollNo: "",
    phone: "",
    branch: branches[0],
    semester: semesters[0],
    selectedTeams: [], // Stores teams in order: index 0 is Priority 1, index 1 is Priority 2
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTeamSelect = (team) => {
    setFormData((prev) => {
      let newSelected = [...prev.selectedTeams];

      // If already selected, remove it (Deselect)
      if (newSelected.includes(team)) {
        newSelected = newSelected.filter((t) => t !== team);
      } else {
        // Sliding logic: If we already have 2, remove the oldest (Priority 1)
        // so the old Priority 2 becomes Priority 1, and new choice becomes Priority 2
        if (newSelected.length >= 3) {
          newSelected.shift(); // Removes the first element
        }
        newSelected.push(team); // Adds new choice to the end
      }

      return { ...prev, selectedTeams: newSelected };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Strict validation: Must have exactly 2 teams
    if (formData.selectedTeams.length !== 2) {
      alert("Please select exactly two teams to indicate your 1st and 2nd priority.");
      return;
    }

    setIsSubmitting(true);
    const result = await saveApplicant(formData);
    setIsSubmitting(false);

    if (result.success) {
      alert("Application submitted successfully!");
      setFormData({
        name: "", rollNo: "", phone: "",
        branch: branches[0], semester: semesters[0],
        selectedTeams: []
      });
    } else {
      alert("Submission failed. Please check your connection.");
    }
  };

  return (
    <>
      <section className="recruitment-section">
        <form className="recruitment-card" onSubmit={handleSubmit}>
          <h2>JOIN OUR TEAM</h2>

          <label>Name:
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Your full name" />
          </label>

          <label>Roll Number:
            <input type="text" name="rollNo" value={formData.rollNo} onChange={handleInputChange} required placeholder="Your roll number" />
          </label>

          <label>Phone Number:
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="10-digit number" pattern="[0-9]{10}" />
          </label>

          <label>Branch:
            <select name="branch" value={formData.branch} onChange={handleInputChange} required>
              {branches.map((br, idx) => <option key={idx} value={br}>{br}</option>)}
            </select>
          </label>

          <label>Semester:
            <select name="semester" value={formData.semester} onChange={handleInputChange} required>
              {semesters.map((sem, idx) => <option key={idx} value={sem}>{sem}</option>)}
            </select>
          </label>

          <fieldset>
            <legend>Select Preferences (1st & 2nd Choice):</legend>
            <div className="teams-checkboxes">
              {teams.map((team) => {
                const priorityIndex = formData.selectedTeams.indexOf(team);
                return (
                  <label key={team} className={`team-checkbox ${priorityIndex !== -1 ? 'selected' : ''}`}>
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