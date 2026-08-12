import { createClient } from '@sanity/client';

// Check if Sanity is configured properly
export const isSanityConfigured = Boolean(
  import.meta.env.VITE_SANITY_PROJECT_ID && 
  import.meta.env.VITE_SANITY_PROJECT_ID !== 'your_project_id'
);

// Frontend read-only client
export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || '',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

// Alias for compatibility with hooks expecting sanityClient
export const sanityClient = client;

// GROQ query used by useEvents.js
export const EVENTS_QUERY = `*[_type == "event"] | order(_createdAt desc) {
  _id,
  title,
  description,
  "imageUrl": image.asset->url,
  registrationKey,
  manualParticipantCount,
  maxCapacity,
  status,
  startDate
}`;

// Helper to get Sanity Studio URL pointing directly to the event creation form
export const getStudioUrl = () => {
  return 'https://aeronitk.sanity.studio/intent/create/type=event';
};