
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import Header from './components/header.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import RegistrationRouteResolver from './components/RegistrationRouteResolver.jsx';
import { CUSTOM_REGISTRATIONS } from './data/customRegistrationRoutes.js';

const AeroNITKHomepage = lazy(() => import('./AeronitkHomepage.jsx'));
const WorkshopRegistration = lazy(() => import('./components/workshop_registration.jsx'));
const WorkshopSuccess = lazy(() => import('./components/WorkshopSuccess.jsx'));
const WrightFlightRegistration = lazy(() => import('./components/wright_flight_registration.jsx'));
const WrightFlightSuccess = lazy(() => import('./components/WrightFlightSuccess.jsx'));
const RegistrationsPage = lazy(() => import('./components/RegistrationsPage.jsx'));
const AboutPage = lazy(() => import('./components/aboutpage.jsx'));
const Gallery = lazy(() => import('./components/Gallery.jsx'));
const Team = lazy(() => import('./components/Team.jsx'));
const AlumniPage = lazy(() => import('./components/AlumniPage.jsx'));
const AlumniBatchPage = lazy(() => import('./components/AlumniBatchPage'));
const BatchDetails = lazy(() => import('./components/BatchDetails.jsx'));
const Recruitment = lazy(() => import('./components/recruitment_page.jsx'));
const RecruitmentSuccess = lazy(() => import('./components/RecruitmentSuccess.jsx'));
const Sponsors = lazy(() => import('./components/sponsors.jsx'));
const NotFound = lazy(() => import('./components/NotFound.jsx'));
const Login = lazy(() => import('./components/LoginPage.jsx'));
const DashBoard = lazy(() => import('./components/DashBoard.jsx'));

import { incrementVisitorCount, auth } from './firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function ProtectedRoute({ children, authLoading, user }) {
    if (authLoading) return <LoadingSpinner />;
    if (!user) return <Navigate to="/login" replace />;
    return children;
}

const App = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (window.gtag) {
            window.gtag('config', 'G-JFHQQG3DN2', {
                page_path: location.pathname + location.search
            });
        }
    }, [location]);

    useEffect(() => {
        const hasBeenCounted = sessionStorage.getItem('v_counted');

        if (!hasBeenCounted) {
            incrementVisitorCount();
            sessionStorage.setItem('v_counted', 'true');
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            ['/gallery', '/team'].forEach((path) => {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = path;
                document.head.appendChild(link);
            });

            if (import.meta.env.MODE === 'development') {
                console.log('🚀 Critical routes prefetched for instant navigation.');
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const [isMaintenanceActive, setIsMaintenanceActive] = useState(
        import.meta.env.VITE_MAINTENANCE_MODE === 'true'
    );

    useEffect(() => {
        if (!isMaintenanceActive) return;

        const TIMER_VERSION = 'v1';
        const MINUTES_FOR_TIMER = 30;
        const storageKey = `maintenanceExpiry_${TIMER_VERSION}`;

        let targetTime = localStorage.getItem(storageKey);

        if (!targetTime) {
            targetTime = Date.now() + MINUTES_FOR_TIMER * 60 * 1000;

            Object.keys(localStorage).forEach((key) => {
                if (key.startsWith('maintenanceExpiry_')) {
                    localStorage.removeItem(key);
                }
            });

            localStorage.setItem(storageKey, targetTime);
        }

        targetTime = Number(targetTime);

        const calculateTimeLeft = () => {
            const difference = Math.max(
                0,
                Math.floor((targetTime - Date.now()) / 1000)
            );

            setTimeLeft(difference);

            if (difference <= 0) {
                setIsMaintenanceActive(false);
                localStorage.removeItem(storageKey);
            }
        };

        calculateTimeLeft();

        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [isMaintenanceActive]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (isMaintenanceActive && timeLeft > 0) {
        return (
            <div
                style={{
                    backgroundColor: '#000',
                    color: '#fff',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontFamily: 'sans-serif',
                    textAlign: 'center'
                }}
            >
                <h1 style={{ color: '#ff4d4d', fontSize: '2.5rem' }}>
                    ⚠️ STRESS TEST IN PROGRESS
                </h1>

                <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
                    The AeroNITK site is temporarily offline for security testing.
                </p>

                <div
                    style={{
                        fontSize: '5rem',
                        fontWeight: 'bold',
                        color: '#fff',
                        border: '4px solid #ff4d4d',
                        padding: '20px 50px',
                        borderRadius: '15px',
                        boxShadow: '0 0 20px rgba(255, 77, 77, 0.5)'
                    }}
                >
                    {formatTime(timeLeft)}
                </div>

                <p style={{ marginTop: '20px', color: '#888' }}>
                    Site will automatically restore when the countdown ends.
                </p>
            </div>
        );
    }

    const isDashboardRoute = location.pathname.startsWith('/dashboard');

    return (
        <div className="App">
            <ScrollToTop />

            {!isDashboardRoute && <Header isScrolled={isScrolled} />}

            <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                    <Route path="/" element={<AeroNITKHomepage />} />

                    <Route
                        path="/workshop_registration"
                        element={<WorkshopRegistration />}
                    />
                    <Route
                        path="/workshop_success"
                        element={<WorkshopSuccess />}
                    />

                    <Route
                        path="/registrations"
                        element={<RegistrationsPage />}
                    />

                    <Route
                        path="/wright_flight_registration"
                        element={<WrightFlightRegistration />}
                    />
                    <Route
                        path="/wright_flight_success"
                        element={<WrightFlightSuccess />}
                    />

                    <Route
                        path="/register/wrightFlight"
                        element={
                            <Navigate
                                to="/wright_flight_registration"
                                replace
                            />
                        }
                    />
                    <Route
                        path="/register/wright-flight"
                        element={
                            <Navigate
                                to="/wright_flight_registration"
                                replace
                            />
                        }
                    />

                    {CUSTOM_REGISTRATIONS.map((registration) => {
                        const RegistrationComponent = registration.component;

                        return (
                            <React.Fragment key={registration.key}>
                                <Route
                                    path={registration.path}
                                    element={<RegistrationComponent />}
                                />

                                {registration.legacyPaths?.map((legacyPath) => (
                                    <Route
                                        key={legacyPath}
                                        path={legacyPath}
                                        element={
                                            <Navigate
                                                to={registration.path}
                                                replace
                                            />
                                        }
                                    />
                                ))}
                            </React.Fragment>
                        );
                    })}

                    <Route
                        path="/register/:registrationKey"
                        element={<RegistrationRouteResolver />}
                    />

                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/alumni" element={<AlumniPage />} />
                    <Route path="/alumni/:batchId" element={<AlumniBatchPage />} />
                    <Route path="/alumni/:year" element={<BatchDetails />} />
                    <Route path="/recruitment" element={<Recruitment />} />
                    <Route
                        path="/recruitment-success"
                        element={<RecruitmentSuccess />}
                    />
                    <Route path="/sponsors" element={<Sponsors />} />
                    <Route path="/login" element={<Login />} />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute
                                authLoading={authLoading}
                                user={user}
                            >
                                <Navigate to="/dashboard/home" replace />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/dashboard/*"
                        element={
                            <ProtectedRoute
                                authLoading={authLoading}
                                user={user}
                            >
                                <DashBoard />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </div>
    );
};

export default App;
