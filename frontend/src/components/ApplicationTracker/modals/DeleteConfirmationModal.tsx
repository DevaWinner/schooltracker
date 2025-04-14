import { useState } from "react";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";

interface DeleteConfirmationModalProps {
	isOpen: boolean;
	onConfirm: () => Promise<{ success: boolean; message: string }>;
	onCancel: () => void;
	title: string;
	message: string;
}

export default function DeleteConfirmationModal({
	isOpen,
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
		<Modal
			isOpen={isOpen}
			onClose={onCancel}
			className="w-[450px] lg:w-[500px]"
		>
			<div className="flex flex-col h-auto bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
				{/* Fixed Header */}
				<div className="w-full flex-shrink-0 border-b border-gray-200 px-8 pt-6 pb-4 dark:border-gray-700">
					<div className="flex items-center gap-3">
						<div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-full">
							<svg
								className="w-6 h-6 text-red-500 dark:text-red-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								></path>
							</svg>
						</div>
						<h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
							{title}
						</h4>
					</div>
				</div>

				{/* Content */}
				<div className="p-8 text-center">
					<p className="text-gray-700 dark:text-gray-300 font-medium">
						{message}
					</p>
					<p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
						You won't be able to recover this application after deletion.
					</p>

					{error && (
						<div className="mt-4 rounded-md bg-red-50 p-3 dark:bg-red-900/20">
							<p className="text-sm text-red-700 dark:text-red-400">{error}</p>
						</div>
					)}
				</div>

				{/* Fixed Footer */}
				<div className="w-full flex-shrink-0 flex items-center justify-between border-t border-gray-200 px-8 py-4 bg-white dark:bg-gray-900 dark:border-gray-700">
					<div></div>
					<div className="flex items-center gap-3">
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
			</div>
		</Modal>
	);
}
