
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Footer from './footer.jsx';
import './DroneCompetitionRegistration.css';
import wrightFlightQr from '../images/wright_flight_qr.jpeg';
import { saveToCollection, checkDuplicateEventRegistration } from '../firebase.js';

const REGISTRATION_FEE = 300;
const GST_RATE = 18;
const GST_AMOUNT = REGISTRATION_FEE * GST_RATE / 100;
const TOTAL_AMOUNT = REGISTRATION_FEE + GST_AMOUNT;

const initialFormData = {
    teamName: '',
    captainName: '',
    rollNo: '',
    email: '',
    phone: '',
    collegeName: '',
    year: '',
    teamMembers: '',
    hp_field: ''
};

const DroneCompetitionRegistration = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [paymentScreenshot, setPaymentScreenshot] = useState('');
    const [screenshotFileName, setScreenshotFileName] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleScreenshotChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSubmitMessage('');
        setPaymentScreenshot('');
        setScreenshotFileName('');

        if (!file.type.startsWith('image/')) {
            setSubmitMessage('Please upload a payment screenshot as an image.');
            e.target.value = '';
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setSubmitMessage('Please upload an image smaller than 10 MB.');
            e.target.value = '';
            return;
        }

        try {
            const dataUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(new Error('Could not read image'));
                reader.readAsDataURL(file);
            });

            const compressedUrl = await new Promise((resolve, reject) => {
                const img = new Image();

                img.onload = () => {
                    const maxDimension = 900;
                    const scale = Math.min(
                        1,
                        maxDimension / Math.max(img.width, img.height)
                    );

                    const canvas = document.createElement('canvas');
                    canvas.width = Math.round(img.width * scale);
                    canvas.height = Math.round(img.height * scale);

                    const context = canvas.getContext('2d');

                    if (!context) {
                        reject(new Error('Could not process image'));
                        return;
                    }

                    context.drawImage(img, 0, 0, canvas.width, canvas.height);

                    let quality = 0.8;
                    let result = canvas.toDataURL('image/jpeg', quality);

                    while (result.length > 450 * 1024 && quality > 0.3) {
                        quality -= 0.1;
                        result = canvas.toDataURL('image/jpeg', quality);
                    }

                    if (result.length > 450 * 1024) {
                        reject(new Error('Image is too large after compression'));
                        return;
                    }

                    resolve(result);
                };

                img.onerror = () => reject(new Error('Could not load image'));
                img.src = dataUrl;
            });

            setPaymentScreenshot(compressedUrl);
            setScreenshotFileName(file.name);
        } catch {
            setSubmitMessage('Could not process that screenshot. Please try another image.');
            e.target.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.hp_field) return;

        if (!paymentScreenshot) {
            setSubmitMessage('Please upload your payment screenshot.');
            return;
        }

        if (formData.captainName.trim().length < 3) {
            setSubmitMessage("Please enter the captain's full name.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            setSubmitMessage('Please enter a valid email address.');
            return;
        }

        if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
            setSubmitMessage('Phone number must contain exactly 10 digits.');
            return;
        }

        if (formData.teamName.trim().length < 2) {
            setSubmitMessage('Please enter a valid team name.');
            return;
        }

        if (formData.rollNo.trim().length < 1) {
            setSubmitMessage("Please enter the captain's roll number.");
            return;
        }

        if (!formData.year) {
            setSubmitMessage("Please select the captain's year of study.");
            return;
        }

        if (formData.collegeName.trim().length < 2) {
            setSubmitMessage('Please enter your college name.');
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            const email = formData.email.trim().toLowerCase();
            const phone = formData.phone.trim();

            const duplicateCheck = await checkDuplicateEventRegistration(
                'droneCompetition',
                { email, phone }
            );

            if (duplicateCheck.duplicate) {
                setSubmitMessage(
                    `This ${duplicateCheck.field} is already registered for Drone Competition.`
                );
                return;
            }

            const result = await saveToCollection('droneCompetition_registrations', {
                teamName: formData.teamName.trim(),
                captainName: formData.captainName.trim(),
                name: formData.captainName.trim(),
                rollNo: formData.rollNo.trim(),
                email,
                phone,
                collegeName: formData.collegeName.trim(),
                year: formData.year,
                teamMembers: formData.teamMembers.trim(),
                paymentScreenshot,
                registrationFee: REGISTRATION_FEE,
                gstRate: GST_RATE,
                gstAmount: GST_AMOUNT,
                totalAmount: TOTAL_AMOUNT,
                eventTitle: 'Drone Competition',
                event: 'Drone Competition',
                paymentStatus: 'pending_verification'
            });

            if (!result.success) {
                throw new Error('Could not save registration');
            }

            setSubmitMessage(
                'Registration submitted successfully. Your payment is pending verification.'
            );
            setFormData(initialFormData);
            setPaymentScreenshot('');
            setScreenshotFileName('');
            e.target.reset();
        } catch (error) {
            console.error('Drone Competition registration error:', error);
            setSubmitMessage('Registration failed. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Drone Competition Registration | Aero NITK</title>
                <meta
                    name="description"
                    content="Drone Competition registration by Aero NITK."
                />
            </Helmet>

            <section className="drone-registration-section">
                <h1 className="drone-registration-title">
                    DRONE COMPETITION
                    <span>REGISTRATION</span>
                </h1>

                <div className="drone-registration-notice">
                    <h2>Team Registration</h2>
                    <p>Register your team for the Aero NITK Drone Competition.</p>
                    <p>Enter the captain's details and team information carefully.</p>
                </div>

                <div className="drone-registration-payment">
                    <h2>Registration Fee</h2>

                    <div className="drone-registration-fee-row">
                        <span>Registration fee</span>
                        <span>₹{REGISTRATION_FEE}</span>
                    </div>

                    <div className="drone-registration-fee-row">
                        <span>GST ({GST_RATE}%)</span>
                        <span>₹{GST_AMOUNT}</span>
                    </div>

                    <div className="drone-registration-fee-row drone-registration-fee-total">
                        <strong>Total payable</strong>
                        <strong>₹{TOTAL_AMOUNT}</strong>
                    </div>

                    <p className="drone-registration-payment-hint">
                        Confirm the official registration opening and payment details
                        with the organizers before paying.
                    </p>

                    <img
                        src={wrightFlightQr}
                        alt="Aero NITK payment QR code"
                        className="drone-registration-qr"
                    />
                </div>

                <form className="drone-registration-card" onSubmit={handleSubmit}>
                    <h2>Team Information</h2>

                    <label>
                        TEAM NAME *
                        <input
                            type="text"
                            name="teamName"
                            value={formData.teamName}
                            onChange={handleInputChange}
                            placeholder="Enter your team name"
                            required
                        />
                    </label>

                    <label>
                        TEAM CAPTAIN NAME *
                        <input
                            type="text"
                            name="captainName"
                            value={formData.captainName}
                            onChange={handleInputChange}
                            placeholder="Enter captain's full name"
                            required
                        />
                    </label>

                    <label>
                        CAPTAIN'S ROLL NUMBER *
                        <input
                            type="text"
                            name="rollNo"
                            value={formData.rollNo}
                            onChange={handleInputChange}
                            placeholder="Enter college roll number"
                            required
                        />
                    </label>

                    <label>
                        EMAIL ADDRESS *
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter email address"
                            required
                        />
                    </label>

                    <label>
                        PHONE NUMBER *
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="10-digit phone number"
                            pattern="[0-9]{10}"
                            maxLength={10}
                            required
                        />
                    </label>

                    <label>
                        COLLEGE / INSTITUTION *
                        <input
                            type="text"
                            name="collegeName"
                            value={formData.collegeName}
                            onChange={handleInputChange}
                            placeholder="Enter college name"
                            required
                        />
                    </label>

                    <label>
                        CAPTAIN'S YEAR OF STUDY *
                        <select
                            name="year"
                            value={formData.year}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select year</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                            <option value="5th Year">5th Year</option>
                            <option value="Other">Other</option>
                        </select>
                    </label>

                    <label>
                        TEAM MEMBERS
                        <textarea
                            name="teamMembers"
                            value={formData.teamMembers}
                            onChange={handleInputChange}
                            placeholder="Enter team member names and roll numbers"
                            rows={4}
                        />
                    </label>

                    <label>
                        PAYMENT SCREENSHOT *
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshotChange}
                            required
                        />
                        {screenshotFileName && (
                            <span className="drone-registration-file-name">
                                Selected: {screenshotFileName}
                            </span>
                        )}
                    </label>

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'SUBMITTING...' : 'REGISTER NOW'}
                    </button>

                    {submitMessage && (
                        <p
                            className="drone-registration-status"
                            role="status"
                            aria-live="polite"
                        >
                            {submitMessage}
                        </p>
                    )}

                    <p className="drone-registration-footnote">
                        All fields marked with * are required. Payment verification
                        will be completed by the organizing team.
                    </p>
                </form>
            </section>

            <Footer />
        </>
    );
};

export default DroneCompetitionRegistration;
