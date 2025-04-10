export interface InstitutionDetails {
	id: string;
	rank: string;
	name: string;
	country: string;
	overall_score?: string;
}

export interface Application {
	id: number;
	user?: number;
	institution: string;
	institution_details?: InstitutionDetails;
	institution_name?: string;
	institution_country?: string;
	program_name: string;
	degree_type:
		| "Associate"
		| "Bachelor"
		| "Master"
		| "PhD"
		| "Certificate"
		| "Diploma"
		| "Other";
	department?: string;
	duration_years?: string;
	tuition_fee?: string;
	application_link?: string;
	scholarship_link?: string;
	program_info_link?: string;
	status:
		| "Draft"
		| "In Progress"
		| "Submitted"
		| "Interview"
		| "Accepted"
		| "Rejected";
	start_date?: string;
	submitted_date?: string;
	decision_date?: string;
	notes?: string;
	created_at: string;
	updated_at: string;
}

export interface ApplicationResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: Application[];
}

export interface ApplicationFilterParams {
	status?: string;
	degree_type?: string;
	institution?: string;
	search?: string;
	ordering?: string;
	page?: number;
}

export interface ApplicationProps {
	data: Application[];
	onRefresh?: () => void;
}
