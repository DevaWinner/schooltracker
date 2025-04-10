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
		console.log("API request with filters:", filters); // Add logging to debug
		const response = await institutionsApi.get<PaginatedInstitutions>(
			"/institutions/",
			{
				params: filters,
			}
		);
		return response.data;
	} catch (error: any) {
		const message =
			error.response?.data?.detail ||
			error.message ||
			"Failed to fetch institutions";
		throw new Error(message);
	}
};

/**
 * Fetch detailed information for a specific institution by ID
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
 * Get a list of all available countries for filtering
 * (This is a convenience function that may require backend support or local caching)
 */
export const getCountries = async (): Promise<string[]> => {
	try {
		// If the backend provides a countries endpoint, use that instead
		const response = await institutionsApi.get<PaginatedInstitutions>(
			"/institutions/",
			{
				params: { page_size: 1000 }, // Get a large batch to extract countries
			}
		);

		// Extract unique countries from results
		const countries = response.data.results
			.map((institution) => institution.country)
			.filter((value, index, self) => self.indexOf(value) === index)
			.sort();

		return countries;
	} catch (error) {
		console.error("Failed to fetch countries:", error);
		return [];
	}
};
