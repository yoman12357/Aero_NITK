
import React, { lazy } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getCustomRegistration } from '../data/customRegistrationRoutes.js';

const EventRegistrationForm = lazy(
    () => import('./EventRegistrationForm.jsx')
);

const RegistrationRouteResolver = () => {
    const { registrationKey } = useParams();

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
