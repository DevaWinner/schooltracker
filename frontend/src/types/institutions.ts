export interface Institution {
	id: string;
	rank: string;
	name: string;
	country: string;
	overall_score: string;
}

export interface Classification {
	id: string;
	size: "Extra Large" | "Large" | "Medium" | "Small";
	focus: "Full Comprehensive" | "Comprehensive" | "Focused" | "Specialist";
	research: "Very High" | "High" | "Medium" | "Low";
}

export interface MetricData {
	id: string;
	score: string;
	rank: string;
}

export interface InstitutionDetail extends Institution {
	web_links: string;
	classification?: Classification;
	academic_reputation?: MetricData;
	employer_reputation?: MetricData;
	faculty_student?: MetricData;
	citations_per_faculty?: MetricData;
	international_faculty?: MetricData;
	international_students?: MetricData;
	international_research_network?: MetricData;
	employment_outcomes?: MetricData;
	sustainability?: MetricData;
}

export interface PaginatedInstitutions {
	count: number;
	next: string | null;
	previous: string | null;
	results: Institution[];
}

export interface InstitutionFilters {
	search?: string;
	country?: string;
	rank_lte?: number | string;
	rank_gte?: number | string;
	research?: string;
	size?: string;
	focus?: string;
	page?: number;
	page_size?: number;
	ordering?: string;
}
