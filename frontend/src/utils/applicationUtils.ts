import { Application } from "../interfaces/applications";
import { getApplicationById } from "../api/applications";

// Application cache to prevent redundant API calls
const applicationCache: Record<
	number,
	{ data: Application; timestamp: number }
> = {};

/**
 * Loads application data by ID, using cache when possible
 * @param id Application ID to fetch
 * @param forceRefresh Force a refresh from API even if cached data exists
 * @returns Application data
 */
export const loadApplicationById = async (
	id: number | string,
	forceRefresh = false
): Promise<Application | null> => {
	const numericId = Number(id);
	const now = Date.now();
	const cacheMaxAge = 5 * 60 * 1000; // 5 minutes

	try {
		// Always fetch if forcing refresh or no cache exists
		if (forceRefresh || !applicationCache[numericId]) {
			const application = await getApplicationById(numericId);
			applicationCache[numericId] = {
				data: application,
				timestamp: now,
			};
			return application;
		}

		// Check cache age
		const cacheAge = now - applicationCache[numericId].timestamp;
		if (cacheAge > cacheMaxAge) {
			// Cache is too old, fetch fresh data
			const application = await getApplicationById(numericId);
			applicationCache[numericId] = {
				data: application,
				timestamp: now,
			};
			return application;
		}

		// Use cached data
		return applicationCache[numericId].data;
	} catch (error) {
		console.error("Failed to load application:", error);
		// If cache exists, return it as fallback even if expired
		if (applicationCache[numericId]) {
			return applicationCache[numericId].data;
		}
		return null;
	}
};

/**
 * Adds or updates application in cache
 */
export const updateApplicationCache = (application: Application): void => {
	if (!application || !application.id) return;

	applicationCache[application.id] = {
		data: application,
		timestamp: Date.now(),
	};
};

/**
 * Clears application cache
 */
export const clearApplicationCache = (): void => {
	Object.keys(applicationCache).forEach((key) => {
		delete applicationCache[Number(key)];
	});
};

/**
 * Gets cached application if available
 */
export const getCachedApplication = (
	id: number | string
): Application | null => {
	const numericId = Number(id);
	if (applicationCache[numericId]) {
		return applicationCache[numericId].data;
	}
	return null;
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
	// Start with the full app and ensure essential properties are present
	return {
		...app,
		// Ensure these critical fields have default values if not present
		institution: app.institution || "",
		program_name: app.program_name || "",
		degree_type: app.degree_type || "",
		status: app.status || "Draft",
		department: app.department || "",
		created_at: app.created_at || new Date().toISOString(),
		updated_at: app.updated_at || new Date().toISOString(),
	} as Application;
};
