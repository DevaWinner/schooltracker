import React, {
	createContext,
	useState,
	useEffect,
	ReactNode,
	useCallback,
	useContext,
} from "react";
import { Application, ApplicationFilterParams } from "../types/applications";
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
	removeApplication: (
		id: number
	) => Promise<{ success: boolean; message: string }>;
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
	removeApplication: async () => ({ success: false, message: "" }),
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
	const [hasAttemptedFetch, setHasAttemptedFetch] = useState<boolean>(false);

	const { isAuthenticated } = useContext(AuthContext);

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

			// If we've already tried fetching and got empty results, don't fetch again
			// unless explicitly requested with refresh=true
			if (hasAttemptedFetch && applications.length === 0 && !refresh) {
				return;
			}

			if (!isAuthenticated) {
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

				// Mark that we've attempted a fetch, even if results are empty
				setHasAttemptedFetch(true);
			} catch (err: any) {
				setError(err.message || "Failed to fetch applications");
				toast.error("Failed to load applications");
			} finally {
				setIsLoading(false);
			}
		},
		[isAuthenticated, applications.length, lastUpdated, hasAttemptedFetch]
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
					(filters.status || filters.degree_type || filters.search) &&
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

					if (filters.search) {
						const searchTerm = filters.search.toLowerCase();
						filtered = filtered.filter((app) => {
							const institutionName = (
								app.institution_details?.name ||
								app.institution_name ||
								app.institution ||
								""
							).toLowerCase();
							const programName = (app.program_name || "").toLowerCase();

							return (
								institutionName.includes(searchTerm) ||
								programName.includes(searchTerm)
							);
						});
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
			if (!isAuthenticated) {
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
		[isAuthenticated, currentFilters.status]
	);

	// Update an existing application
	const updateApplicationItem = useCallback(
		async (id: number, applicationData: Partial<Application>) => {
			try {
				const updatedApplication = await updateApplication(id, applicationData);

				// Update the applications list
				setApplications((prevApps) =>
					prevApps.map((app) => (app.id === id ? updatedApplication : app))
				);

				// Also update the filtered list for immediate UI updates
				setFilteredApplications((prevApps) =>
					prevApps.map((app) => (app.id === id ? updatedApplication : app))
				);

				setLastUpdated(new Date());
				return updatedApplication;
			} catch (err: any) {
				return null;
			}
		},
		[]
	);

	// Remove an application
	const removeApplication = useCallback(
		async (id: number) => {
			if (!isAuthenticated) {
				return {
					success: false,
					message: "Authentication required to delete applications",
				};
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
				return {
					success: true,
					message: "Application deleted successfully",
				};
			} catch (err: any) {
				// Get the most specific error message available
				let errorMessage = err.message || "Failed to delete application";

				// Don't display toast here since we're showing the error in the modal
				return {
					success: false,
					message: errorMessage,
				};
			}
		},
		[isAuthenticated]
	);

	// Clear application data when user signs out
	useEffect(() => {
		const handleUserSignOut = (_event: CustomEvent) => {
			// Reset all application state
			setApplications([]);
			setFilteredApplications([]);
			setError(null);
			setIsLoading(false);
			setLastUpdated(null);
			setPagination({
				count: 0,
				next: null,
				previous: null,
			});
			setCurrentFilters({});
			setHasAttemptedFetch(false); // Reset the fetch attempt flag

			// Force data refresh on next load
			localStorage.removeItem("applicationData");
			sessionStorage.removeItem("applicationData");
		};

		// Listen for sign-out events using the more specific event name
		window.addEventListener(
			"user_signed_out_event",
			handleUserSignOut as EventListener
		);
		window.addEventListener(
			"force_data_reset",
			handleUserSignOut as EventListener
		);

		return () => {
			window.removeEventListener(
				"user_signed_out_event",
				handleUserSignOut as EventListener
			);
			window.removeEventListener(
				"force_data_reset",
				handleUserSignOut as EventListener
			);
		};
	}, []);

	// Initial fetch when component mounts if user is authenticated
	useEffect(() => {
		if (isAuthenticated && !hasAttemptedFetch) {
			fetchApplications();
		}
	}, [isAuthenticated, fetchApplications, hasAttemptedFetch]);

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
