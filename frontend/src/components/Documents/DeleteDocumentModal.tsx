import React, { useState } from "react";
import Button from "../ui/button/Button";

interface DeleteDocumentModalProps {
	documentName: string;
	onConfirm: () => Promise<boolean>;
	onCancel: () => void;
}

const DeleteDocumentModal: React.FC<DeleteDocumentModalProps> = ({
	documentName,
	onConfirm,
	onCancel,
}) => {
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleDelete = async () => {
		setIsDeleting(true);
		setError(null);

		try {
			const success = await onConfirm();
			if (!success) {
				setError("Failed to delete the document. Please try again.");
			}
		} catch (err: any) {
			setError(err.message || "An error occurred while deleting the document.");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-900">
			<div className="mb-5 text-center">
				<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
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
							d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
						/>
					</svg>
				</div>

				<h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
					Delete Document
				</h3>

				<p className="text-gray-600 dark:text-gray-400">
					Are you sure you want to delete{" "}
					<span className="font-medium">{documentName}</span>? This action
					cannot be undone.
				</p>

				{error && (
					<div className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
						{error}
					</div>
				)}
			</div>

			<div className="flex justify-center space-x-4">
				<Button variant="outline" onClick={onCancel} disabled={isDeleting}>
					Cancel
				</Button>

				<Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
					{isDeleting ? "Deleting..." : "Yes, Delete"}
				</Button>
			</div>
		</div>
	);
};

export default DeleteDocumentModal;
