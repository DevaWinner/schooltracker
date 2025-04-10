import axios from "axios";
import {
	Application,
	ApplicationFilterParams,
	ApplicationResponse,
} from "../types/applications";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const applicationsApi = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Add auth token to requests when available
applicationsApi.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("accessToken");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

/**
 * Get all applications with optional filters
 */
export const getApplications = async (
	params?: ApplicationFilterParams
): Promise<ApplicationResponse> => {
	try {
		const response = await applicationsApi.get<ApplicationResponse>(
			"/applications/",
			{
				params,
			}
		);
		return response.data;
	} catch (error: any) {
		console.error("Error fetching applications:", error);
		const message =
			error.response?.data?.detail ||
			error.message ||
			"Failed to fetch applications";
		throw new Error(message);
	}
};

/**
 * Get a single application by ID
 */
export const getApplicationById = async (
	id: string | number
): Promise<Application> => {
	try {
		const response = await applicationsApi.get<Application>(
			`/applications/${id}/`
		);
		return response.data;
	} catch (error: any) {
		console.error("Error fetching application details:", error);
		const message =
			error.response?.data?.detail ||
			error.message ||
			"Failed to fetch application details";
		throw new Error(message);
	}
};

/**
 * Create a new application
 */
export const createApplication = async (
	applicationData: Partial<Application>
): Promise<Application> => {
	try {
		const response = await applicationsApi.post<Application>(
			`/applications/create/`,
			applicationData
		);
		return response.data;
	} catch (error: any) {
		console.error("Error creating application:", error);
		const message =
			error.response?.data?.detail ||
			error.message ||
			"Failed to create application";
		throw new Error(message);
	}
};

/**
 * Update an application
 */
export const updateApplication = async (
	id: number,
	data: Partial<Application>
): Promise<Application> => {
	try {
		// Clone the data to avoid mutating the original object
		const formattedData = { ...data };

		// Ensure date fields are formatted correctly (YYYY-MM-DD)
		const dateFields = [
			"start_date",
			"submitted_date",
			"decision_date",
		] as const;
		dateFields.forEach((field) => {
			if (formattedData[field as keyof Application]) {
				try {
					const date = new Date(
						formattedData[field as keyof Application] as string
					);
					if (!isNaN(date.getTime())) {
						// Format as YYYY-MM-DD
						formattedData[field] = date.toISOString().split("T")[0];
					}
				} catch (error) {
					console.error(`Error formatting ${field}:`, error);
				}
			}
		});

		console.log("Sending formatted data to API:", formattedData);
		const response = await applicationsApi.patch<Application>(
			`/applications/${id}/`,
			formattedData
		);
		return response.data;
	} catch (error: any) {
		console.error("Error updating application:", error);
		const message =
			error.response?.data?.detail ||
			error.message ||
			"Failed to update application";
		throw new Error(message);
	}
};

/**
 * Delete an application
 */
export const deleteApplication = async (id: string | number): Promise<void> => {
	try {
		await applicationsApi.delete(`/applications/${id}/delete/`);
	} catch (error: any) {
		console.error("Error deleting application:", error);
		// Re-throw the error with the specific API error message if available
		if (error.response?.data?.error) {
			const apiError = new Error(error.response.data.error);
			// Attach the original response to the error for access to detailed info
			(apiError as any).originalResponse = error.response;
			throw apiError;
		}
		// Otherwise, throw a generic error
		const message =
			error.response?.data?.detail ||
			error.message ||
			"Failed to delete application";
		throw new Error(message);
	}
};
