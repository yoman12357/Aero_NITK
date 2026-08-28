// Shared constants for the admin Dashboard module.

// Map known event IDs to registration collection keys for live participant counts
export const EVENT_TO_REGISTRATION_KEY = {
    'skyverse-aeromodelling-workshop': 'workshop',
    'wright-flight': 'wrightFlight',
};

// Default shape for the add/edit event form
export const DEFAULT_EVENT_FORM = {
    title: '',
    description: '',
    currentParticipants: 0,
    maxCapacity: 0,
    status: '',
    statusTone: 'soon',
};
