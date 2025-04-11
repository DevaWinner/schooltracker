import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ROUTES } from "../../constants/Routes";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import UploadDocumentModal from "../../components/Documents/UploadDocumentModal";
import DocumentCard from "../../components/Documents/DocumentCard";
import DocumentDetailModal from "../../components/Documents/DocumentDetailModal";
import DeleteDocumentModal from "../../components/Documents/DeleteDocumentModal";
import { useDocuments } from "../../context/DocumentContext";
import { useApplications } from "../../context/ApplicationContext";
import { Document, DocumentType } from "../../types/documents";
import { loadApplicationById } from "../../utils/applicationUtils";

export default function ApplicationDocuments() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const applicationId = id ? parseInt(id) : null;

	const { applications } = useApplications();
	const [application, setApplication] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);

	const { fetchDocuments, removeDocument, getDocumentsByApplication } =
		useDocuments();

	const [documents, setDocuments] = useState<Document[]>([]);
	const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
	const [activeFilter, setActiveFilter] = useState<string>("All");
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedDocument, setSelectedDocument] = useState<Document | null>(
		null
	);
	const [initialDocType, setInitialDocType] = useState<
		DocumentType | undefined
	>(undefined);
	const [documentsLoaded, setDocumentsLoaded] = useState(false);

	const [minLoadingTimeElapsed, setMinLoadingTimeElapsed] = useState(false);

	useEffect(() => {
		const minLoadingTime = setTimeout(() => {
			setMinLoadingTimeElapsed(true);
		}, 600);

		return () => clearTimeout(minLoadingTime);
	}, []);

	const filterDocumentsByType = useCallback(
		(type: string) => {
			setActiveFilter(type);

			if (type === "All") {
				setFilteredDocuments(documents);
			} else {
				const typeMapping: Record<string, string> = {
					Transcripts: "Transcript",
					Essays: "Essay",
					CVs: "CV",
					Recommendations: "Recommendation Letter",
				};

				const filterType = typeMapping[type] || type;
				const filtered = documents.filter(
					(doc) => doc.document_type === filterType
				);
				setFilteredDocuments(filtered);
			}
		},
		[documents]
	);

	useEffect(() => {
		if (documents.length > 0) {
			filterDocumentsByType(activeFilter);
		} else {
			setFilteredDocuments([]);
		}
	}, [documents, activeFilter, filterDocumentsByType]);

	const refreshDocuments = useCallback(async () => {
		if (applicationId) {
			await fetchDocuments(true);
			const updatedDocs = getDocumentsByApplication(applicationId);
			setDocuments(updatedDocs);
			setDocumentsLoaded(true);
		}
	}, [applicationId, fetchDocuments, getDocumentsByApplication]);

	useEffect(() => {
		let isMounted = true;

		const loadData = async () => {
			if (!applicationId) {
				navigate(ROUTES.Applications.tracker);
				return;
			}

			if (isLoading) {
				try {
					let app = applications.find((a) => a.id === applicationId);

					if (!app) {
						const loadedApp = await loadApplicationById(applicationId);
						app = loadedApp || undefined;
					}

					if (app && isMounted) {
						setApplication(app);

						if (!documentsLoaded) {
							await fetchDocuments();
							const appDocuments = getDocumentsByApplication(applicationId);
							if (isMounted) {
								setDocuments(appDocuments);
								setFilteredDocuments(appDocuments);
								setDocumentsLoaded(true);
							}
						}
					} else if (isMounted) {
						toast.error("Application not found");
						navigate(ROUTES.Applications.tracker);
					}
				} catch (error) {
					if (isMounted) {
						toast.error("Failed to load application data");
					}
				} finally {
					if (isMounted) {
						if (minLoadingTimeElapsed) {
							setIsLoading(false);
						} else {
							const remainingTimeCheck = setInterval(() => {
								if (minLoadingTimeElapsed && isMounted) {
									setIsLoading(false);
									clearInterval(remainingTimeCheck);
								}
							}, 100);
						}
					}
				}
			}
		};

		loadData();

		return () => {
			isMounted = false;
		};
	}, [
		applicationId,
		applications,
		navigate,
		isLoading,
		documentsLoaded,
		fetchDocuments,
		getDocumentsByApplication,
		minLoadingTimeElapsed,
	]);

	const handleSelectDocument = useCallback((doc: Document) => {
		setSelectedDocument(doc);
		setIsDetailModalOpen(true);
	}, []);

	const handleDeleteClick = useCallback(
		(id: number) => {
			const docToDelete = documents.find((doc) => doc.id === id);
			if (docToDelete) {
				setSelectedDocument(docToDelete);
				setIsDetailModalOpen(false);
				setIsDeleteModalOpen(true);
			}
		},
		[documents]
	);

	const handleConfirmDelete = useCallback(async () => {
		if (!selectedDocument) return false;

		try {
			const success = await removeDocument(selectedDocument.id);
			if (success) {
				toast.success("Document deleted successfully");
				setIsDeleteModalOpen(false);

				setDocuments((prev) =>
					prev.filter((doc) => doc.id !== selectedDocument.id)
				);
				return true;
			}
			return false;
		} catch (error) {
			return false;
		}
	}, [selectedDocument, removeDocument]);

	const handleQuickUpload = useCallback((documentType: DocumentType) => {
		setInitialDocType(documentType);
		setIsUploadModalOpen(true);
	}, []);

	if (isLoading) {
		return (
			<div className="animate-pulse">
				<div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
					<div className="h-8 w-64 rounded bg-gray-200 dark:bg-gray-700"></div>
					<div className="h-10 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					<div className="md:col-span-1">
						<div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 overflow-hidden mb-6 shadow-sm">
							<div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/70">
								<div className="h-6 w-32 rounded bg-gray-300 dark:bg-gray-600"></div>
							</div>
							<div className="p-4 space-y-3">
								{[1, 2, 3].map((idx) => (
									<div key={idx} className="space-y-2">
										<div className="h-4 w-20 rounded bg-gray-300 dark:bg-gray-600"></div>
										<div className="h-5 w-28 rounded bg-gray-200 dark:bg-gray-700"></div>
									</div>
								))}
							</div>
						</div>

						<div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 overflow-hidden shadow-sm">
							<div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/70">
								<div className="h-6 w-40 rounded bg-gray-300 dark:bg-gray-600"></div>
							</div>
							<div className="p-4 space-y-3">
								<div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
								<div className="space-y-3">
									{[1, 2, 3, 4].map((idx) => (
										<div
											key={idx}
											className="h-10 w-full rounded bg-gray-200 dark:bg-gray-700 flex items-center px-3"
										>
											<div className="h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></div>
											<div className="h-4 w-32 rounded bg-gray-300 dark:bg-gray-600"></div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					<div className="md:col-span-3 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 shadow-sm">
						<div className="mb-6 h-8 w-1/3 rounded bg-gray-300 dark:bg-gray-600 border-b border-gray-200 dark:border-gray-700 pb-4"></div>
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
							{[1, 2, 3, 4, 5, 6].map((i) => (
								<div
									key={i}
									className="h-64 rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-750 p-4 flex flex-col"
								>
									<div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
										<div className="h-5 w-16 rounded bg-gray-300 dark:bg-gray-600"></div>
										<div className="h-5 w-8 rounded bg-gray-300 dark:bg-gray-600"></div>
									</div>
									<div className="flex-1 flex flex-col items-center justify-center">
										<div className="h-16 w-16 rounded-full bg-gray-300 dark:bg-gray-600 mb-4"></div>
										<div className="h-4 w-24 rounded bg-gray-300 dark:bg-gray-600 mb-2"></div>
										<div className="h-3 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
									</div>
									<div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-center">
										<div className="h-4 w-20 rounded bg-gray-300 dark:bg-gray-600"></div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!application) {
		return (
			<div className="flex h-full items-center justify-center p-6">
				<div className="text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-900/20 dark:text-red-400">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</div>
					<h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
						Application Not Found
					</h3>
					<p className="mb-6 text-gray-600 dark:text-gray-400">
						The application you're looking for doesn't exist or has been
						removed.
					</p>
					<Button onClick={() => navigate(ROUTES.Applications.tracker)}>
						Back to Applications
					</Button>
				</div>
			</div>
		);
	}

	const pageTitle = `${application.program_name} Documents`;

	return (
		<>
			<PageMeta
				title={`${application.program_name} Documents | School Tracker`}
				description={`Documents for ${
					application.program_name
				} application at ${
					application.institution_name ||
					application.institution_details?.name ||
					"School"
				}`}
			/>

			<div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<PageBreadcrumb pageTitle={pageTitle} />
					<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
						Manage documents for your application to{" "}
						{application.institution_name ||
							application.institution_details?.name ||
							"this institution"}
					</p>
				</div>

				<div className="flex gap-3">
					<Button
						variant="outline"
						onClick={() => navigate(`/applications/detail/${applicationId}`)}
						className="inline-flex items-center gap-1"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
						Back to Application
					</Button>
					<Button
						onClick={() => setIsUploadModalOpen(true)}
						className="inline-flex items-center gap-2"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 4v16m8-8H4"
							/>
						</svg>
						Upload Document
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="md:col-span-1">
					<div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 overflow-hidden mb-6 shadow-sm">
						<div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/70">
							<h2 className="text-lg font-medium text-gray-900 dark:text-white">
								Application Details
							</h2>
						</div>
						<div className="p-4">
							<div className="mb-3">
								<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
									Program
								</p>
								<p className="text-sm text-gray-900 dark:text-white">
									{application.program_name}
								</p>
							</div>
							<div className="mb-3">
								<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
									Institution
								</p>
								<p className="text-sm text-gray-900 dark:text-white">
									{application.institution_name ||
										application.institution_details?.name ||
										"N/A"}
								</p>
							</div>
							<div className="mb-3">
								<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
									Status
								</p>
								<span
									className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
										application.status === "Accepted"
											? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
											: application.status === "Rejected"
											? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
											: application.status === "Pending"
											? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
											: application.status === "In Progress"
											? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
											: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
									}`}
								>
									{application.status}
								</span>
							</div>
						</div>
					</div>

					<div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 overflow-hidden shadow-sm">
						<div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/70">
							<h2 className="text-lg font-medium text-gray-900 dark:text-white">
								Common Documents
							</h2>
						</div>
						<div className="p-4 space-y-3">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Quickly upload commonly required documents:
							</p>
							<div className="grid grid-cols-1 gap-2">
								<button
									onClick={() => handleQuickUpload("Transcript")}
									className="flex items-center gap-2 text-left py-2.5 px-3 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/70"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4 text-blue-600 dark:text-blue-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12"
										/>
									</svg>
									<span className="dark:text-gray-400">Upload Transcript</span>
								</button>
								<button
									onClick={() => handleQuickUpload("Essay")}
									className="flex items-center gap-2 text-left py-2.5 px-3 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/70"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4 text-green-600 dark:text-green-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12"
										/>
									</svg>
									<span className="dark:text-gray-400">
										Upload Essay/Personal Statement
									</span>
								</button>
								<button
									onClick={() => handleQuickUpload("CV")}
									className="flex items-center gap-2 text-left py-2.5 px-3 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/70"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4 text-amber-600 dark:text-amber-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12"
										/>
									</svg>
									<span className="dark:text-gray-400">Upload CV/Resume</span>
								</button>
								<button
									onClick={() => handleQuickUpload("Recommendation Letter")}
									className="flex items-center gap-2 text-left py-2.5 px-3 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/70"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4 text-purple-600 dark:text-purple-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12"
										/>
									</svg>
									<span className="dark:text-gray-400">
										Upload Recommendation Letter
									</span>
								</button>
							</div>
						</div>
					</div>
				</div>

				<div className="md:col-span-3 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 shadow-sm">
					<h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4">
						{application.program_name} Documents
					</h2>

					{documents.length === 0 ? (
						<div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
							<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>
							<p className="mb-1 text-lg font-medium text-gray-900 dark:text-white">
								No documents yet
							</p>
							<p className="text-gray-500 dark:text-gray-400">
								Upload documents for this application to keep everything
								organized.
							</p>
							<Button
								variant="outline"
								onClick={() => setIsUploadModalOpen(true)}
								className="mt-4"
							>
								<svg
									className="mr-2 h-4 w-4"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 4v16m8-8H4"
									/>
								</svg>
								Upload a document
							</Button>
						</div>
					) : (
						<>
							<div className="mb-4 flex flex-wrap gap-2">
								<button
									onClick={() => filterDocumentsByType("All")}
									className={`px-3 py-1 text-sm rounded-full ${
										activeFilter === "All"
											? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
											: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
									}`}
								>
									All
								</button>
								<button
									onClick={() => filterDocumentsByType("Transcripts")}
									className={`px-3 py-1 text-sm rounded-full ${
										activeFilter === "Transcripts"
											? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
											: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/10"
									}`}
								>
									Transcripts
								</button>
								<button
									onClick={() => filterDocumentsByType("Essays")}
									className={`px-3 py-1 text-sm rounded-full ${
										activeFilter === "Essays"
											? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
											: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/10"
									}`}
								>
									Essays
								</button>
								<button
									onClick={() => filterDocumentsByType("CVs")}
									className={`px-3 py-1 text-sm rounded-full ${
										activeFilter === "CVs"
											? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
											: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/10"
									}`}
								>
									CVs
								</button>
								<button
									onClick={() => filterDocumentsByType("Recommendations")}
									className={`px-3 py-1 text-sm rounded-full ${
										activeFilter === "Recommendations"
											? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
											: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/10"
									}`}
								>
									Recommendations
								</button>
							</div>

							{filteredDocuments.length === 0 ? (
								<div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
									<p className="text-gray-500 dark:text-gray-400">
										No{" "}
										{activeFilter !== "All" ? activeFilter.toLowerCase() : ""}{" "}
										documents found for this application.
									</p>
								</div>
							) : (
								<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
									{filteredDocuments.map((doc) => (
										<DocumentCard
											key={doc.id}
											document={doc}
											onView={handleSelectDocument}
											onDelete={handleDeleteClick}
										/>
									))}
								</div>
							)}
						</>
					)}
				</div>
			</div>

			<Modal
				isOpen={isUploadModalOpen}
				onClose={() => {
					setIsUploadModalOpen(false);
					setInitialDocType(undefined);
				}}
				className="max-w-md mx-auto"
			>
				<UploadDocumentModal
					onClose={() => {
						setIsUploadModalOpen(false);
						refreshDocuments();
						setInitialDocType(undefined);
					}}
					initialApplicationId={applicationId}
					initialDocumentType={initialDocType}
				/>
			</Modal>

			<Modal
				isOpen={isDetailModalOpen}
				onClose={() => setIsDetailModalOpen(false)}
				className="max-w-md mx-auto"
			>
				{selectedDocument && (
					<DocumentDetailModal
						document={selectedDocument}
						onClose={() => setIsDetailModalOpen(false)}
						onDelete={handleDeleteClick}
					/>
				)}
			</Modal>

			<Modal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				className="max-w-md mx-auto"
			>
				{selectedDocument && (
					<DeleteDocumentModal
						documentName={selectedDocument.file_name}
						onConfirm={handleConfirmDelete}
						onCancel={() => setIsDeleteModalOpen(false)}
					/>
				)}
			</Modal>
		</>
	);
}
