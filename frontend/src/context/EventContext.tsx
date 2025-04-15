import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	ReactNode,
	useEffect,
	useRef,
} from "react";
import { Events, EventRequest } from "../interfaces/events";
import {
	getEvents,
	createEvent,
	updateEvent,
	deleteEvent,
} from "../api/events";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

interface EventContextProps {
	events: Events[];
	isLoading: boolean;
	error: string | null;
	fetchEvents: (refresh?: boolean) => Promise<void>;
	addEvent: (eventData: EventRequest) => Promise<Events | null>;
	updateEventById: (
		id: number,
		eventData: Partial<Events>
	) => Promise<Events | null>;
	removeEvent: (id: number) => Promise<boolean>;
	getEventsByApplication: (applicationId: number) => Events[];
}

const EventContext = createContext<EventContextProps>({
	events: [],
	isLoading: false,
	error: null,
	fetchEvents: async () => {},
	addEvent: async () => null,
	updateEventById: async () => null,
	removeEvent: async () => false,
	getEventsByApplication: () => [],
});

interface EventProviderProps {
	children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
	const [events, setEvents] = useState<Events[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
	const [hasAttemptedFetch, setHasAttemptedFetch] = useState<boolean>(false);

	// Use a ref to track if a fetch is in progress to prevent multiple simultaneous requests
	const isFetchingRef = useRef<boolean>(false);

	const { isAuthenticated } = useAuth();

	// Fetch events from API - Fixed to properly fetch when needed
	const fetchEvents = useCallback(
		async (refresh = false) => {
			// Prevent duplicate fetches if one is already in progress
			if (isFetchingRef.current) {
				return;
			}

			// If we're not authenticated, don't try to fetch
			if (!isAuthenticated) {
				return;
			}

			// Always fetch if explicitly refreshing or if our events array is empty
			const shouldFetch = refresh || events.length === 0 || !lastUpdated;

			// Otherwise, check if our cache is still fresh (less than 5 minutes old)
			if (!shouldFetch && lastUpdated) {
				const fiveMinutesAgo = new Date();
				fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

				if (lastUpdated > fiveMinutesAgo) {
					// Our data is fresh enough, no need to fetch
					return;
				}
			}

			try {
				// Set the fetching flag to true to prevent duplicate requests
				isFetchingRef.current = true;
				setIsLoading(true);
				setError(null);

				const response = await getEvents();
				setEvents(response.results);
				setLastUpdated(new Date());
				setHasAttemptedFetch(true);
			} catch (err: any) {
				setError(err.message || "Failed to fetch events");
				// Don't show toast for initial load failures
				if (hasAttemptedFetch || refresh) {
					toast.error("Failed to load events");
				}
			} finally {
				setIsLoading(false);
				// Reset the fetching flag
				isFetchingRef.current = false;
			}
		},
		[isAuthenticated, events.length, lastUpdated] // Restore needed dependencies
	);

	// Add a new event
	const addEvent = useCallback(
		async (eventData: EventRequest): Promise<Events | null> => {
			if (!isAuthenticated) {
				toast.error("Authentication required to create events");
				return null;
			}

			try {
				const newEvent = await createEvent(eventData);

				// Update local state
				setEvents((prev) => [newEvent, ...prev]);
				setLastUpdated(new Date());
				toast.success("Event added successfully");
				return newEvent;
			} catch (err: any) {
				toast.error(err.message || "Failed to add event");
				return null;
			}
		},
		[isAuthenticated]
	);

	// Update an event
	const updateEventById = useCallback(
		async (id: number, eventData: Partial<Events>): Promise<Events | null> => {
			if (!isAuthenticated) {
				toast.error("Authentication required to update events");
				return null;
			}

			try {
				const updatedEvent = await updateEvent(id, eventData);

				// Update local state
				setEvents((prev) =>
					prev.map((event) => (event.id === id ? updatedEvent : event))
				);

				setLastUpdated(new Date());
				toast.success("Event updated successfully");
				return updatedEvent;
			} catch (err: any) {
				toast.error(err.message || "Failed to update event");
				return null;
			}
		},
		[isAuthenticated]
	);

	// Delete an event
	const removeEvent = useCallback(
		async (id: number): Promise<boolean> => {
			if (!isAuthenticated) {
				toast.error("Authentication required to delete events");
				return false;
			}

			try {
				await deleteEvent(id);

				// Update local state
				setEvents((prev) => prev.filter((event) => event.id !== id));
				setLastUpdated(new Date());
				toast.success("Event deleted successfully");
				return true;
			} catch (err: any) {
				toast.error(err.message || "Failed to delete event");
				return false;
			}
		},
		[isAuthenticated]
	);

	// Get events for a specific application
	const getEventsByApplication = useCallback(
		(applicationId: number): Events[] => {
			return events.filter(
				(event) => Number(event.application) === applicationId
			);
		},
		[events]
	);

	// Clear event data when user signs out
	useEffect(() => {
		const handleUserSignOut = (_event: CustomEvent) => {
			// Reset all event state
			setEvents([]);
			setError(null);
			setIsLoading(false);
			setLastUpdated(null);
			setHasAttemptedFetch(false);
		};

		// Listen for sign-out events
		window.addEventListener(
			"user_signed_out_event",
			handleUserSignOut as EventListener
		);
		window.addEventListener(
			"force_data_reset",
			handleUserSignOut as EventListener
		);

		return () => {
			window.removeEventListener(
				"user_signed_out_event",
				handleUserSignOut as EventListener
			);
			window.removeEventListener(
				"force_data_reset",
				handleUserSignOut as EventListener
			);
		};
	}, []);

	// Initial fetch when component mounts - Simplified to ensure we fetch when needed
	useEffect(() => {
		if (isAuthenticated && !isFetchingRef.current) {
			fetchEvents();
		}
	}, [isAuthenticated, fetchEvents]);

	const value: EventContextProps = {
		events,
		isLoading,
		error,
		fetchEvents,
		addEvent,
		updateEventById,
		removeEvent,
		getEventsByApplication,
	};

	return (
		<EventContext.Provider value={value}>{children}</EventContext.Provider>
	);
};

// Custom hook for using the event context
export const useEvents = () => useContext(EventContext);
