export interface InstitutionDetails {
	id: string;
	rank: string;
	name: string;
	country: string;
	overall_score?: string;
}

export interface Application {
	id: number;
	institution: string;
	institution_name?: string;
	institution_country?: string;
	institution_details?: InstitutionDetails | null;
	program_name: string;
	degree_type: string;
	department?: string;
	duration_years?: string | number;
	tuition_fee?: string | number;
	application_link?: string;
	scholarship_link?: string;
	program_info_link?: string;
	status: string;
	start_date?: string | null;
	submitted_date?: string | null;
	decision_date?: string | null;
	notes?: string;
	created_at: string;
	updated_at: string;
	user?: number;
	onRefresh?: () => void;
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
