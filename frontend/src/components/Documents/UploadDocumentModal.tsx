import React, { useEffect, useState } from "react";
import Button from "../ui/button/Button";
import {
	DocumentType,
	DocumentUploadRequest,
	DOCUMENT_TYPES,
} from "../../types/documents";
import { Application } from "../../types/applications";
import { useApplications } from "../../context/ApplicationContext";
import { useDocuments } from "../../context/DocumentContext";

interface UploadDocumentModalProps {
	onClose: () => void;
	initialApplicationId?: number | null;
}

const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
	onClose,
	initialApplicationId = null,
}) => {
	const [file, setFile] = useState<File | null>(null);
	const [documentType, setDocumentType] = useState<DocumentType>("Transcript");
	const [applicationId, setApplicationId] = useState<number | null>(
		initialApplicationId
	);
	const [isUploading, setIsUploading] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	const { applications } = useApplications();
	const { uploadNewDocument } = useDocuments();

	// Effect to set initial application if provided
	useEffect(() => {
		if (initialApplicationId) {
			setApplicationId(initialApplicationId);
		}
	}, [initialApplicationId]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFile(e.target.files[0]);
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			setFile(e.dataTransfer.files[0]);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!file) {
			return;
		}

		setIsUploading(true);

		const uploadData: DocumentUploadRequest = {
			file,
			document_type: documentType,
			application: applicationId,
		};

		try {
			const uploaded = await uploadNewDocument(uploadData);
			if (uploaded) {
				onClose();
			}
		} catch (error) {
			console.error("Upload failed:", error);
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div className="w-full max-w-3xl rounded-xl bg-white p-6 dark:bg-gray-900">
			<div className="mb-6">
				<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
					Upload Document
				</h2>
				<p className="text-sm text-gray-500 dark:text-gray-400">
					Upload your document files up to 50MB
				</p>
			</div>

			<form onSubmit={handleSubmit}>
				<div className="mb-6">
					<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
						Document Type
					</label>
					<select
						className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
						value={documentType}
						onChange={(e) => setDocumentType(e.target.value as DocumentType)}
						required
					>
						{DOCUMENT_TYPES.map((type) => (
							<option key={type} value={type}>
								{type}
							</option>
						))}
					</select>
				</div>

				<div className="mb-6">
					<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
						Associated Application (Optional)
					</label>
					<select
						className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
						value={applicationId || ""}
						onChange={(e) =>
							setApplicationId(e.target.value ? Number(e.target.value) : null)
						}
					>
						<option value="">None</option>
						{applications.map((app: Application) => (
							<option key={app.id} value={app.id}>
								{app.program_name} at{" "}
								{app.institution_name ||
									app.institution_details?.name ||
									app.institution}
							</option>
						))}
					</select>
					<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
						Link this document to a specific application
					</p>
				</div>

				<div className="mb-6">
					<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
						Upload File
					</label>
					<div
						className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 ${
							isDragging
								? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20"
								: "border-gray-300 dark:border-gray-600"
						} ${file ? "bg-gray-50 dark:bg-gray-800/50" : ""}`}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
					>
						{file ? (
							<div className="text-center">
								<div className="mb-2 text-3xl text-green-500 dark:text-green-400">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-10 w-10 mx-auto"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
								</div>
								<p className="mb-1 text-sm font-medium text-gray-800 dark:text-white">
									{file.name}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									{(file.size / (1024 * 1024)).toFixed(2)} MB
								</p>
								<button
									type="button"
									onClick={() => setFile(null)}
									className="mt-2 text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400"
								>
									Remove file
								</button>
							</div>
						) : (
							<>
								<svg
									className="mb-3 h-10 w-10 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
									></path>
								</svg>
								<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
									<span className="font-semibold">Click to upload</span> or drag
									and drop
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									PDF, DOC, DOCX, XLS, XLSX up to 50MB
								</p>
								<input
									id="file-upload"
									type="file"
									className="hidden"
									onChange={handleFileChange}
									accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
								/>
								<label
									htmlFor="file-upload"
									className="mt-4 inline-flex cursor-pointer items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-50 dark:bg-gray-700 dark:text-blue-400 dark:hover:bg-gray-600"
								>
									Select File
								</label>
							</>
						)}
					</div>
				</div>

				<div className="flex justify-end space-x-3">
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						disabled={isUploading}
					>
						Cancel
					</Button>
					<Button type="submit" disabled={!file || isUploading}>
						{isUploading ? "Uploading..." : "Upload"}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default UploadDocumentModal;
