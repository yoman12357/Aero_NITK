// Card templates — values filled at runtime from Firebase registration data.
// Each `key` maps to a field returned by fetchRegistrationCounts().
export const statDefinitions = [
    { key: 'total', label: 'Total Registrations', tone: 'blue', icon: 'users' },
    { key: 'workshop', label: 'Workshop Registrations', tone: 'green', icon: 'dashboard' },
    { key: 'wrightFlight', label: 'Wright Flight', tone: 'orange', icon: 'clock' },
    { key: 'activeEvents', label: 'Active Events', tone: 'purple', icon: 'dashboard' },
];

export const quickActions = [
    { title: 'Add New Event', description: 'Create a new event', tone: 'green', icon: 'plus' },
    { title: 'View Registrations', description: 'Check all registrations', tone: 'red', icon: 'users' },
    { title: 'Export Data', description: 'Download event data', tone: 'purple', icon: 'export' },
    { title: 'Announcements', description: 'Announce to participants', tone: 'gold', icon: 'mail' },
];
