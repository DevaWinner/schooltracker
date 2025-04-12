import { authenticatedApi } from "../utils/apiUtils";
import {
	Document,
	DocumentFilterParams,
	DocumentResponse,
	DocumentUploadRequest,
} from "../types/documents";

/**
 * Get all documents with optional filters
 */
export const getDocuments = async (
	params?: DocumentFilterParams
): Promise<DocumentResponse> => {
	try {
		const response = await authenticatedApi.get<DocumentResponse>(
			"/documents/",
			{
				params,
			}
		);
		return response.data;
	} catch (error: any) {
		const message =
			error.response?.data?.detail ||
			error.message ||
			"Failed to fetch documents";
		throw new Error(message);
	}
};

/**
 * Get a document by ID
 */
export const getDocumentById = async (
	id: string | number
): Promise<Document> => {
	try {
		const response = await authenticatedApi.get<Document>(`/documents/${id}/`);
		return response.data;
	} catch (error: any) {
		const message =
			error.response?.data?.detail ||
			error.message ||
			"Failed to fetch document details";
		throw new Error(message);
	}
};

/**
 * Upload a new document
 */
export const uploadDocument = async (
	data: DocumentUploadRequest
): Promise<Document> => {
	try {
		// Create form data for multipart/form-data request
		const formData = new FormData();
		formData.append("file", data.file);
		formData.append("document_type", data.document_type);

		if (data.application) {
			formData.append("application", String(data.application));
		}

		if (data.file_name) {
			formData.append("file_name", data.file_name);
		}

		const response = await authenticatedApi.post<Document>(
			"/documents/upload/",
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);

		return response.data;
	} catch (error: any) {
		let message = "Failed to upload document";

		if (error.response?.status === 413) {
			message = "File size exceeds maximum allowed (50 MB)";
		} else if (error.response?.data?.error) {
			message = error.response.data.error;
		} else if (error.response?.data?.detail) {
			message = error.response.data.detail;
		}

		throw new Error(message);
	}
};

/**
 * Delete a document
 */
export const deleteDocument = async (id: string | number): Promise<void> => {
	try {
		await authenticatedApi.delete(`/documents/${id}/delete/`);
	} catch (error: any) {
		const message =
			error.response?.data?.detail ||
			error.message ||
			"Failed to delete document";
		throw new Error(message);
	}
};
