
import React, { lazy } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getCustomRegistration } from '../data/customRegistrationRoutes.js';

const EventRegistrationForm = lazy(
    () => import('./EventRegistrationForm.jsx')
);

const RegistrationRouteResolver = () => {
    const { registrationKey } = useParams();
    const cleanKey = String(registrationKey || '').toLowerCase().replace(/[-_\s]/g, '');

    if (cleanKey === 'wrightflight') {
        return <Navigate to="/wright_flight_registration" replace />;
    }

    if (cleanKey === 'dronecompetition' || cleanKey === 'dronecompetetion') {
        return <Navigate to="/drone_competition_registration" replace />;
    }

    const customRegistration = getCustomRegistration(registrationKey);

    if (customRegistration) {
        return (
            <Navigate
                to={customRegistration.path}
                replace
            />
        );
    }

    return <EventRegistrationForm />;
};

export default RegistrationRouteResolver;
