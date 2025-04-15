import { Institution, InstitutionDetail } from '../interfaces/institutions';

interface CacheEntry {
	data: Institution[];
	timestamp: number;
}

interface InstitutionCacheEntry {
	data: Institution | InstitutionDetail;
	timestamp: number;
}

const CACHE_KEY = "institutionsCache";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const institutionCache: Record<string, InstitutionCacheEntry> = {};
const INSTITUTION_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getInstitutionsCache = (): CacheEntry | null => {
	const cached = localStorage.getItem(CACHE_KEY);
	if (!cached) return null;

	const entry: CacheEntry = JSON.parse(cached);
	const now = Date.now();

	if (now - entry.timestamp > CACHE_DURATION) {
		localStorage.removeItem(CACHE_KEY);
		return null;
	}

	return entry;
};

export const setInstitutionsCache = (data: Institution[]): void => {
	const entry: CacheEntry = {
		data,
		timestamp: Date.now(),
	};
	localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
};

export const clearInstitutionsCache = (): void => {
	localStorage.removeItem(CACHE_KEY);
};

export const cacheInstitution = (institution: Institution | InstitutionDetail): void => {
	institutionCache[institution.id] = {
		data: institution,
		timestamp: Date.now()
	};
};

export const getCachedInstitution = (id: string): Institution | InstitutionDetail | null => {
	const cached = institutionCache[id];
	if (!cached) return null;
	
	if (Date.now() - cached.timestamp > INSTITUTION_CACHE_DURATION) {
		delete institutionCache[id];
		return null;
	}
	
	return cached.data;
};

export const clearInstitutionCache = (): void => {
	Object.keys(institutionCache).forEach(key => {
		delete institutionCache[key];
	});
};
