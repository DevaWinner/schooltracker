import React from "react";
import { Document } from "../../types/documents";
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

	return (
		<div
			className="relative group flex flex-col items-center bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
			onClick={() => onView(document)}
		>
			<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
				<button
					onClick={(e) => {
						e.stopPropagation();
						onDelete(document.id);
					}}
					className="text-red-500 hover:text-red-700 dark:hover:text-red-300 p-1"
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

			<FileIcon fileType={document.file_name} className="mb-3" />

			<div className="text-center w-full">
				<h3
					className="font-medium text-gray-900 dark:text-white text-sm truncate max-w-full"
					title={document.file_name}
				>
					{document.file_name}
				</h3>

				<div className="mt-1">
					<span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
						{document.document_type}
					</span>
				</div>

				{document.application_info && (
					<p
						className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-full"
						title={document.application_info.program_name}
					>
						For: {document.application_info.program_name}
					</p>
				)}

				<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
					{formatDate(document.uploaded_at)}
				</p>
			</div>
		</div>
	);
};

export default DocumentCard;
