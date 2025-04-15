import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	ReactNode,
	useEffect,
} from "react";
import {
	Document,
	DocumentFilterParams,
	DocumentType,
	DocumentUploadRequest,
} from "../interfaces/documents";
import { getDocuments, uploadDocument, deleteDocument } from "../api/documents";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

interface DocumentContextProps {
	documents: Document[];
	filteredDocuments: Document[];
	documentsByType: Record<DocumentType | "All", Document[]>;
	isLoading: boolean;
	error: string | null;
	fetchDocuments: (refresh?: boolean) => Promise<void>;
	filterDocuments: (filters: DocumentFilterParams) => Promise<void>;
	uploadNewDocument: (data: DocumentUploadRequest) => Promise<Document | null>;
	removeDocument: (id: number) => Promise<boolean>;
	getDocumentsByApplication: (applicationId: number) => Document[];
}

const DocumentContext = createContext<DocumentContextProps>({
	documents: [],
	filteredDocuments: [],
	documentsByType: {
		All: [],
		Transcript: [],
		Essay: [],
		CV: [],
		"Recommendation Letter": [],
		Other: [],
	},
	isLoading: false,
	error: null,
	fetchDocuments: async () => {},
	filterDocuments: async () => {},
	uploadNewDocument: async () => null,
	removeDocument: async () => false,
	getDocumentsByApplication: () => [],
});

interface DocumentProviderProps {
	children: ReactNode;
}

