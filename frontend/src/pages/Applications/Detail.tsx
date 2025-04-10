  import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Application } from "../../types/applications";
import { tableData } from "../../components/ApplicationTracker/placeholderData";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { Modal } from "../../components/ui/modal";
import EditApplicationModal from "../../components/ApplicationTracker/modals/EditApplicationModal";
import DeleteConfirmationModal from "../../components/ApplicationTracker/modals/DeleteConfirmationModal";
import { ROUTES } from "../../constants/Routes";

export default function ApplicationDetail() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [application, setApplication] = useState<Application | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// In a real app, you would fetch the application from an API
		// For now, we'll use the mock data
		setIsLoading(true);
		const appId = parseInt(id || "0");
		const foundApp = tableData.find((app) => app.id === appId);

		if (foundApp) {
			setApplication(foundApp);
		}
		setIsLoading(false);
	}, [id]);

	const handleEdit = () => {
		setIsEditModalOpen(true);
	};

	const handleDelete = () => {
		setIsDeleteModalOpen(true);
	};

	const handleSaveEdit = (updatedApplication: Application) => {
		// In a real app, you would update the application via API
		setApplication(updatedApplication);
		setIsEditModalOpen(false);
	};

	const handleConfirmDelete = () => {
		// In a real app, you would delete the application via API
		navigate(ROUTES.Applications.tracker);
	};

	// Helper functions
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

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (!application) {
		return (
			<div className="text-center p-8">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
					Application Not Found
				</h2>
				<p className="text-gray-600 dark:text-gray-400 mb-6">
					The application you're looking for doesn't exist or has been removed.
				</p>
				<button
					onClick={() => navigate(ROUTES.Applications.tracker)}
					className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				>
					Back to Applications
				</button>
			</div>
		);
	}

	// URLs
	const applicationUrl = application.application_link || null;
	const scholarshipUrl = application.scholarship_link || null;
	const programInfoUrl = application.program_info_link || null;

	return (
		<>
			<PageMeta
				title={`${application.program_name || "Application"} | School Tracker`}
				description={`Details for ${application.program_name} application at ${
					application.institution_name || "institution"
				}`}
			/>

			<div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
				<PageBreadcrumb pageTitle="Application Details" />
				<div className="flex gap-3">
					<button
						onClick={() => navigate(ROUTES.Applications.tracker)}
						className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="mr-2 h-4 w-4"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
								clipRule="evenodd"
							/>
						</svg>
						Back to Applications
					</button>
					<button
						onClick={handleEdit}
						className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="mr-2 h-4 w-4"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
						</svg>
						Edit
					</button>
					<button
						onClick={handleDelete}
						className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-700 dark:hover:bg-red-800"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="mr-2 h-4 w-4"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
								clipRule="evenodd"
							/>
						</svg>
						Delete
					</button>
				</div>
			</div>

			<div className="space-y-6">
				{/* Header Section */}
				<div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
					<div className="flex flex-col md:flex-row md:items-start md:justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
								{application.program_name}
							</h1>
							<p className="mt-1 text-lg text-gray-600 dark:text-gray-300">
								{application.institution_details?.name ||
									application.institution_name ||
									application.institution ||
									"Unknown Institution"}
							</p>
							{application.department && (
								<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
									{application.department}
								</p>
							)}
						</div>
						<div className="mt-4 md:mt-0">
							<span
								className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
									application.status
								)}`}
							>
								{application.status}
							</span>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					{/* Left Column - Program Details */}
					<div className="space-y-6">
						<div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
							<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
								Program Details
							</h2>

							<div className="space-y-4">
								<div>
									<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
										Degree Type
									</h3>
									<p className="text-base text-gray-900 dark:text-white">
										{application.degree_type}
									</p>
								</div>

								{application.duration_years && (
									<div>
										<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Duration
										</h3>
										<p className="text-base text-gray-900 dark:text-white">
											{application.duration_years} years
										</p>
									</div>
								)}

								{application.tuition_fee && (
									<div>
										<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Tuition Fee
										</h3>
										<p className="text-base text-gray-900 dark:text-white">
											${application.tuition_fee}
										</p>
									</div>
								)}

								{application.institution_country && (
									<div>
										<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Country
										</h3>
										<p className="text-base text-gray-900 dark:text-white">
											{application.institution_country}
										</p>
									</div>
								)}
							</div>
						</div>

						{/* Important Links */}
						{(applicationUrl || scholarshipUrl || programInfoUrl) && (
							<div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
								<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
									Important Links
								</h2>

								<div className="space-y-3">
									{applicationUrl && (
										<a
											href={applicationUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center rounded-lg bg-blue-50 px-4 py-3 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="mr-2 h-5 w-5"
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
											className="flex items-center rounded-lg bg-green-50 px-4 py-3 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="mr-2 h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
													clipRule="evenodd"
												/>
											</svg>
											Scholarship Information
										</a>
									)}

									{programInfoUrl && (
										<a
											href={programInfoUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center rounded-lg bg-purple-50 px-4 py-3 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/30"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="mr-2 h-5 w-5"
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
					</div>

					{/* Middle Column - Timeline */}
					<div className="space-y-6">
						<div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
							<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
								Application Timeline
							</h2>

							<div className="relative space-y-8 pl-6 before:absolute before:left-2 before:top-2 before:bottom-0 before:w-[1px] before:bg-gray-200 dark:before:bg-gray-700">
								{application.submitted_date && (
									<div className="relative">
										<div className="absolute -left-6 mt-1.5 h-3 w-3 rounded-full border-2 border-blue-600 bg-white dark:bg-gray-900"></div>
										<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Submitted
										</h3>
										<p className="text-base text-gray-900 dark:text-white">
											{formatDate(application.submitted_date)}
										</p>
									</div>
								)}

								{application.status === "Interview" && (
									<div className="relative">
										<div className="absolute -left-6 mt-1.5 h-3 w-3 rounded-full border-2 border-yellow-500 bg-white dark:bg-gray-900"></div>
										<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Interview Stage
										</h3>
										<p className="text-base text-gray-900 dark:text-white">
											In progress
										</p>
									</div>
								)}

								{application.decision_date && (
									<div className="relative">
										<div className="absolute -left-6 mt-1.5 h-3 w-3 rounded-full border-2 border-purple-600 bg-white dark:bg-gray-900"></div>
										<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Decision Date
										</h3>
										<p className="text-base text-gray-900 dark:text-white">
											{formatDate(application.decision_date)}
										</p>
									</div>
								)}

								{application.start_date && (
									<div className="relative">
										<div className="absolute -left-6 mt-1.5 h-3 w-3 rounded-full border-2 border-green-600 bg-white dark:bg-gray-900"></div>
										<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Start Date
										</h3>
										<p className="text-base text-gray-900 dark:text-white">
											{formatDate(application.start_date)}
										</p>
									</div>
								)}
							</div>
						</div>

						{/* Notes Section */}
						{application.notes && (
							<div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
								<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
									Notes
								</h2>
								<p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
									{application.notes}
								</p>
							</div>
						)}
					</div>

					{/* Right Column - Documents */}
					<div>
						<div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
							<div className="mb-4 flex items-center justify-between">
								<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
									Application Documents
								</h2>
								<button className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800">
									Upload Document
								</button>
							</div>

							<div className="space-y-3">
								{/* This would typically be mapped from application documents */}
								<div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
									<div className="flex items-center space-x-3">
										<svg
											className="h-10 w-10 text-blue-600 dark:text-blue-400"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
											<polyline points="14 2 14 8 20 8"></polyline>
											<line x1="16" y1="13" x2="8" y2="13"></line>
											<line x1="16" y1="17" x2="8" y2="17"></line>
											<polyline points="10 9 9 9 8 9"></polyline>
										</svg>
										<div>
											<p className="font-medium text-gray-900 dark:text-white">
												Personal Statement
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												PDF • 2.1 MB • Uploaded recently
											</p>
										</div>
									</div>
									<div className="flex space-x-2">
										<button className="rounded-full p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
													clipRule="evenodd"
												/>
											</svg>
										</button>
										<button className="rounded-full p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
												<path
													fillRule="evenodd"
													d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
													clipRule="evenodd"
												/>
											</svg>
										</button>
										<button className="rounded-full p-1 text-red-500 hover:bg-gray-200 hover:text-red-700 dark:hover:bg-gray-700">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
													clipRule="evenodd"
												/>
											</svg>
										</button>
									</div>
								</div>

								<div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
									<div className="flex items-center space-x-3">
										<svg
											className="h-10 w-10 text-green-600 dark:text-green-400"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
											<polyline points="14 2 14 8 20 8"></polyline>
											<line x1="16" y1="13" x2="8" y2="13"></line>
											<line x1="16" y1="17" x2="8" y2="17"></line>
											<polyline points="10 9 9 9 8 9"></polyline>
										</svg>
										<div>
											<p className="font-medium text-gray-900 dark:text-white">
												Transcript
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												PDF • 1.8 MB • Uploaded recently
											</p>
										</div>
									</div>
									<div className="flex space-x-2">
										<button className="rounded-full p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
													clipRule="evenodd"
												/>
											</svg>
										</button>
										<button className="rounded-full p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
												<path
													fillRule="evenodd"
													d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
													clipRule="evenodd"
												/>
											</svg>
										</button>
										<button className="rounded-full p-1 text-red-500 hover:bg-gray-200 hover:text-red-700 dark:hover:bg-gray-700">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
													clipRule="evenodd"
												/>
											</svg>
										</button>
									</div>
								</div>

								<div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
									<div className="flex items-center space-x-3">
										<svg
											className="h-10 w-10 text-amber-600 dark:text-amber-400"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
											<polyline points="14 2 14 8 20 8"></polyline>
											<line x1="16" y1="13" x2="8" y2="13"></line>
											<line x1="16" y1="17" x2="8" y2="17"></line>
											<polyline points="10 9 9 9 8 9"></polyline>
										</svg>
										<div>
											<p className="font-medium text-gray-900 dark:text-white">
												Letter of Recommendation
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												PDF • 1.2 MB • Uploaded recently
											</p>
										</div>
									</div>
									<div className="flex space-x-2">
										<button className="rounded-full p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
													clipRule="evenodd"
												/>
											</svg>
										</button>
										<button className="rounded-full p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
												<path
													fillRule="evenodd"
													d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
													clipRule="evenodd"
												/>
											</svg>
										</button>
										<button className="rounded-full p-1 text-red-500 hover:bg-gray-200 hover:text-red-700 dark:hover:bg-gray-700">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
													clipRule="evenodd"
												/>
											</svg>
										</button>
									</div>
								</div>

								<button className="mt-2 flex w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 py-4 text-center text-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800/30 dark:text-gray-400 dark:hover:bg-gray-700/50">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="mr-2 h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
											clipRule="evenodd"
										/>
									</svg>
									Add Document
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Edit Application Modal */}
			<Modal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				className="max-w-[800px] m-4"
			>
				{application && (
					<EditApplicationModal
						data={application}
						onSave={handleSaveEdit}
						onClose={() => setIsEditModalOpen(false)}
					/>
				)}
			</Modal>

			{/* Delete Confirmation Modal */}
			<Modal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				className="max-w-[500px] m-4"
			>
				<DeleteConfirmationModal
					title="Delete Application"
					message={`Are you sure you want to delete the application for ${
						application?.program_name || "this program"
					}? This action cannot be undone.`}
					onConfirm={handleConfirmDelete}
					onCancel={() => setIsDeleteModalOpen(false)}
				/>
			</Modal>
		</>
	);
}
