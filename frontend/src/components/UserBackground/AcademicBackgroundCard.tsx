import { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import { mockFetchUserInfo } from "../../mocks/userMock";
import AcademicBackgroundModal from "./modals/AcademicBackgroundModal";

export default function AcademicBackgroundCard() {
	const { isOpen, openModal, closeModal } = useModal();
	const [userInfo, setUserInfo] = useState<any>(null);

	useEffect(() => {
		const fetchData = async () => {
			const data = await mockFetchUserInfo();
			setUserInfo(data);
		};
		fetchData();
	}, []);

	const handleSave = () => {
		console.log("Saving changes...");
		closeModal();
	};

	if (!userInfo) return <div>Loading...</div>;

	return (
		<>
			<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
				{userInfo.academic_background.map((academic: any, index: number) => (
					<div key={index} className="mb-6 last:mb-0">
						<div className="flex justify-between items-center mb-4">
							<h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
								{academic.institution_name}
							</h4>
							<span className="text-sm text-gray-500">
								{academic.start_date} - {academic.end_date}
							</span>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
									Degree
								</p>
								<p className="mt-1 text-gray-800 dark:text-white/90">
									{academic.degree}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
									Field of Study
								</p>
								<p className="mt-1 text-gray-800 dark:text-white/90">
									{academic.field_of_study}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
									GPA
								</p>
								<p className="mt-1 text-gray-800 dark:text-white/90">
									{academic.gpa}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
									Description
								</p>
								<p className="mt-1 text-gray-800 dark:text-white/90">
									{academic.description}
								</p>
							</div>
						</div>
					</div>
				))}
				<button
					onClick={openModal}
					className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
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
					Add Academic Background
				</button>
			</div>
			<Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
				<AcademicBackgroundModal
					userInfo={userInfo}
					onSave={handleSave}
					onClose={closeModal}
				/>
			</Modal>
		</>
	);
}
