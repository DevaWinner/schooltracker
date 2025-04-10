import { Application } from "../types/applications";
import { getApplicationById } from "../api/applications";

/**
 * Loads a complete application by ID from the API
 */
export const loadApplicationById = async (id: string | number): Promise<Application | null> => {
  try {
    const appId = typeof id === 'string' ? id : id.toString();
    const data = await getApplicationById(appId);
    return data;
  } catch (error) {
    console.error(`Error loading application with ID ${id}:`, error);
    return null;
  }
};

/**
 * Ensures all application fields are present to avoid issues with undefined properties
 */
export const normalizeApplicationData = (
	app: Partial<Application>
): Application => {
	return {
		id: app.id || 0,
		institution: app.institution || "",
		institution_name: app.institution_name || "",
		institution_country: app.institution_country || "",
		institution_details: app.institution_details || null,
		program_name: app.program_name || "",
		degree_type: app.degree_type || "",
		department: app.department || "",
		duration_years: app.duration_years || "",
		tuition_fee: app.tuition_fee || "",
		application_link: app.application_link || "",
		scholarship_link: app.scholarship_link || "",
		program_info_link: app.program_info_link || "",
		status: app.status || "Draft",
		start_date: app.start_date || "",
		submitted_date: app.submitted_date || "",
		decision_date: app.decision_date || "",
		notes: app.notes || "",
		created_at: app.created_at || new Date().toISOString(),
		updated_at: app.updated_at || new Date().toISOString(),
		user: app.user || null,
	} as Application;
};

/**
 * Returns a minimal version of application for immediate display while loading
 */
export const getInitialApplicationData = (app: Application): Application => {
  // Clone only the essential properties for immediate display
  return {
    id: app.id,
    institution: app.institution || "",
    program_name: app.program_name || "",
    degree_type: app.degree_type || "",
    status: app.status || "Draft",
    created_at: app.created_at,
    updated_at: app.updated_at,
    // Add minimal required fields to avoid errors
    department: app.department || "",
    // We need to include this to satisfy TypeScript without modifying the Application type
    ...app
  } as Application;
};
