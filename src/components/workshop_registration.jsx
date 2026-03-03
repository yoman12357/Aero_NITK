import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './workshop_registration.css';
import Footer from './footer.jsx';
import { saveToCollection, checkDuplicateRegistration } from '../firebase.js';
import { Helmet } from 'react-helmet-async';

const branches = [
    "Computer Science and Engineering", "Artificial Intelligence", "Information Technology",
    "Electronics and Communication Engineering", "Electrical and Electronics Engineering",
    "Computational and Data Science", "Mechanical Engineering", "Mathematical and Computational Sciences",
    "Civil Engineering", "Chemical Engineering", "Metallurgical and Materials Engineering", "Mining Engineering"
];

const WorkshopRegistration = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [duplicateError, setDuplicateError] = useState("");
    const [formData, setFormData] = useState({
        name: "", email: "", rollNo: "", phone: "",
        branch: "", year: "1", expectations: "",
        hp_field: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Honeypot check
        if (formData.hp_field) {
            console.warn("Bot detected via honeypot.");
            return;
        }

        // 2. Data Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert("Please enter a valid email address.");
            return;
        }
        if (formData.name.trim().length < 3) {
            alert("Please enter your full name (min 3 characters).");
            return;
        }
        // Roll No must start with 251
        const rollNoTrimmed = formData.rollNo.trim();
        if (!rollNoTrimmed.startsWith("251") || rollNoTrimmed.length < 8) {
            alert("Roll Number must start with 251 (e.g., 251CS001). Please check and try again.");
            return;
        }
        if (!/^[0-9]{10}$/.test(formData.phone)) {
            alert("Phone number must be exactly 10 digits.");
            return;
        }

        setIsSubmitting(true);
        setDuplicateError("");

        // 3. Duplicate check against Firestore
        const dupCheck = await checkDuplicateRegistration({
            rollNo: formData.rollNo.trim(),
            email: formData.email.trim().toLowerCase(),
            phone: formData.phone.trim(),
        });
        if (dupCheck.duplicate) {
            setDuplicateError(
                `Your ${dupCheck.field} is already registered. It looks like you've already filled the form! If you think this is a mistake, please contact us.`
            );
            setIsSubmitting(false);
            return;
        }

        const result = await saveToCollection("workshop_registrations", formData);

        if (result.success) {
            if (window.gtag) {
                window.gtag('event', 'workshop_registration_submit', {
                    'event_category': 'Conversion',
                    'event_label': 'Skyverse Workshop'
                });
            }
            setFormData({
                name: "", email: "", rollNo: "", phone: "",
                branch: "", year: "1", expectations: "",
                hp_field: ""
            });
            navigate('/workshop_success');
        } else {
            alert("Submission failed. Please try again.");
        }
        setIsSubmitting(false);
    };

    return (
        <>
            <Helmet>
                <title>Workshop Registration | Aero NITK</title>
                <meta name="description" content="Register for the Boeing Aeromodelling Workshop at NITK Surathkal. Join us for a day of aviation and innovation." />
                <link rel="canonical" href="https://aeronitk.in/workshop_registration" />
            </Helmet>
            <section className="workshop-section">
                <h2 className="workshop-title">WORKSHOP REGISTRATION</h2>
                <div className="workshop-guidelines">
                    <h3 className="guidelines-heading">Guidelines:</h3>
                    <ul className="guidelines-list">
                        <li>Each member has to register <strong>individually</strong> by filling this form using <strong>EDU mail</strong>.</li>
                        {/* <li>If you have a group, you may opt for the <strong>'yes'</strong> in the team option and provide a common team name.</li>
                        <li>If at all you don't have a group you will be assigned one considering participation.</li>
                        <li>The size of the team may vary according to the number of participants. Flexibility is expected from participants.</li> */}
                        <li>The allotment is on first-come first-serve basis. Registration will close once <strong>slots are full</strong>.</li>
                        <li>Every participant is expected to be present throughout the duration of the workshop as and when informed.</li>
                        <li>The workshop is only for <strong>1st years</strong>.</li>
                    </ul>
                </div>
                <form className="workshop-card" onSubmit={handleSubmit}>
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
                    <label>
                        ROLL NUMBER <span className="roll-hint">(e.g., 251CS001)</span>
                        <input
                            type="text"
                            name="rollNo"
                            value={formData.rollNo}
                            onChange={handleInputChange}
                            required
                            placeholder="251XXXXXX"
                        />
                    </label>
                    <label>PHONE NUMBER
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="10-Digit Number" pattern="[0-9]{10}" />
                    </label>
                    <label>BRANCH
                        <select name="branch" value={formData.branch} onChange={handleInputChange} required>
                            <option value="" disabled hidden>Select Here</option>
                            {branches.map((br, idx) => (
                                <option key={idx} value={br}>{br}</option>
                            ))}
                        </select>
                    </label>
                    <label>YEAR OF STUDY
                        <input type="text" value="1st Year" readOnly className="readonly-input" />
                    </label>
                    <label>WHAT DO YOU EXPECT FROM THIS WORKSHOP?
                        <textarea name="expectations" value={formData.expectations} onChange={handleInputChange} required placeholder="Tell us what you'd like to learn..." rows="4" />
                    </label>
                    <button className="register-btn" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "CHECKING & REGISTERING..." : "REGISTER NOW"}
                    </button>
                    {duplicateError && (
                        <div className="duplicate-error-box" role="alert">
                            <span className="duplicate-error-icon">⚠️</span>
                            <p>{duplicateError}</p>
                        </div>
                    )}
                </form>
            </section>
            <Footer />
        </>
    );
};

export default WorkshopRegistration;