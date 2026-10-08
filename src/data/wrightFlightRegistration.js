// Set to 'ongoing' only when registrations are ready to open.
// 'upcoming' blocks submissions; 'closed' marks the event as past.
export const WRIGHT_FLIGHT_REGISTRATION_STATUS = 'ongoing';
export const WRIGHT_FLIGHT_MAX_SLOTS = 100;

export const WRIGHT_FLIGHT_REGISTRATION_FEE = 450;
export const WRIGHT_FLIGHT_GST_RATE = 18;
export const WRIGHT_FLIGHT_GST_AMOUNT = WRIGHT_FLIGHT_REGISTRATION_FEE * WRIGHT_FLIGHT_GST_RATE / 100;
export const WRIGHT_FLIGHT_TOTAL_AMOUNT = WRIGHT_FLIGHT_REGISTRATION_FEE + WRIGHT_FLIGHT_GST_AMOUNT;
