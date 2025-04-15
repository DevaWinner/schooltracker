import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	useRef,
	useEffect,
} from "react";
import {
	Institution,
	InstitutionFilters,
} from "../interfaces/institutions";
import { getInstitutions, getCountries, getInstitutionById } from "../api/institutions";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";
import { cacheInstitution, getCachedInstitution, clearInstitutionCache } from "../utils/institutionCache";

interface InstitutionContextProps {
	institutions: Institution[];
	filteredInstitutions: Institution[];
	countries: string[];
	isLoading: boolean;
	totalCount: number;
	error: string | null;
	fetchInstitutions: (filters?: InstitutionFilters) => Promise<void>;
	fetchCountries: () => Promise<void>;
	fetchInstitutionDetail: (id: string) => Promise<Institution | null>;
}

const InstitutionContext = createContext<InstitutionContextProps>({
	institutions: [],
	filteredInstitutions: [],
	countries: [],
	isLoading: false,
	totalCount: 0,
	error: null,
	fetchInstitutions: async () => {},
	fetchCountries: async () => {},
	fetchInstitutionDetail: async () => null,
});

export const InstitutionProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [institutions, setInstitutions] = useState<Institution[]>([]);
	const [filteredInstitutions, setFilteredInstitutions] = useState<
		Institution[]
	>([]);
	const [countries, setCountries] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [totalCount, setTotalCount] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const isFetchingRef = useRef(false);
	const { isAuthenticated } = useAuth();

	// Load countries from cache
	const loadCountriesFromCache = useCallback(() => {
		const cached = localStorage.getItem("institutionCountries");
		if (cached) {
			try {
				const { data, timestamp } = JSON.parse(cached);
				if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
					return data;
				}
			} catch (error) {
				console.error("Error parsing cached countries:", error);
			}
		}
		return null;
	}, []);

	// Save countries to cache
	const saveCountriesToCache = useCallback((data: string[]) => {
		try {
			localStorage.setItem(
				"institutionCountries",
				JSON.stringify({
					data,
					timestamp: Date.now(),
				})
			);
		} catch (error) {
			console.error("Error caching countries:", error);
		}
	}, []);

	const fetchCountries = useCallback(async () => {
		if (!isAuthenticated) return;

		const cachedCountries = loadCountriesFromCache();
		if (cachedCountries) {
			setCountries(cachedCountries);
			return;
		}

		try {
			const countryList = await getCountries();
			setCountries(countryList);
			saveCountriesToCache(countryList);
		} catch (error) {
			console.error("Failed to fetch countries:", error);
			setCountries([]);
		}
	}, [isAuthenticated, loadCountriesFromCache, saveCountriesToCache]);

	const fetchInstitutions = useCallback(
		async (filters?: InstitutionFilters) => {
			if (!isAuthenticated || isFetchingRef.current) return;

			try {
				isFetchingRef.current = true;
				setIsLoading(true);
				setError(null);

				const response = await getInstitutions(filters);
				setInstitutions(response.results);
				setFilteredInstitutions(response.results);
				setTotalCount(response.count);
			} catch (error: any) {
				setError(error.message || "Failed to fetch institutions");
				toast.error("Failed to load institutions");
			} finally {
				setIsLoading(false);
				isFetchingRef.current = false;
			}
		},
		[isAuthenticated]
	);

	// Add method to fetch institution detail
	const fetchInstitutionDetail = useCallback(async (id: string) => {
		if (!isAuthenticated) return null;

		// Check cache first
		const cached = getCachedInstitution(id);
		if (cached) return cached;

		try {
			const data = await getInstitutionById(id);
			cacheInstitution(data);
			return data;
		} catch (error) {
			throw error;
		}
	}, [isAuthenticated]);

	// Add clear cache on sign out
	useEffect(() => {
		const handleSignOut = () => {
			clearInstitutionCache();
		};

		window.addEventListener('user_signed_out_event', handleSignOut);
		return () => window.removeEventListener('user_signed_out_event', handleSignOut);
	}, []);

	useEffect(() => {
		if (isAuthenticated) {
			fetchCountries();
		}
	}, [isAuthenticated, fetchCountries]);

	return (
		<InstitutionContext.Provider
			value={{
				institutions,
				filteredInstitutions,
				countries,
				isLoading,
				totalCount,
				error,
				fetchInstitutions,
				fetchCountries,
				fetchInstitutionDetail,
			}}
		>
			{children}
		</InstitutionContext.Provider>
	);
};

export const useInstitutions = () => useContext(InstitutionContext);
