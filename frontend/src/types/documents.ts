export interface ApplicationInfo {
	id: number;
	program_name: string;
	institution_name: string;
	degree_type?: string;
	status?: string;
}

export interface Document {
	id: number;
	document_type: DocumentType;
	file_name: string;
	file_url: string;
	uploaded_at: string;
	application_id?: number | string | null;
	application_info?: ApplicationInfo | null;
	user?: number;
}

export type DocumentType =
	| "Transcript"
	| "Essay"
	| "CV"
	| "Recommendation Letter"
	| "Other";

export const DOCUMENT_TYPES: DocumentType[] = [
	"Transcript",
	"Essay",
	"CV",
	"Recommendation Letter",
	"Other",
];

export interface DocumentResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: Document[];
}

export interface DocumentFilterParams {
	application?: number | string;
	document_type?: DocumentType;
	search?: string;
	ordering?: string;
	page?: number;
}

export interface DocumentUploadRequest {
	file: File;
	document_type: DocumentType;
	application?: number | null;
	file_name?: string;
}
