import { authenticatedApi } from "../utils/apiUtils";
import {
	InstitutionDetail,
	InstitutionFilters,
	PaginatedInstitutions,
} from "../types/institutions";

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
		if (filters.country) params.country = filters.country;
		if (filters.rank_gte !== undefined) params.rank_gte = filters.rank_gte;
		if (filters.rank_lte !== undefined) params.rank_lte = filters.rank_lte;
		if (filters.research) params.research = filters.research;
		if (filters.size) params.size = filters.size;
		if (filters.focus) params.focus = filters.focus;
		if (filters.page) params.page = filters.page;
		if (filters.page_size) params.page_size = filters.page_size;
		if (filters.ordering) params.ordering = filters.ordering;

		const response = await authenticatedApi.get<PaginatedInstitutions>(
			"/institutions/",
			{
				params,
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
 * Get an institution by ID
 */
export const getInstitutionById = async (
	id: string
): Promise<InstitutionDetail> => {
	try {
		const response = await authenticatedApi.get<InstitutionDetail>(
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
		const response = await authenticatedApi.get<{ countries: string[] }>(
			"/institutions/countries/"
		);
		return response.data.countries || []; // Return the countries array from the response
	} catch (error: any) {
		const message =
			error.response?.data?.detail ||
			error.message ||
			"Failed to fetch countries";
		throw new Error(message);
	}
};

/**
 * Get a simplified list of institutions for dropdown selection
 */
export const getInstitutionsForSelect = async (): Promise<
	{ id: string; name: string; country: string }[]
> => {
	try {
		const response = await authenticatedApi.get<PaginatedInstitutions>(
			"/institutions/",
			{
				params: {
					page_size: 500, // Get a larger number for dropdown
					fields: "id,name,country", // Request only the fields we need
				},
			}
		);

		// Transform the response to the format we need for the dropdown
		return response.data.results.map((inst) => ({
			id: inst.id,
			name: inst.name,
			country: inst.country,
		}));
	} catch (error: any) {
		const message =
			error.response?.data?.detail ||
			error.message ||
			"Failed to fetch institutions list";
		throw new Error(message);
	}
};
