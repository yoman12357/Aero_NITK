// Registration form templates configuration and helpers
import wrightFlightQr from '../images/wright_flight_qr.jpeg';

export const DEFAULT_BRANCHES = [
    "Computer Science and Engineering",
    "Artificial Intelligence",
    "Information Technology",
    "Electronics and Communication Engineering",
    "Electrical and Electronics Engineering",
    "Computational and Data Science",
    "Mechanical Engineering",
    "Mathematical and Computational Sciences",
    "Civil Engineering",
    "Chemical Engineering",
    "Metallurgical and Materials Engineering",
    "Mining Engineering"
];

export const DEFAULT_YEARS = [
    "1st Year",
    "2nd Year",
    "3rd Year",
    "4th Year",
    "Postgraduate / M.Tech / PhD"
];

export const BUILTIN_TEMPLATES = [
    {
        id: 'wrightFlight',
        name: 'Wright Flight (Team & Payment)',
        badge: 'Built-in',
        isBuiltin: true,
        type: 'team',
        description: 'Team registration (up to 4 members) with Captain details, College, Branch, Year, Team Member Details, and Payment QR & Screenshot verification.',
        route: '/wright_flight_registration',
        ctaLabel: 'Register for Wright Flight',
        hasPayment: true,
        defaultFee: 500,
        qrCodeImage: wrightFlightQr,
        paymentAmount: '₹500 per team',
        paymentInstructions: 'Scan & Pay via UPI, then upload the payment screenshot below',
        fields: [
            { id: 'teamName', label: 'Team Name', type: 'text', required: true, placeholder: 'Enter team name' },
            { id: 'collegeName', label: 'College / Institute Name', type: 'text', required: true, placeholder: 'National Institute of Technology Karnataka, Surathkal' },
            { id: 'captainName', label: 'Team Captain Full Name', type: 'text', required: true, placeholder: 'Enter captain full name' },
            { id: 'rollNo', label: 'Captain Roll Number', type: 'text', required: true, placeholder: 'e.g. 231ME124' },
            { id: 'email', label: 'Captain College / Personal Email', type: 'email', required: true, placeholder: 'captain@nitk.edu.in' },
            { id: 'phone', label: 'Captain WhatsApp / Phone Number', type: 'tel', required: true, placeholder: '10-digit mobile number' },
            { id: 'branch', label: 'Captain Branch', type: 'select', required: true, options: DEFAULT_BRANCHES },
            { id: 'year', label: 'Captain Year of Study', type: 'select', required: true, options: DEFAULT_YEARS },
            { id: 'participantCount', label: 'Total Team Members', type: 'select', required: true, options: ['1 (Solo)', '2 Members', '3 Members', '4 Members'] },
            { id: 'teamMembers', label: 'Team Members Information', type: 'textarea', required: false, placeholder: 'List member names, roll numbers, branches and contact numbers' },
            { id: 'transactionId', label: 'Payment Transaction ID / UTR', type: 'text', required: true, placeholder: 'Enter 12-digit UTR or transaction ID' },
            { id: 'paymentScreenshot', label: 'Payment Screenshot', type: 'file', required: true, helpText: 'Upload clear screenshot of the UPI transaction' }
        ]
    },
    {
        id: 'droneCompetition',
        name: 'Drone Competition (Team & Payment)',
        badge: 'Built-in',
        isBuiltin: true,
        type: 'team',
        description: 'Competitive drone racing / showcase registration with Team Name, Captain info, College, Team Members list, and Payment verification.',
        route: '/drone_competition_registration',
        ctaLabel: 'Register for Drone Competition',
        hasPayment: true,
        defaultFee: 300,
        qrCodeImage: wrightFlightQr,
        paymentAmount: '₹354 (₹300 + 18% GST)',
        paymentInstructions: 'Scan & Pay via UPI, then upload the payment screenshot below',
        fields: [
            { id: 'teamName', label: 'Team Name', type: 'text', required: true, placeholder: 'Enter team name' },
            { id: 'captainName', label: 'Captain Full Name', type: 'text', required: true, placeholder: 'Enter captain name' },
            { id: 'rollNo', label: 'Roll Number', type: 'text', required: true, placeholder: 'e.g. 231EC105' },
            { id: 'email', label: 'Email ID', type: 'email', required: true, placeholder: 'captain@gmail.com' },
            { id: 'phone', label: 'Phone Number', type: 'tel', required: true, placeholder: '10-digit phone number' },
            { id: 'collegeName', label: 'College / University Name', type: 'text', required: true, placeholder: 'College name' },
            { id: 'year', label: 'Year of Study', type: 'select', required: true, options: DEFAULT_YEARS },
            { id: 'teamMembers', label: 'Team Members (Names & Details)', type: 'textarea', required: true, placeholder: 'Member 2: Name, Roll No, Branch\nMember 3: Name, Roll No, Branch' },
            { id: 'transactionId', label: 'Payment Transaction ID / UTR', type: 'text', required: true, placeholder: 'Enter transaction reference' },
            { id: 'paymentScreenshot', label: 'Payment Screenshot', type: 'file', required: true, helpText: 'Upload proof of payment' }
        ]
    },
    {
        id: 'standard',
        name: 'Standard Event / Workshop Form',
        badge: 'Built-in',
        isBuiltin: true,
        type: 'individual',
        description: 'Standard single-participant registration for workshops, guest lectures, and tech sessions with NITK verification.',
        route: null,
        ctaLabel: 'Open Registration Form',
        hasPayment: false,
        fields: [
            { id: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter your full name' },
            { id: 'email', label: 'College Email ID (@nitk.edu.in)', type: 'email', required: true, placeholder: 'rollno@nitk.edu.in', helpText: 'Must end with @nitk.edu.in' },
            { id: 'rollNo', label: 'Roll Number', type: 'text', required: true, placeholder: 'e.g. 231CS101' },
            { id: 'phone', label: 'Phone Number', type: 'tel', required: true, placeholder: '10-digit mobile number' },
            { id: 'branch', label: 'Branch / Department', type: 'select', required: true, options: DEFAULT_BRANCHES },
            { id: 'year', label: 'Year of Study', type: 'select', required: true, options: DEFAULT_YEARS }
        ]
    }
];

const LOCAL_STORAGE_KEY = 'aeronitk_custom_templates_v1';

export function getLocalTemplates() {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!stored) return [];
        return JSON.parse(stored);
    } catch (e) {
        console.error('Error reading templates from localStorage:', e);
        return [];
    }
}

