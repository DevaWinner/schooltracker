import React from "react";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { Document } from "../../interfaces/documents";
import { format } from "date-fns";
import FileIcon from "./FileIcon";

interface DocumentDetailModalProps {
	isOpen: boolean;
	document: Document;
	onClose: () => void;
	onDelete: (id: number) => void;
}

const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
	isOpen,
	document,
	onClose,
	onDelete,
}) => {
	const formatDate = (dateString: string) => {
		try {
			return format(new Date(dateString), "MMMM d, yyyy h:mm a");
		} catch (e) {
			return "Invalid date";
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} className="w-[700px]">
			<div className="flex flex-col bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
				{/* Header */}
				<div className="flex-shrink-0 border-b border-gray-200 px-6 pt-6 pb-4 dark:border-gray-700">
					<h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
						Document Details
					</h2>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						View and manage document information
					</p>
				</div>

				{/* Content */}
				<div className="flex-1 p-6 overflow-y-auto">
					<div className="mb-6 flex items-start justify-between">
						<div>
							<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
								{document.file_name}
							</h2>
							<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
								Uploaded on {formatDate(document.uploaded_at)}
							</p>
						</div>
					</div>

					<div className="mb-6 flex flex-col items-center justify-center sm:flex-row sm:space-x-6">
						<div className="mb-4 sm:mb-0">
							<FileIcon
								fileType={document.file_name}
								className="h-20 w-20 md:h-24 md:w-24"
							/>
						</div>
						<div className="flex flex-col space-y-4">
							<div>
								<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
									Document Type
								</h3>
								<p className="text-base font-medium text-gray-900 dark:text-white">
									<span className="inline-block mt-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
										{document.document_type}
									</span>
								</p>
							</div>

							{document.application_info && (
								<div>
									<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
										Related Application
									</h3>
									<p className="text-base font-medium text-gray-900 dark:text-white">
										{document.application_info.program_name} at{" "}
										{document.application_info.institution_name}
									</p>
								</div>
							)}
						</div>
					</div>

					<div className="border-t border-gray-200 pt-6 dark:border-gray-700">
						<div className="mb-4">
							<h3 className="text-base font-semibold text-gray-900 dark:text-white">
								Actions
							</h3>
						</div>
						<div className="flex flex-wrap gap-3">
							<a
								href={document.file_url}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
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
										d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
									/>
								</svg>
								View Document
							</a>

							<a
								href={document.file_url}
								download={document.file_name}
								className="inline-flex items-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
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
										d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
									/>
								</svg>
								Download
							</a>

							<Button
								variant="danger"
								onClick={() => onDelete(document.id)}
								className="inline-flex items-center"
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
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
								Delete Document
							</Button>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="flex-shrink-0 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
					<div className="flex justify-end gap-3">
						<Button variant="outline" onClick={onClose}>
							Close
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default DocumentDetailModal;
