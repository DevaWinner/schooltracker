import React, {
	createContext,
	useState,
	useEffect,
	ReactNode,
	useCallback,
	useContext,
} from "react";
import {
	Application,
	ApplicationFilterParams,
	ApplicationResponse,
} from "../types/applications";
import {
	getApplications,
	createApplication,
	updateApplication,
	deleteApplication,
} from "../api/applications";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";

interface ApplicationContextProps {
	applications: Application[];
	filteredApplications: Application[];
	isLoading: boolean;
	error: string | null;
	pagination: {
		count: number;
		next: string | null;
		previous: string | null;
	};
	fetchApplications: (refresh?: boolean) => Promise<void>;
	filterApplications: (filters: ApplicationFilterParams) => Promise<void>;
	addApplication: (
		application: Partial<Application>
	) => Promise<Application | null>;
	updateApplicationItem: (
		id: number,
		application: Partial<Application>
	) => Promise<Application | null>;
	removeApplication: (id: number) => Promise<boolean>;
	lastUpdated: Date | null;
}

export const ApplicationContext = createContext<ApplicationContextProps>({
	applications: [],
	filteredApplications: [],
	isLoading: false,
	error: null,
	pagination: {
		count: 0,
		next: null,
		previous: null,
	},
	fetchApplications: async () => {},
	filterApplications: async () => {},
	addApplication: async () => null,
	updateApplicationItem: async () => null,
	removeApplication: async () => false,
	lastUpdated: null,
});

interface ApplicationProviderProps {
	children: ReactNode;
}

export const ApplicationProvider: React.FC<ApplicationProviderProps> = ({
	children,
}) => {
	const [applications, setApplications] = useState<Application[]>([]);
	const [filteredApplications, setFilteredApplications] = useState<
		Application[]
	>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [currentFilters, setCurrentFilters] = useState<ApplicationFilterParams>(
		{}
	);
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
	const [pagination, setPagination] = useState({
		count: 0,
		next: null as string | null,
		previous: null as string | null,
	});

	const { accessToken } = useContext(AuthContext);

	// Fetch applications from API
	const fetchApplications = useCallback(
		async (refresh = false) => {
			// If we already have applications and not explicitly refreshing, use cached data
			if (applications.length > 0 && !refresh && lastUpdated) {
				// Only refetch if data is older than 5 minutes
				const fiveMinutesAgo = new Date();
				fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

				if (lastUpdated > fiveMinutesAgo) {
					return;
				}
			}

			if (!accessToken) {
				return;
			}

			setIsLoading(true);
			setError(null);

			try {
				const response = await getApplications();
				setApplications(response.results);
				setFilteredApplications(response.results);
				setPagination({
					count: response.count,
					next: response.next,
					previous: response.previous,
				});
				setLastUpdated(new Date());
			} catch (err: any) {
				setError(err.message || "Failed to fetch applications");
				toast.error("Failed to load applications");
			} finally {
				setIsLoading(false);
			}
		},
		[accessToken, applications.length, lastUpdated]
	);

	// Filter applications based on provided filters
	const filterApplications = useCallback(
		async (filters: ApplicationFilterParams) => {
			setIsLoading(true);
			setCurrentFilters(filters);

			try {
				// If we have basic filters that can be applied client-side, do it
				if (Object.keys(filters).length === 0) {
					setFilteredApplications(applications);
				} else if (
					(filters.status || filters.degree_type) &&
					!filters.search &&
					!filters.ordering
				) {
					// Simple filtering we can do client-side
					let filtered = [...applications];

					if (filters.status) {
						filtered = filtered.filter((app) => app.status === filters.status);
					}

					if (filters.degree_type) {
						filtered = filtered.filter(
							(app) => app.degree_type === filters.degree_type
						);
					}

					setFilteredApplications(filtered);
				} else {
					// More complex filtering, use the API
					const response = await getApplications(filters);
					setFilteredApplications(response.results);
					setPagination({
						count: response.count,
						next: response.next,
						previous: response.previous,
					});
				}
			} catch (err: any) {
				setError(err.message || "Failed to filter applications");
				toast.error("Failed to filter applications");
				// Fall back to unfiltered data
				setFilteredApplications(applications);
			} finally {
				setIsLoading(false);
			}
		},
		[applications]
	);

	// Add a new application
	const addApplication = useCallback(
		async (applicationData: Partial<Application>) => {
			if (!accessToken) {
				toast.error("Authentication required to add applications");
				return null;
			}

			try {
				const newApplication = await createApplication(applicationData);

				// Update local state
				setApplications((prev) => [newApplication, ...prev]);
				setFilteredApplications((prev) => {
					// Check if the new application matches current filters
					const shouldInclude =
						!currentFilters.status ||
						currentFilters.status === newApplication.status;

					return shouldInclude ? [newApplication, ...prev] : prev;
				});

				setPagination((prev) => ({
					...prev,
					count: prev.count + 1,
				}));

				setLastUpdated(new Date());
				toast.success("Application created successfully");
				return newApplication;
			} catch (err: any) {
				toast.error("Failed to create application");
				return null;
			}
		},
		[accessToken, currentFilters.status]
	);

	// Update an existing application
	const updateApplicationItem = useCallback(
		async (id: number, applicationData: Partial<Application>) => {
			if (!accessToken) {
				toast.error("Authentication required to update applications");
				return null;
			}

			try {
				const updatedApplication = await updateApplication(id, applicationData);

				// Update both arrays
				const updateState = (apps: Application[]) =>
					apps.map((app) => (app.id === id ? updatedApplication : app));

				setApplications(updateState);
				setFilteredApplications((prev) => {
					// Check if updated app still matches filters
					if (
						currentFilters.status &&
						updatedApplication.status !== currentFilters.status
					) {
						// No longer matches filter, remove it
						return prev.filter((app) => app.id !== id);
					}
					return updateState(prev);
				});

				setLastUpdated(new Date());
				toast.success("Application updated successfully");
				return updatedApplication;
			} catch (err: any) {
				toast.error("Failed to update application");
				return null;
			}
		},
		[accessToken, currentFilters.status]
	);

	// Remove an application
	const removeApplication = useCallback(
		async (id: number) => {
			if (!accessToken) {
				toast.error("Authentication required to delete applications");
				return false;
			}

			try {
				await deleteApplication(id);

				// Update local state
				setApplications((prev) => prev.filter((app) => app.id !== id));
				setFilteredApplications((prev) => prev.filter((app) => app.id !== id));

				setPagination((prev) => ({
					...prev,
					count: prev.count - 1,
				}));

				setLastUpdated(new Date());
				toast.success("Application deleted successfully");
				return true;
			} catch (err: any) {
				toast.error("Failed to delete application");
				return false;
			}
		},
		[accessToken]
	);

	// Initial fetch when component mounts if user is authenticated
	useEffect(() => {
		if (accessToken) {
			fetchApplications();
		}
	}, [accessToken, fetchApplications]);

	const value = {
		applications,
		filteredApplications,
		isLoading,
		error,
		pagination,
		fetchApplications,
		filterApplications,
		addApplication,
		updateApplicationItem,
		removeApplication,
		lastUpdated,
	};

	return (
		<ApplicationContext.Provider value={value}>
			{children}
		</ApplicationContext.Provider>
	);
};

// Custom hook for using the application context
export const useApplications = () => useContext(ApplicationContext);