export function saveLocalTemplate(template) {
    try {
        const existing = getLocalTemplates();
        const index = existing.findIndex((t) => t.id === template.id);
        let updated;
        if (index >= 0) {
            updated = [...existing];
            updated[index] = { ...template, updatedAt: new Date().toISOString() };
        } else {
            updated = [
                ...existing,
                { ...template, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
            ];
        }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return updated;
    } catch (e) {
        console.error('Error saving template to localStorage:', e);
        return getLocalTemplates();
    }
}

export function deleteLocalTemplate(templateId) {
    try {
        const existing = getLocalTemplates();
        const updated = existing.filter((t) => t.id !== templateId);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return updated;
    } catch (e) {
        console.error('Error deleting template from localStorage:', e);
        return getLocalTemplates();
    }
}

export function getCombinedTemplates(customTemplates = []) {
    const customList = Array.isArray(customTemplates) && customTemplates.length > 0
        ? customTemplates
        : getLocalTemplates();

    const customIds = new Set(customList.map((t) => t.id));
    return [
        ...BUILTIN_TEMPLATES,
        ...customList.filter((t) => !customIds.has(t.id) || !BUILTIN_TEMPLATES.some((b) => b.id === t.id))
    ];
}

export function findTemplateById(templateId, customTemplates = []) {
    if (!templateId || templateId === 'none') return null;
    const all = getCombinedTemplates(customTemplates);
    return all.find((t) => t.id === templateId) || null;
}

export function createFieldSlug(label) {
    return (label || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '') || `field_${Date.now()}`;
}
