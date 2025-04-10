import { Application } from "../../../types/applications";

interface ApplicationDetailModalProps {
	application: Application;
	onClose: () => void;
	onEdit: (application: Application) => void;
}

export default function ApplicationDetailModal({
	application,
	onClose,
	onEdit,
}: ApplicationDetailModalProps) {
	const formatDate = (dateStr?: string): string => {
		if (!dateStr) return "Not set";
		const date = new Date(dateStr);
		return date.toLocaleDateString();
	};

	const getStatusColor = (status: string): string => {
		switch (status) {
			case "Draft":
				return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
			case "In Progress":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
			case "Submitted":
				return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
			case "Interview":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
			case "Accepted":
				return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
			case "Rejected":
				return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
		}
	};

	// URLs
	const applicationUrl = application.application_link || null;
	const scholarshipUrl = application.scholarship_link || null;
	const programInfoUrl = application.program_info_link || null;

	return (
		<div className="max-h-[80vh] overflow-y-auto">
			<div className="mb-6 flex items-start justify-between">
				<div>
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
						{application.program_name}
					</h2>
					<p className="mt-1 text-lg text-gray-600 dark:text-gray-300">
						{application.institution_details?.name ||
							application.institution_name ||
							application.institution ||
							"Unknown Institution"}
					</p>
				</div>
				<span
					className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
						application.status
					)}`}
				>
					{application.status}
				</span>
			</div>

			<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
				<div className="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/30">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						Program Details
					</h3>

					<div>
						<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
							Degree
						</h4>
						<p className="text-gray-900 dark:text-white">
							{application.degree_type}
						</p>
					</div>

					{application.department && (
						<div>
							<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
								Department
							</h4>
							<p className="text-gray-900 dark:text-white">
								{application.department}
							</p>
						</div>
					)}

					{application.duration_years && (
						<div>
							<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
								Duration
							</h4>
							<p className="text-gray-900 dark:text-white">
								{application.duration_years} years
							</p>
						</div>
					)}

					{application.tuition_fee && (
						<div>
							<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
								Tuition Fee
							</h4>
							<p className="text-gray-900 dark:text-white">
								${application.tuition_fee}
							</p>
						</div>
					)}
				</div>

				<div className="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/30">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						Application Timeline
					</h3>

					<div>
						<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
							Start Date
						</h4>
						<p className="text-gray-900 dark:text-white">
							{formatDate(application.start_date)}
						</p>
					</div>

					<div>
						<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
							Submitted Date
						</h4>
						<p className="text-gray-900 dark:text-white">
							{formatDate(application.submitted_date)}
						</p>
					</div>

					<div>
						<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
							Decision Date
						</h4>
						<p className="text-gray-900 dark:text-white">
							{formatDate(application.decision_date)}
						</p>
					</div>
				</div>
			</div>

			{(applicationUrl || scholarshipUrl || programInfoUrl) && (
				<div className="mb-8 space-y-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/10">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						Important Links
					</h3>

					<div className="flex flex-wrap gap-3">
						{applicationUrl && (
							<a
								href={applicationUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center rounded-lg bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/40"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="mr-2 h-4 w-4"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
										clipRule="evenodd"
									/>
								</svg>
								Application Portal
							</a>
						)}

						{scholarshipUrl && (
							<a
								href={scholarshipUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-800/40"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="mr-2 h-4 w-4"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
										clipRule="evenodd"
									/>
								</svg>
								Scholarship Info
							</a>
						)}

						{programInfoUrl && (
							<a
								href={programInfoUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center rounded-lg bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-800/40"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="mr-2 h-4 w-4"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
								</svg>
								Program Information
							</a>
						)}
					</div>
				</div>
			)}

			{application.notes && (
				<div className="mb-8 space-y-2 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/30">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						Notes
					</h3>
					<p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
						{application.notes}
					</p>
				</div>
			)}

			<div className="mt-8 flex justify-end space-x-4 border-t pt-4">
				<button
					onClick={() => onEdit(application)}
					className="inline-flex items-center rounded-lg border border-blue-600 bg-transparent px-4 py-2 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="mr-2 h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
						/>
					</svg>
					Edit Application
				</button>
				<button
					onClick={onClose}
					className="rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
				>
					Close
				</button>
			</div>
		</div>
	);
}
