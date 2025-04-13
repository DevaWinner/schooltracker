import { EventRequest, EventResponse, Events } from "../types/events";
import { authenticatedApi } from "../utils/apiUtils";


/**
 * Get all events
 */
export const getEvents = async (
): Promise<EventResponse> => {
    try {
        const response = await authenticatedApi.get<EventResponse>(
            "/events/",
        );
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.detail ||
            error.message ||
            "Failed to fetch events";
        throw new Error(message);
    }
};

/**
 * Get a single event by ID
 */
export const getEventById = async (
    id: string | number
): Promise<Events> => {
    try {
        const response = await authenticatedApi.get<Events>(
            `/events/${id}/`
        );
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
 * Create a new event
 */
export const createEvent = async (
    eventData: EventRequest
): Promise<Events> => {
    try {
        const formattedData = eventData;
        console.log(formattedData)
        const testData: EventRequest = {
            application: 7,
            event_title: "ABSU Admission Exam",
            event_color: "warning",
            event_date: "2025-05-22",
            notes: "These are my notes"
        }
        const response = await authenticatedApi.post<Events>(
            `/events/create/`,
            formattedData
        );
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.detail ||
            error.message ||
            "Failed to create event";
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
        // Clone the data to avoid mutating the original object
        const formattedData = { ...data };

        const response = await authenticatedApi.patch<Events>(
            `/events/${id}/`,
            formattedData
        );
        return response.data;
    } catch (error: any) {
        // Enhanced error logging with full details
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (error.response.data) {
                // If there are field-specific validation errors
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

                // If there's a general error message
                if (error.response.data.detail) {
                    throw new Error(error.response.data.detail);
                }

                // If there's an error object
                if (error.response.data.error) {
                    throw new Error(error.response.data.error);
                }
            }

            throw new Error(
                `Request failed with status code ${error.response.status}`
            );
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error(
                "No response received from server. Please check your network connection."
            );
        } else {
            // Something happened in setting up the request
            throw new Error(error.message || "Failed to update event");
        }
    }
};

/**
 * Delete an event
 */
export const deleteEvent = async (id: string | number): Promise<void> => {
    try {
        await authenticatedApi.delete(`/events/${id}/delete/`);
    } catch (error: any) {
        if (error.response?.data?.error) {
            const apiError = new Error(error.response.data.error);
            (apiError as any).originalResponse = error.response;
            throw apiError;
        }
        const message =
            error.response?.data?.detail ||
            error.message ||
            "Failed to delete event";
        throw new Error(message);
    }
};

