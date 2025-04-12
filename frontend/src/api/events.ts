import { EventResponse } from "../types/events";
import { authenticatedApi } from "../utils/apiUtils";


/**
 * Get all documents with optional filters
 */
export const getEvents = async (
): Promise<EventResponse> => {
    try {
        const response = await authenticatedApi.get<EventResponse>(
            "/documents/",
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
