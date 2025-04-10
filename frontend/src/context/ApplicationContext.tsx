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
	loading: boolean;
	error: string | null;
	pagination: {
		count: number;
		next: string | null;
		previous: string | null;
	};
	fetchApplications: (params?: ApplicationFilterParams) => Promise<void>;
	addApplication: (
		application: Partial<Application>
	) => Promise<Application | null>;
	updateApplication: (
		id: number,
		application: Partial<Application>
	) => Promise<Application | null>;
	removeApplication: (id: number) => Promise<boolean>;
}

export const ApplicationContext = createContext<ApplicationContextProps>({
	applications: [],
	loading: false,
	error: null,
	pagination: {
		count: 0,
		next: null,
		previous: null,
	},
	fetchApplications: async () => {},
	addApplication: async () => null,
	updateApplication: async () => null,
	removeApplication: async () => false,
});

interface ApplicationProviderProps {
	children: ReactNode;
}

export const ApplicationProvider: React.FC<ApplicationProviderProps> = ({
	children,
}) => {
	const [applications, setApplications] = useState<Application[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [pagination, setPagination] = useState({
		count: 0,
		next: null as string | null,
		previous: null as string | null,
	});

	const { accessToken } = useContext(AuthContext);

	const fetchApplications = useCallback(
		async (params?: ApplicationFilterParams) => {
			if (!accessToken) {
				return;
			}

			setLoading(true);
			setError(null);

			try {
				const response = await getApplications(params);
				setApplications(response.results);
				setPagination({
					count: response.count,
					next: response.next,
					previous: response.previous,
				});
			} catch (err: any) {
				setError(err.message || "Failed to fetch applications");
				toast.error("Failed to load applications");
			} finally {
				setLoading(false);
			}
		},
		[accessToken]
	);

	const addApplication = useCallback(
		async (applicationData: Partial<Application>) => {
			if (!accessToken) {
				toast.error("Authentication required to add applications");
				return null;
			}

			try {
				const newApplication = await createApplication(applicationData);

				// Update local state
				setApplications((prev) => [...prev, newApplication]);
				setPagination((prev) => ({
					...prev,
					count: prev.count + 1,
				}));

				toast.success("Application created successfully");
				return newApplication;
			} catch (err: any) {
				toast.error("Failed to create application");
				return null;
			}
		},
		[accessToken]
	);

	const updateApplicationItem = useCallback(
		async (id: number, applicationData: Partial<Application>) => {
			if (!accessToken) {
				toast.error("Authentication required to update applications");
				return null;
			}

			try {
				const updatedApplication = await updateApplication(id, applicationData);

				// Update local state
				setApplications((prev) =>
					prev.map((app) => (app.id === id ? updatedApplication : app))
				);

				toast.success("Application updated successfully");
				return updatedApplication;
			} catch (err: any) {
				toast.error("Failed to update application");
				return null;
			}
		},
		[accessToken]
	);

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
				setPagination((prev) => ({
					...prev,
					count: prev.count - 1,
				}));

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
		loading,
		error,
		pagination,
		fetchApplications,
		addApplication,
		updateApplication: updateApplicationItem,
		removeApplication,
	};

	return (
		<ApplicationContext.Provider value={value}>
			{children}
		</ApplicationContext.Provider>
	);
};

// Custom hook for using the application context
export const useApplications = () => useContext(ApplicationContext);
