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
} from "../types/documents";
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
	documentsByType: { All: [] },
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
	const [currentFilters, setCurrentFilters] = useState<DocumentFilterParams>(
		{}
	);

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
			if (documents.length > 0 && !refresh && lastUpdated) {
				// Only refetch if data is older than 5 minutes
				const fiveMinutesAgo = new Date();
				fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

				if (lastUpdated > fiveMinutesAgo) {
					return;
				}
			}

			if (!isAuthenticated) {
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
			} catch (err: any) {
				setError(err.message || "Failed to fetch documents");
				toast.error("Failed to load documents");
			} finally {
				setIsLoading(false);
			}
		},
		[isAuthenticated, documents.length, lastUpdated, organizeDocumentsByType]
	);

	// Filter documents based on provided filters
	const filterDocuments = useCallback(
		async (filters: DocumentFilterParams) => {
			setIsLoading(true);
			setCurrentFilters(filters);

			try {
				// If we have simple filters we can apply client-side, do it
				if (Object.keys(filters).length === 0) {
					setFilteredDocuments(documents);
					return;
				}

				if (
					(filters.document_type || filters.application) &&
					!filters.search &&
					!filters.ordering
				) {
					// Simple filtering we can do client-side
					let filtered = [...documents];

					if (filters.document_type) {
						filtered = filtered.filter(
							(doc) => doc.document_type === filters.document_type
						);
					}

					if (filters.application) {
						filtered = filtered.filter(
							(doc) =>
								String(doc.application_id) === String(filters.application)
						);
					}

					setFilteredDocuments(filtered);
				} else {
					// More complex filtering, use the API
					const response = await getDocuments(filters);
					setFilteredDocuments(response.results);
				}
			} catch (err: any) {
				setError(err.message || "Failed to filter documents");
				toast.error("Failed to filter documents");
				setFilteredDocuments(documents);
			} finally {
				setIsLoading(false);
			}
		},
		[documents]
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

	// Initial fetch when component mounts if user is authenticated
	useEffect(() => {
		if (isAuthenticated) {
			fetchDocuments();
		}
	}, [isAuthenticated, fetchDocuments]);

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
