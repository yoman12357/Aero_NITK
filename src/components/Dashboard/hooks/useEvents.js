import { useEffect, useState, useCallback } from 'react';
import { db } from '../../../firebase.js';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { DEFAULT_EVENT_FORM } from '../constants.js';

/**
 * Custom hook encapsulating all events-related state and Firebase CRUD operations.
 *
 * @returns {{
 *   events: Array,
 *   eventsLoading: boolean,
 *   eventImages: Object,
 *   isAddEventOpen: boolean,
 *   editingEventId: string|null,
 *   newEventForm: Object,
 *   newEventImage: string,
 *   openAddEventModal: () => void,
 *   openEditEventModal: (eventId: string) => void,
 *   closeAddEventModal: () => void,
 *   handleCreateEvent: (formEvent: Event) => Promise<void>,
 *   handleDeleteEvent: (eventId: string) => Promise<void>,
 *   handleEventImageChange: (eventId: string, file: File) => void,
 *   handleNewEventImageChange: (file: File|undefined) => void,
 *   setNewEventForm: Function,
 * }}
 */
export function useEvents() {
    const [events, setEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [eventImages, setEventImages] = useState({});
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);
    const [editingEventId, setEditingEventId] = useState(null);
    const [newEventForm, setNewEventForm] = useState({ ...DEFAULT_EVENT_FORM });
    const [newEventImage, setNewEventImage] = useState('');

    // Fetch events on mount
    useEffect(() => {
        let cancelled = false;

        const fetchEvents = async () => {
            setEventsLoading(true);
            try {
                const eventsCol = collection(db, 'events');
                const eventSnapshot = await getDocs(eventsCol);
                const eventList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                if (cancelled) return;
                setEvents(eventList);
            } catch (error) {
                console.error("Error fetching events:", error);
                if (!cancelled) setEvents([]);
            } finally {
                if (!cancelled) setEventsLoading(false);
            }
        };

        fetchEvents();

        return () => { cancelled = true; };
    }, []);

    const handleEventImageChange = useCallback((eventId, file) => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setEventImages((currentImages) => ({
                ...currentImages,
                [eventId]: reader.result,
            }));
        };
        reader.readAsDataURL(file);
    }, []);

    const closeAddEventModal = useCallback(() => {
        setIsAddEventOpen(false);
        setEditingEventId(null);
        setNewEventForm({ ...DEFAULT_EVENT_FORM });
        setNewEventImage('');
    }, []);

    const openAddEventModal = useCallback(() => {
        setEditingEventId(null);
        setNewEventForm({ ...DEFAULT_EVENT_FORM });
        setNewEventImage('');
        setIsAddEventOpen(true);
    }, []);

    const openEditEventModal = useCallback((eventId) => {
        const eventToEdit = events.find((event) => event.id === eventId);
        if (!eventToEdit) return;

        // Parse legacy string if needed
        let currentPart = eventToEdit.currentParticipants || 0;
        let maxCap = eventToEdit.maxCapacity || 0;
        if (eventToEdit.participants && !eventToEdit.maxCapacity && !eventToEdit.currentParticipants) {
            const parts = String(eventToEdit.participants).split('/');
            currentPart = parseInt(parts[0], 10) || 0;
            if (parts[1]) maxCap = parseInt(parts[1], 10) || 0;
        }

        setEditingEventId(eventId);
        setNewEventForm({
            title: eventToEdit.title,
            description: eventToEdit.description,
            currentParticipants: currentPart,
            maxCapacity: maxCap,
            status: eventToEdit.status,
            statusTone: eventToEdit.statusTone,
        });
        setNewEventImage(eventImages[eventId] || '');
        setIsAddEventOpen(true);
    }, [events, eventImages]);

    const handleNewEventImageChange = useCallback((file) => {
        if (!file) {
            setNewEventImage('');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setNewEventImage(reader.result);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleCreateEvent = useCallback(async (formEvent) => {
        formEvent.preventDefault();

        const title = newEventForm.title.trim();
        if (!title) return;

        const idBase = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const newEventId = idBase || `event-${Date.now()}`;

        const createdEvent = {
            id: newEventId,
            title,
            description: newEventForm.description.trim() || 'New event created from the dashboard.',
            currentParticipants: Number(newEventForm.currentParticipants) || 0,
            maxCapacity: Number(newEventForm.maxCapacity) || 0,
            status: newEventForm.status.trim(),
            statusTone: newEventForm.status.trim() ? newEventForm.statusTone : 'none',
        };

        try {
            if (editingEventId) {
                await setDoc(doc(db, 'events', editingEventId), createdEvent, { merge: true });
                setEvents((currentEvents) => currentEvents.map((event) => (event.id === editingEventId ? { ...event, ...createdEvent, id: editingEventId } : event)));
                setEventImages((currentImages) => {
                    const nextImages = { ...currentImages };
                    if (newEventImage) {
                        nextImages[editingEventId] = newEventImage;
                    }
                    return nextImages;
                });
            } else {
                await setDoc(doc(db, 'events', newEventId), createdEvent);
                setEvents((currentEvents) => [createdEvent, ...currentEvents]);

                if (newEventImage) {
                    setEventImages((currentImages) => ({
                        ...currentImages,
                        [newEventId]: newEventImage,
                    }));
                }
            }
        } catch (error) {
            console.error("Error saving event:", error);
        }

        closeAddEventModal();
    }, [newEventForm, newEventImage, editingEventId, closeAddEventModal]);

    const handleDeleteEvent = useCallback(async (eventId) => {
        try {
            await deleteDoc(doc(db, 'events', eventId));
            setEvents((currentEvents) => currentEvents.filter((event) => event.id !== eventId));
            setEventImages((currentImages) => {
                const nextImages = { ...currentImages };
                delete nextImages[eventId];
                return nextImages;
            });

            if (editingEventId === eventId) {
                closeAddEventModal();
            }
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    }, [editingEventId, closeAddEventModal]);

    return {
        events,
        eventsLoading,
        eventImages,
        isAddEventOpen,
        editingEventId,
        newEventForm,
        newEventImage,
        openAddEventModal,
        openEditEventModal,
        closeAddEventModal,
        handleCreateEvent,
        handleDeleteEvent,
        handleEventImageChange,
        handleNewEventImageChange,
        setNewEventForm,
    };
}
