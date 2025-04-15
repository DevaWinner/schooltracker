import React from "react";
import { Document } from "../../interfaces/documents";
import FileIcon from "./FileIcon";
import { format } from "date-fns";

interface DocumentCardProps {
	document: Document;
	onView: (doc: Document) => void;
	onDelete: (docId: number) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
	document,
	onView,
	onDelete,
}) => {
	const formatDate = (dateString: string) => {
		try {
			return format(new Date(dateString), "MMM d, yyyy");
		} catch (e) {
			return "Invalid date";
		}
	};

	// Extract file extension for better visual cues
	const getFileExtension = (filename: string) => {
		const parts = filename.split(".");
		return parts.length > 1 ? parts.pop()?.toUpperCase() : "";
	};

	const fileExtension = getFileExtension(document.file_name);

	return (
		<div
			className="relative group flex flex-col bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
			onClick={() => onView(document)}
		>
			{/* Document Header with Extension Badge */}
			<div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
				<span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
					{document.document_type}
				</span>
				{fileExtension && (
					<span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
						{fileExtension}
					</span>
				)}
			</div>

			{/* Document Body */}
			<div className="flex-1 flex flex-col items-center p-4">
				<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
					<button
						onClick={(e) => {
							e.stopPropagation();
							onDelete(document.id);
						}}
						className="text-red-500 hover:text-red-700 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
						aria-label="Delete document"
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
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
					</button>
				</div>

				<FileIcon fileType={document.file_name} className="mb-3 h-16 w-16" />

				<div className="text-center w-full">
					<h3
						className="font-medium text-gray-900 dark:text-white text-sm truncate max-w-full"
						title={document.file_name}
					>
						{document.file_name}
					</h3>

					{document.application_info && (
						<p
							className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-full"
							title={document.application_info.program_name}
						>
							For: {document.application_info.program_name}
						</p>
					)}
				</div>
			</div>

			{/* Document Footer */}
			<div className="bg-gray-50 dark:bg-gray-800/50 p-2 text-center border-t border-gray-100 dark:border-gray-700">
				<p className="text-xs text-gray-500 dark:text-gray-400">
					{formatDate(document.uploaded_at)}
				</p>
			</div>

			{/* Hover Effect Overlay */}
			<div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

			{/* View Button on Hover */}
			<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
				<span className="px-3 py-1.5 bg-white/80 dark:bg-gray-800/80 text-xs font-medium rounded-full text-gray-800 dark:text-gray-200 shadow-sm">
					View Details
				</span>
			</div>
		</div>
	);
};

export default DocumentCard;
