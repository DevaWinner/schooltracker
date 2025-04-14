import React from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";

interface DeleteConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => Promise<void>;
	title: string;
	message?: string;
	isDeleting?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message = "This action cannot be undone.",
	isDeleting = false,
}) => {
	const handleConfirm = async () => {
		await onConfirm();
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} className="w-[450px] lg:w-[500px]">
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
						You won't be able to recover this event after deletion.
					</p>
				</div>

				{/* Fixed Footer */}
				<div className="w-full flex-shrink-0 flex items-center justify-between border-t border-gray-200 px-8 py-4 bg-white dark:bg-gray-900 dark:border-gray-700">
					<div></div>
					<div className="flex items-center gap-3">
						<Button
							size="sm"
							variant="outline"
							onClick={onClose}
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
};

export default DeleteConfirmationModal;
