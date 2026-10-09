
import { lazy } from 'react';

export const normalizeRegistrationKey = (key = '') =>
    key.toLowerCase().replace(/[-_\s]/g, '');

export const CUSTOM_REGISTRATIONS = [
    {
        key: 'droneCompetition',
        aliases: [
            'droneCompetition',
            'droneCompetetion',
            'drone-competition',
            'drone-competetion',
            'drone_competition',
            'drone_competetion',
            'dronecompetition',
            'dronecompetetion'
        ],
        path: '/drone_competition_registration',
        legacyPaths: [
            '/drone_competetion_registration'
        ],
        component: lazy(
            () => import('../components/DroneCompetitionRegistration.jsx')
        )
    }
];

export const getCustomRegistration = (registrationKey) => {
    const normalizedKey = normalizeRegistrationKey(registrationKey);

    return CUSTOM_REGISTRATIONS.find((registration) =>
        [registration.key, ...registration.aliases].some(
            (alias) => normalizeRegistrationKey(alias) === normalizedKey
        )
    );
};