export const DocumentProvider: React.FC<DocumentProviderProps> = ({
	children,
}) => {
	const [documents, setDocuments] = useState<Document[]>([]);
	const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
	const [documentsByType, setDocumentsByType] = useState<
		Record<DocumentType | "All", Document[]>
	>({
		All: [],
		Transcript: [],
		Essay: [],
		CV: [],
		"Recommendation Letter": [],
		Other: [],
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
	const [, setCurrentFilters] = useState<DocumentFilterParams>({});
	const [hasAttemptedFetch, setHasAttemptedFetch] = useState<boolean>(false);

	const { isAuthenticated } = useAuth();

	// Organize documents by type
	const organizeDocumentsByType = useCallback((docs: Document[]) => {
		const byType: Record<DocumentType | "All", Document[]> = {
			All: docs,
			Transcript: [],
			Essay: [],
			CV: [],
			"Recommendation Letter": [],
			Other: [],
		};

		docs.forEach((doc) => {
			if (doc.document_type in byType) {
				byType[doc.document_type].push(doc);
			}
		});

		setDocumentsByType(byType);
	}, []);

	// Fetch documents from API
	const fetchDocuments = useCallback(
		async (refresh = false) => {
			// If we already have documents and not explicitly refreshing, use cached data
			if (!refresh && lastUpdated) {
				// Only refetch if data is older than 5 minutes
				const fiveMinutesAgo = new Date();
				fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

				if (lastUpdated > fiveMinutesAgo) {
					return;
				}
			}

			// If we've already tried fetching and got empty results, don't fetch again
			// unless explicitly requested with refresh=true
			if (hasAttemptedFetch && documents.length === 0 && !refresh) {
				return;
			}

			if (!isAuthenticated) {
				return;
			}

			// Prevent duplicate fetches
			if (isLoading) {
				return;
			}

			setIsLoading(true);
			setError(null);

			try {
				const response = await getDocuments();
				setDocuments(response.results);
				setFilteredDocuments(response.results);
				organizeDocumentsByType(response.results);
				setLastUpdated(new Date());

				// Mark that we've attempted a fetch, even if results are empty
				setHasAttemptedFetch(true);
			} catch (err: any) {
				setError(err.message || "Failed to fetch documents");
				toast.error("Failed to load documents");
			} finally {
				setIsLoading(false);
			}
		},
		[
			isAuthenticated,
			lastUpdated,
			organizeDocumentsByType,
			isLoading,
			hasAttemptedFetch,
			documents.length,
		]
	);

	// Filter documents based on provided filters
	const filterDocuments = useCallback(
		async (filters: DocumentFilterParams) => {
			setIsLoading(true);
			setCurrentFilters(filters);

			try {
				let filtered = [...documents];

				// Apply search filter
				if (filters.search) {
					const searchTerm = filters.search.toLowerCase();
					filtered = filtered.filter((doc) =>
						doc.file_name.toLowerCase().includes(searchTerm)
					);
				}

				// Apply document type filter
				if (filters.document_type) {
					filtered = filtered.filter(
						(doc) => doc.document_type === filters.document_type
					);
				}

				// Apply application filter
				if (filters.application) {
					filtered = filtered.filter(
						(doc) => String(doc.application_id) === String(filters.application)
					);
				}

				setFilteredDocuments(filtered);
				organizeDocumentsByType(filtered);
			} catch (err: any) {
				setError(err.message || "Failed to filter documents");
				toast.error("Failed to filter documents");
				setFilteredDocuments(documents);
			} finally {
				setIsLoading(false);
			}
		},
		[documents, organizeDocumentsByType]
	);

	// Upload a new document
	const uploadNewDocument = useCallback(
		async (data: DocumentUploadRequest): Promise<Document | null> => {
			if (!isAuthenticated) {
				toast.error("Authentication required to upload documents");
				return null;
			}

			try {
				const uploadedDocument = await uploadDocument(data);

				// Update local state
				setDocuments((prev) => [uploadedDocument, ...prev]);
				setFilteredDocuments((prev) => [uploadedDocument, ...prev]);

				// Update the documents by type
				setDocumentsByType((prev) => ({
					...prev,
					All: [uploadedDocument, ...prev.All],
					[uploadedDocument.document_type]: [
						uploadedDocument,
						...prev[uploadedDocument.document_type],
					],
				}));

				setLastUpdated(new Date());
				toast.success("Document uploaded successfully");
				return uploadedDocument;
			} catch (err: any) {
				toast.error(err.message || "Failed to upload document");
				return null;
			}
		},
		[isAuthenticated]
	);

	// Delete a document
	const removeDocument = useCallback(
		async (id: number): Promise<boolean> => {
			if (!isAuthenticated) {
				toast.error("Authentication required to delete documents");
				return false;
			}

			try {
				await deleteDocument(id);

				// Find the document to know its type
				const docToRemove = documents.find((d) => d.id === id);

				// Update local state
				setDocuments((prev) => prev.filter((doc) => doc.id !== id));
				setFilteredDocuments((prev) => prev.filter((doc) => doc.id !== id));

				// Update documents by type
				if (docToRemove) {
					setDocumentsByType((prev) => ({
						...prev,
						All: prev.All.filter((doc) => doc.id !== id),
						[docToRemove.document_type]: prev[docToRemove.document_type].filter(
							(doc) => doc.id !== id
						),
					}));
				}

				setLastUpdated(new Date());
				toast.success("Document deleted successfully");
				return true;
			} catch (err: any) {
				toast.error(err.message || "Failed to delete document");
				return false;
			}
		},
		[isAuthenticated, documents]
	);

	// Get documents for a specific application
	const getDocumentsByApplication = useCallback(
		(applicationId: number): Document[] => {
			return documents.filter(
				(doc) => Number(doc.application_id) === applicationId
			);
		},
		[documents]
	);

	// Clear document data when user signs out
	useEffect(() => {
		const handleUserSignOut = (_event: CustomEvent) => {
			// Reset all document state
			setDocuments([]);
			setFilteredDocuments([]);
			setDocumentsByType({
				All: [],
				Transcript: [],
				Essay: [],
				CV: [],
				"Recommendation Letter": [],
				Other: [],
			});
			setError(null);
			setIsLoading(false);
			setLastUpdated(null);
			setCurrentFilters({});
			setHasAttemptedFetch(false); // Reset the fetch attempt flag

			// Force data refresh on next load
			localStorage.removeItem("documentData");
			sessionStorage.removeItem("documentData");
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
		let isMounted = true;

		const initialFetch = async () => {
			if (isAuthenticated && isMounted && !hasAttemptedFetch) {
				await fetchDocuments();
			}
		};

		initialFetch();

		return () => {
			isMounted = false;
		};
	}, [isAuthenticated, fetchDocuments, hasAttemptedFetch]);

	const value: DocumentContextProps = {
		documents,
		filteredDocuments,
		documentsByType,
		isLoading,
		error,
		fetchDocuments,
		filterDocuments,
		uploadNewDocument,
		removeDocument,
		getDocumentsByApplication,
	};

	return (
		<DocumentContext.Provider value={value}>
			{children}
		</DocumentContext.Provider>
	);
};

// Custom hook for using the document context
export const useDocuments = () => useContext(DocumentContext);
