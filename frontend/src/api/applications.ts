import {
	Application,
	ApplicationFilterParams,
	ApplicationResponse,
} from "../interfaces/applications";
import { authenticatedApi } from "../utils/apiUtils";

/**
 * Get all applications with optional filters
 */
export const getApplications = async (
	params?: ApplicationFilterParams
): Promise<ApplicationResponse> => {
	try {
		const response = await authenticatedApi.get<ApplicationResponse>(
			"/applications/",
			{
				params,
			}
		);
		return response.data;
	} catch (error: any) {
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
		const response = await authenticatedApi.get<Application>(
			`/applications/${id}/`
		);
		return response.data;
	} catch (error: any) {
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
		// Clone the data to avoid mutating the original object
		const formattedData = { ...applicationData };

		// Ensure we're sending the institution ID in the institution field
		// This is what the API expects according to the ERD
		if (formattedData.institution_id && !formattedData.institution) {
			formattedData.institution = formattedData.institution_id;
		}

		// Always remove the ID field to avoid conflicts with database
		if ("id" in formattedData) {
			delete formattedData.id;
		}

		// Remove any fields the API doesn't expect
		const apiExpectedFields = [
			"institution",
			"program_name",
			"degree_type",
			"department",
			"duration_years",
			"tuition_fee",
			"application_link",
			"scholarship_link",
			"program_info_link",
			"status",
			"start_date",
			"submitted_date",
			"decision_date",
			"notes",
		];

		// Filter to only include fields the API expects
		const cleanedData = Object.keys(formattedData)
			.filter((key) => apiExpectedFields.includes(key))
			.reduce((obj, key) => {
				obj[key] = formattedData[key as keyof typeof formattedData];
				return obj;
			}, {} as Record<string, any>);

		const response = await authenticatedApi.post<Application>(
			`/applications/create/`,
			cleanedData
		);
		return response.data;
	} catch (error: any) {
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

		// Ensure date fields are formatted correctly (YYYY-MM-DD) or set to null if empty
		const dateFields = [
			"start_date",
			"submitted_date",
			"decision_date",
		] as const;
		dateFields.forEach((field) => {
			const value = formattedData[field as keyof Application];

			// If value is empty string or undefined, explicitly set to null
			if (value === "" || value === undefined) {
				formattedData[field] = null;
			} else if (value) {
				// Only format if we have a value
				try {
					const date = new Date(value as string);
					if (!isNaN(date.getTime())) {
						// Format as YYYY-MM-DD
						formattedData[field] = date.toISOString().split("T")[0];
					}
				} catch (error) {
					// If any parsing error, set to null
					formattedData[field] = null;
				}
			}
		});

		const response = await authenticatedApi.patch<Application>(
			`/applications/${id}/`,
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
			throw new Error(error.message || "Failed to update application");
		}
	}
};

/**
 * Delete an application
 */
export const deleteApplication = async (id: string | number): Promise<void> => {
	try {
		await authenticatedApi.delete(`/applications/${id}/delete/`);
	} catch (error: any) {
		if (error.response?.data?.error) {
			const apiError = new Error(error.response.data.error);
			(apiError as any).originalResponse = error.response;
			throw apiError;
		}
		const message =
			error.response?.data?.detail ||
			error.message ||
			"Failed to delete application";
		throw new Error(message);
	}
};
