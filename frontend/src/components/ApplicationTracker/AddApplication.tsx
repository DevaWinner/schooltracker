import React from "react";
import { useModal } from "../../hooks/useModal";
import { Application } from "../../interfaces/applications";
import MultiStepApplicationModal from "./modals/MultiStepApplicationModal";
import { useApplications } from "../../context/ApplicationContext";

interface AddApplicationProps {
	onRefresh?: () => void;
}

const AddApplication: React.FC<AddApplicationProps> = ({ onRefresh }) => {
	const { isOpen, openModal, closeModal } = useModal();
	const { addApplication } = useApplications();

	const handleSave = async (data: Application) => {
		// Ensure we're not passing an ID field for new applications
		// This is a defensive measure to make sure the ID is never sent
		if ("id" in data) {
			const { id, ...dataWithoutId } = data;
			const result = await addApplication(dataWithoutId as Application);
			if (result) {
				closeModal();
				if (onRefresh) {
					onRefresh();
				}
			}
		} else {
			const result = await addApplication(data);
			if (result) {
				closeModal();
				if (onRefresh) {
					onRefresh();
				}
			}
		}
	};

	return (
		<>
			<button
				onClick={openModal}
				className="flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:bg-brand-500 dark:hover:bg-brand-600"
			>
				<svg
					className="fill-current"
					width="18"
					height="18"
					viewBox="0 0 18 18"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M9 1.5C9.41421 1.5 9.75 1.83579 9.75 2.25V8.25H15.75C16.1642 8.25 16.5 8.58579 16.5 9C16.5 9.41421 16.1642 9.75 15.75 9.75H9.75V15.75C9.75 16.1642 9.41421 16.5 9 16.5C8.58579 16.5 8.25 16.1642 8.25 15.75V9.75H2.25C1.83579 9.75 1.5 9.41421 1.5 9C1.5 8.58579 1.83579 8.25 2.25 8.25H8.25V2.25C8.25 1.83579 8.58579 1.5 9 1.5Z"
						fill=""
					/>
				</svg>
				Add Application
			</button>
			<MultiStepApplicationModal
				isOpen={isOpen}
				onSave={handleSave}
				onClose={closeModal}
			/>
		</>
	);
};

export default AddApplication;
