import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import PageMeta from "../../components/common/PageMeta";
import DocumentTypeFolder from "../../components/Documents/DocumentTypeFolder";
import DocumentCard from "../../components/Documents/DocumentCard";
import { Modal } from "../../components/ui/modal";
import DocumentDetailModal from "../../components/Documents/DocumentDetailModal";
import DeleteDocumentModal from "../../components/Documents/DeleteDocumentModal";
import UploadDocumentModal from "../../components/Documents/UploadDocumentModal";
import { useDocuments } from "../../context/DocumentContext";
import {
	Document,
	DocumentFilterParams,
	DocumentType,
} from "../../types/documents";
import Button from "../../components/ui/button/Button";

export default function DocumentLibrary() {
	const {
		documentsByType,
		isLoading,
		fetchDocuments,
		removeDocument,
		filterDocuments,
	} = useDocuments();

	const [selectedType, setSelectedType] = useState<DocumentType | "All">("All");
	const [searchTerm, setSearchTerm] = useState("");
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedDocument, setSelectedDocument] = useState<Document | null>(
		null
	);

	useEffect(() => {
		fetchDocuments();
	}, [fetchDocuments]);

	useEffect(() => {
		const filterParams: DocumentFilterParams = {};

		if (selectedType !== "All") {
			filterParams.document_type = selectedType;
		}

		if (searchTerm.trim()) {
			filterParams.search = searchTerm.trim();
		}

		filterDocuments(filterParams);
	}, [selectedType, searchTerm, filterDocuments]);

	const handleSelectDocument = (doc: Document) => {
		setSelectedDocument(doc);
		setIsDetailModalOpen(true);
	};

	const handleDeleteClick = (id: number) => {
		const docToDelete = documentsByType.All.find((doc) => doc.id === id);
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
				return true;
			}
			return false;
		} catch (error) {
			return false;
		}
	};

	// Function to generate grid columns based on screen size
	const getGridColumns = () => {
		// You can adjust these breakpoints as needed
		const width = window.innerWidth;
		if (width >= 1280) return "grid-cols-4";
		if (width >= 1024) return "grid-cols-3";
		if (width >= 640) return "grid-cols-2";
		return "grid-cols-1";
	};

	const [gridColumns, setGridColumns] = useState(getGridColumns());

	useEffect(() => {
		const handleResize = () => {
			setGridColumns(getGridColumns());
		};

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<>
			<PageMeta
				title="Document Library | School Tracker"
				description="Manage and organize your academic documents"
			/>

			<div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
					Document Library
				</h1>

				<div className="flex gap-3">
					<div className="relative">
						<input
							type="search"
							placeholder="Search documents..."
							className="h-10 w-full rounded-lg border border-gray-300 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</span>
					</div>

					<Button
						onClick={() => setIsUploadModalOpen(true)}
						className="inline-flex items-center gap-2"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
							/>
						</svg>
						Upload
					</Button>
				</div>
			</div>

			{/* Document Type Folders */}
			<div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
				<DocumentTypeFolder
					type="All"
					count={documentsByType.All.length}
					isActive={selectedType === "All"}
					onClick={() => setSelectedType("All")}
				/>
				<DocumentTypeFolder
					type="Transcript"
					count={documentsByType.Transcript.length}
					isActive={selectedType === "Transcript"}
					onClick={() => setSelectedType("Transcript")}
				/>
				<DocumentTypeFolder
					type="Essay"
					count={documentsByType.Essay.length}
					isActive={selectedType === "Essay"}
					onClick={() => setSelectedType("Essay")}
				/>
				<DocumentTypeFolder
					type="CV"
					count={documentsByType.CV.length}
					isActive={selectedType === "CV"}
					onClick={() => setSelectedType("CV")}
				/>
				<DocumentTypeFolder
					type="Recommendation Letter"
					count={documentsByType["Recommendation Letter"].length}
					isActive={selectedType === "Recommendation Letter"}
					onClick={() => setSelectedType("Recommendation Letter")}
				/>
				<DocumentTypeFolder
					type="Other"
					count={documentsByType.Other.length}
					isActive={selectedType === "Other"}
					onClick={() => setSelectedType("Other")}
				/>
			</div>

			{/* Main Document Grid */}
			<div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
						{selectedType === "All"
							? "All Documents"
							: `${selectedType} Documents`}
					</h2>
					<div className="text-sm text-gray-500 dark:text-gray-400">
						{documentsByType[selectedType].length} document(s)
					</div>
				</div>

				{isLoading ? (
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{[1, 2, 3, 4, 5, 6].map((index) => (
							<div
								key={index}
								className="animate-pulse rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
							>
								<div className="flex h-32 items-center justify-center rounded bg-gray-200 dark:bg-gray-700">
									<svg
										className="h-12 w-12 text-gray-300 dark:text-gray-600"
										xmlns="http://www.w3.org/2000/svg"
										aria-hidden="true"
										fill="currentColor"
										viewBox="0 0 640 512"
									>
										<path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 0 486.1 0 456.1L0 456.1z" />
									</svg>
								</div>
								<div className="mt-3">
									<div className="mb-2 h-4 w-4/5 rounded-md bg-gray-200 dark:bg-gray-700"></div>
									<div className="mb-2 h-3 w-3/5 rounded-md bg-gray-200 dark:bg-gray-700"></div>
									<div className="h-3 w-2/5 rounded-md bg-gray-200 dark:bg-gray-700"></div>
								</div>
							</div>
						))}
					</div>
				) : documentsByType[selectedType].length === 0 ? (
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
									d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
								/>
							</svg>
						</div>
						<p className="mb-1 text-lg font-medium text-gray-900 dark:text-white">
							No documents found
						</p>
						<p className="text-gray-500 dark:text-gray-400">
							{searchTerm
								? "No documents match your search criteria."
								: `You haven't uploaded any ${
										selectedType !== "All" ? selectedType.toLowerCase() : ""
								  } documents yet.`}
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
					<div className={`grid ${gridColumns} gap-6`}>
						{documentsByType[selectedType].map((doc) => (
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
				<UploadDocumentModal onClose={() => setIsUploadModalOpen(false)} />
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
