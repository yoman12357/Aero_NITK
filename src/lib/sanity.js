import { createClient } from '@sanity/client';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';

export const isSanityConfigured = Boolean(projectId);

export const sanityClient = isSanityConfigured
    ? createClient({
        projectId,
        dataset,
        apiVersion: '2026-08-12',
        useCdn: true,
        perspective: 'published',
    })
    : null;

export const EVENTS_QUERY = `
    *[_type == "event"] | order(startDate asc, _createdAt desc) {
        _id,
        title,
        description,
        "imageUrl": image.asset->url,
        registrationKey,
        manualParticipantCount,
        maxCapacity,
        status,
        startDate
    }
`;

export function getStudioUrl(eventId) {
    const studioUrl = import.meta.env.VITE_SANITY_STUDIO_URL || 'http://localhost:3333';
    return eventId ? `${studioUrl}/desk/event;${eventId}` : `${studioUrl}/desk/event`;
}
