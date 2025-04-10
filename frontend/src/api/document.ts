import axios from "axios";
import { UploadDocumentRequest } from "../types/documents";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Upload the document to Supabase Storage
export const uploadDocumentFile = async (
    data: UploadDocumentRequest
): Promise<any> => {
	try {
        // Get the users authorization token
        const token = localStorage.getItem("accessToken");
		// Special headers for multipart/form-data
		const response = await axiosInstance.post<any>(
			"/documents/upload/",
			data,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data",
				},
			}
		);
		return response.data;
	} catch (error: any) {
		// Extract detailed error message if available
		let errorMessage = "Failed to upload document";

		if (error.response?.data?.error) {
			errorMessage = error.response.data.error;
		} else if (error.message) {
			errorMessage = error.message;
		}

		const enhancedError = new Error(errorMessage);
		throw enhancedError;
	}
};
