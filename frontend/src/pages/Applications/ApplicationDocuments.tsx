import React, { useState, useEffect } from "react";
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
import { Document } from "../../types/documents";
import { loadApplicationById } from "../../utils/applicationUtils";

export default function ApplicationDocuments() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const applicationId = id ? parseInt(id) : null;

	const { applications } = useApplications();
	const [application, setApplication] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);

	const {
		fetchDocuments,
		filterDocuments,
		removeDocument,
		getDocumentsByApplication,
	} = useDocuments();

	const [documents, setDocuments] = useState<Document[]>([]);
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedDocument, setSelectedDocument] = useState<Document | null>(
		null
	);

	// Load application data and related documents
	useEffect(() => {
		const loadData = async () => {
			if (!applicationId) {
				navigate(ROUTES.Applications.tracker);
				return;
			}

			setIsLoading(true);

			// First, fetch application details
			try {
				// Try to find in existing applications first
				let app = applications.find((a) => a.id === applicationId);

				// If not found locally, load from API
				if (!app) {
					app = await loadApplicationById(applicationId);
				}

				if (app) {
					setApplication(app);

					// Then fetch documents for this application
					await fetchDocuments();
					await filterDocuments({ application: applicationId });

					// Get documents for this application ID
					const appDocuments = getDocumentsByApplication(applicationId);
					setDocuments(appDocuments);
				} else {
					toast.error("Application not found");
					navigate(ROUTES.Applications.tracker);
				}
			} catch (error) {
				toast.error("Failed to load application data");
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, [
		applicationId,
		applications,
		fetchDocuments,
		filterDocuments,
		getDocumentsByApplication,
		navigate,
	]);

	const handleSelectDocument = (doc: Document) => {
		setSelectedDocument(doc);
		setIsDetailModalOpen(true);
	};

	const handleDeleteClick = (id: number) => {
		const docToDelete = documents.find((doc) => doc.id === id);
		if (docToDelete) {
			setSelectedDocument(docToDelete);
			setIsDetailModalOpen(false);
			setIsDeleteModalOpen(true);
		}
	};

	const handleConfirmDelete = async () => {
		if (!selectedDocument) return false;

		try {
			const success = await removeDocument(selectedDocument.id);
			if (success) {
				toast.success("Document deleted successfully");
				setIsDeleteModalOpen(false);

				// Update local documents list
				setDocuments((prev) =>
					prev.filter((doc) => doc.id !== selectedDocument.id)
				);
				return true;
			}
			return false;
		} catch (error) {
			return false;
		}
	};

	const refreshDocuments = async () => {
		if (applicationId) {
			await fetchDocuments(true);
			const updatedDocs = getDocumentsByApplication(applicationId);
			setDocuments(updatedDocs);
		}
	};

	if (isLoading) {
		return (
			<div className="animate-pulse">
				<div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
					<div className="h-8 w-64 rounded bg-gray-200 dark:bg-gray-700"></div>
					<div className="h-10 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
				</div>

				<div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
					<div className="mb-6 h-8 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								className="h-64 rounded bg-gray-200 dark:bg-gray-700"
							></div>
						))}
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
				<PageBreadcrumb pageTitle={pageTitle} />

				<div className="flex gap-3">
					<Button
						variant="outline"
						onClick={() => navigate(`/applications/detail/${applicationId}`)}
					>
						Back to Application
					</Button>
					<Button onClick={() => setIsUploadModalOpen(true)}>
						Upload Document
					</Button>
				</div>
			</div>

			<div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
				<h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
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
							Upload a document
						</Button>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{documents.map((doc) => (
							<DocumentCard
								key={doc.id}
								document={doc}
								onView={handleSelectDocument}
								onDelete={handleDeleteClick}
							/>
						))}
					</div>
				)}
			</div>

			{/* Upload Modal */}
			<Modal
				isOpen={isUploadModalOpen}
				onClose={() => setIsUploadModalOpen(false)}
			>
				<UploadDocumentModal
					onClose={() => {
						setIsUploadModalOpen(false);
						refreshDocuments();
					}}
					initialApplicationId={applicationId}
				/>
			</Modal>

			{/* Document Detail Modal */}
			<Modal
				isOpen={isDetailModalOpen}
				onClose={() => setIsDetailModalOpen(false)}
			>
				{selectedDocument && (
					<DocumentDetailModal
						document={selectedDocument}
						onClose={() => setIsDetailModalOpen(false)}
						onDelete={handleDeleteClick}
					/>
				)}
			</Modal>

			{/* Delete Confirmation Modal */}
			<Modal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
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
