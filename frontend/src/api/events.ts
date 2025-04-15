import { EventRequest, EventResponse, Events } from "../interfaces/events";
import { authenticatedApi } from "../utils/apiUtils";

/**
 * Get all events
 */
export const getEvents = async (): Promise<EventResponse> => {
	try {
		const response = await authenticatedApi.get<EventResponse>("/events/");
		return response.data;
	} catch (error: any) {
		const message =
			error.response?.data?.detail || error.message || "Failed to fetch events";
		throw new Error(message);
	}
};

/**
 * Get a single event by ID
 */
export const getEventById = async (id: string | number): Promise<Events> => {
	try {
		const response = await authenticatedApi.get<Events>(`/events/${id}/`);
		return response.data;
	} catch (error: any) {
		const message =
			error.response?.data?.detail ||
			error.message ||
			"Failed to fetch event details";
		throw new Error(message);
	}
};

/**
 * Get all events for a specific application
 */
export const getEventsByApplication = async (
	applicationId: string | number
): Promise<Events[]> => {
	try {
		const response = await authenticatedApi.get<Events[]>(
			`/events/applications/${applicationId}/`
		);
		return response.data;
	} catch (error: any) {
		const message =
			error.response?.data?.detail ||
			error.message ||
			"Failed to fetch application events";
		throw new Error(message);
	}
};

/**
 * Create a new event
 */
export const createEvent = async (eventData: EventRequest): Promise<Events> => {
	try {
		const response = await authenticatedApi.post<Events>(
			`/events/create/`,
			eventData
		);
		return response.data;
	} catch (error: any) {
		const message =
			error.response?.data?.detail || error.message || "Failed to create event";
		throw new Error(message);
	}
};

/**
 * Update an event
 */
export const updateEvent = async (
	id: number,
	data: Partial<Events>
): Promise<Events> => {
	try {
		const response = await authenticatedApi.patch<Events>(
			`/events/${id}/`,
			data
		);
		return response.data;
	} catch (error: any) {
		// Enhanced error handling
		if (error.response?.data) {
			if (
				typeof error.response.data === "object" &&
				Object.keys(error.response.data).length > 0
			) {
				const fieldErrors = Object.entries(error.response.data)
					.map(
						([field, messages]) =>
							`${field}: ${
								Array.isArray(messages) ? messages.join(", ") : messages
							}`
					)
					.join("; ");

				if (fieldErrors) {
					throw new Error(`Validation error: ${fieldErrors}`);
				}
			}

			if (error.response.data.detail) {
				throw new Error(error.response.data.detail);
			}
		}
		throw new Error(error.message || "Failed to update event");
	}
};

/**
 * Full update of an event (PUT)
 */
export const fullyUpdateEvent = async (
	id: number,
	data: EventRequest
): Promise<Events> => {
	try {
		const response = await authenticatedApi.put<Events>(
			`/events/${id}/update/`,
			data
		);
		return response.data;
	} catch (error: any) {
		const message =
			error.response?.data?.detail || error.message || "Failed to update event";
		throw new Error(message);
	}
};

/**
 * Delete an event
 */
export const deleteEvent = async (id: string | number): Promise<void> => {
	try {
		await authenticatedApi.delete(`/events/${id}/delete/`);
	} catch (error: any) {
		const message =
			error.response?.data?.detail || error.message || "Failed to delete event";
		throw new Error(message);
	}
};
