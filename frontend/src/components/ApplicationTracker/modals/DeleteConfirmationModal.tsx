import { useState } from "react";
import Button from "../../ui/button/Button";

interface DeleteConfirmationModalProps {
	onConfirm: () => Promise<{ success: boolean; message: string }>;
	onCancel: () => void;
	title: string;
	message: string;
}

export default function DeleteConfirmationModal({
	onConfirm,
	onCancel,
	title,
	message,
}: DeleteConfirmationModalProps) {
	const [error, setError] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleConfirm = async () => {
		setIsDeleting(true);
		setError(null);

		try {
			const result = await onConfirm();

			if (!result.success) {
				setError(result.message);
				setIsDeleting(false);
			}
		} catch (err: any) {
			// Fallback error handling
			setError(err.message || "An unexpected error occurred");
			setIsDeleting(false);
		}
	};

	return (
		<div className="w-full rounded-xl bg-white p-6 dark:bg-gray-900">
			<div className="mb-6 text-center">
				<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/20">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
							clipRule="evenodd"
						/>
					</svg>
				</div>
				<h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-white">
					{title}
				</h3>
				<p className="text-gray-600 dark:text-gray-400">{message}</p>

				{error && (
					<div className="mt-4 rounded-md bg-red-50 p-3 dark:bg-red-900/20">
						<p className="text-sm text-red-700 dark:text-red-400">{error}</p>
					</div>
				)}
			</div>
			<div className="flex justify-center gap-3">
				<Button
					size="sm"
					variant="outline"
					onClick={onCancel}
					disabled={isDeleting}
				>
					Cancel
				</Button>
				<Button
					size="sm"
					variant="danger"
					onClick={handleConfirm}
					disabled={isDeleting}
				>
					{isDeleting ? "Deleting..." : "Delete"}
				</Button>
			</div>
		</div>
	);
}
