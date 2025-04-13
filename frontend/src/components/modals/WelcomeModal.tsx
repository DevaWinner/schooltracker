import React from "react";
import { Link } from "react-router-dom";
import { Modal } from "../ui/modal";

interface WelcomeModalProps {
	isOpen: boolean;
	onClose: () => void;
	userName: string;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({
	isOpen,
	onClose,
	userName,
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
			<div className="p-6">
				<div className="text-center mb-5">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-50 text-brand-500 dark:bg-brand-900/20 dark:text-brand-300 mb-4">
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
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
					<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
						Welcome to School Tracker, {userName}!
					</h3>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Thank you for creating an account. Complete your profile to get the
						most out of School Tracker.
					</p>
				</div>

				<div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6">
					<h4 className="font-medium text-gray-800 dark:text-white/90 mb-2 flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 mr-2 text-brand-500 dark:text-brand-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						Next Steps:
					</h4>
					<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
						<li className="flex items-start">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 mr-2 text-green-500 shrink-0"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>Complete your profile information</span>
						</li>
						<li className="flex items-start">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 mr-2 text-green-500 shrink-0"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>Add your first school application</span>
						</li>
						<li className="flex items-start">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 mr-2 text-green-500 shrink-0"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>Upload important documents</span>
						</li>
					</ul>
				</div>

				<div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
					<button
						onClick={onClose}
						className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
					>
						I'll do this later
					</button>

					<Link
						to="/profile/information"
						onClick={onClose}
						className="px-4 py-2 text-sm font-medium text-white bg-brand-600 border border-transparent rounded-md shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:bg-brand-500 dark:hover:bg-brand-600"
					>
						Complete Profile Now
					</Link>
				</div>
			</div>
		</Modal>
	);
};

export default WelcomeModal;
