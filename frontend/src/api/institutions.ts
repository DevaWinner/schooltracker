import axios from "axios";
import {
	InstitutionDetail,
	InstitutionFilters,
	PaginatedInstitutions,
} from "../types/institutions";

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "/api";

const institutionsApi = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

/**
 * Fetch a paginated list of institutions with optional filters
 */
export const getInstitutions = async (
	filters: InstitutionFilters = {}
): Promise<PaginatedInstitutions> => {
	try {
		// Create a clean params object
		const params: Record<string, any> = {};

		// Add only the defined parameters, exactly matching the API spec
		if (filters.search) params.search = filters.search;
		if (filters.country) params.country = filters.country; // This is the field we're ensuring is correct
		if (filters.rank_gte !== undefined) params.rank_gte = filters.rank_gte;
		if (filters.rank_lte !== undefined) params.rank_lte = filters.rank_lte;
		if (filters.research) params.research = filters.research;
		if (filters.size) params.size = filters.size;
		if (filters.focus) params.focus = filters.focus;
		if (filters.page) params.page = filters.page;
		if (filters.page_size) params.page_size = filters.page_size;
		if (filters.ordering) params.ordering = filters.ordering;

		console.log("API request with parameters:", params);

		const response = await institutionsApi.get<PaginatedInstitutions>(
			"/institutions/",
			{
				params,
			}
		);

		// Log the received data structure
		console.log("API response structure:", {
			count: response.data.count,
			next: response.data.next ? "present" : "null",
			previous: response.data.previous ? "present" : "null",
			resultsCount: response.data.results.length,
			// Log first result to see data structure
			firstResult:
				response.data.results.length > 0
					? {
							id: response.data.results[0].id,
							rank: response.data.results[0].rank,
							// Check if rank is a string as per API spec
							rankType: typeof response.data.results[0].rank,
					  }
					: "no results",
		});

		return response.data;
	} catch (error: any) {
		console.error("API Error:", error);
		const message =
			error.response?.data?.detail ||
			error.message ||
			"Failed to fetch institutions";
		throw new Error(message);
	}
};

/**
 * Get an institution by ID
 */
export const getInstitutionById = async (
	id: string
): Promise<InstitutionDetail> => {
	try {
		const response = await institutionsApi.get<InstitutionDetail>(
			`/institutions/${id}/`
		);
		return response.data;
	} catch (error: any) {
		const message =
			error.response?.data?.detail ||
			error.message ||
			"Failed to fetch institution details";
		throw new Error(message);
	}
};

/**
 * Get a list of unique countries from all institutions
 */
export const getCountries = async (): Promise<string[]> => {
	try {
		// Updated to match the API response format in the documentation
		const response = await institutionsApi.get<{ countries: string[] }>(
			"/institutions/countries/"
		);
		return response.data.countries || []; // Return the countries array from the response
	} catch (error: any) {
		console.error("Failed to fetch countries:", error);
		const message =
			error.response?.data?.detail ||
			error.message ||
			"Failed to fetch countries";
		throw new Error(message);
	}
};
