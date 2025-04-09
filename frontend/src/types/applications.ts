export interface Application {
	id: number;
	institution_name?: string;
	institution_country?: string;
	institution?: string;
	institution_details?: {
		id: string;
		rank: string;
		name: string;
		country: string;
		overall_score: string;
	};
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
	created_at?: string;
	updated_at?: string;
}

export interface ApplicationProps {
	data: Application[];
	onRefresh?: () => void;
}

export interface ApplicationCardProps {
	data: Application;
	onEdit?: (application: Application) => void;
	onDelete?: (id: number) => void;
	onRefresh?: () => void;
}

export interface ApplicationFilterParams {
	status?: string;
	degree_type?: string;
	institution?: string;
	search?: string;
	ordering?: string;
	page?: number;
}
