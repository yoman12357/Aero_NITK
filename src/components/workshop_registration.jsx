import React, { useState } from 'react';
import './workshop_registration.css';
import Footer from './footer.jsx';
import { saveToCollection } from '../firebase.js';
import { Helmet } from 'react-helmet-async';

const branches = [
    "Computer Science and Engineering", "Artificial Intelligence", "Information Technology",
    "Electronics and Communication Engineering", "Electrical and Electronics Engineering",
    "Computational and Data Science", "Mechanical Engineering", "Mathematical and Computational Sciences",
    "Civil Engineering", "Chemical Engineering", "Metallurgical and Materials Engineering", "Mining Engineering"
];

const WorkshopRegistration = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "", email: "", rollNo: "", phone: "",
        branch: "", year: "1", expectations: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = await saveToCollection("workshop_registrations", formData);

        if (result.success) {
            if (window.gtag) {
                window.gtag('event', 'workshop_registration_submit', {
                    'event_category': 'Conversion',
                    'event_label': 'Boeing Workshop'
                });
            }
            alert("Registration Successful!");
            setFormData({
                name: "", email: "", rollNo: "", phone: "",
                branch: "", year: "1", expectations: ""
            });
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
                <form className="workshop-card" onSubmit={handleSubmit}>
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
                                <option key={idx} value={br}>{br}</option>
                            ))}
                        </select>
                    </label>
                    <label>YEAR OF STUDY
                        <select name="year" value={formData.year} onChange={handleInputChange} required>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>
                    </label>
                    <label>WHAT DO YOU EXPECT FROM THIS WORKSHOP?
                        <textarea name="expectations" value={formData.expectations} onChange={handleInputChange} required placeholder="Tell us what you'd like to learn..." rows="4" />
                    </label>
                    <button className="register-btn" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "REGISTERING..." : "REGISTER NOW"}
                    </button>
                </form>
            </section>
            <Footer />
        </>
    );
};

export default WorkshopRegistration;