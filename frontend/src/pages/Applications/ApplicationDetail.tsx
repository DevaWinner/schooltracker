import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Application } from "../../types/applications";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import EditApplicationModal from "../../components/ApplicationTracker/modals/EditApplicationModal";
import DeleteConfirmationModal from "../../components/ApplicationTracker/modals/DeleteConfirmationModal";
import { ROUTES } from "../../constants/Routes";
import { getApplicationById } from "../../api/applications";
import { toast } from "react-toastify";
import { useApplications } from "../../context/ApplicationContext";

export default function ApplicationDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [application, setApplication] = useState<Application | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [loading, setLoading] = useState(true);

	const { updateApplicationItem, removeApplication } = useApplications();

	// Always fetch the application from API to ensure we have the latest data
	useEffect(() => {
		const fetchApplication = async () => {
			if (!id) return;

			setLoading(true);
			try {
				// Get fresh data directly from the API
				const data = await getApplicationById(id);
				console.log("Loaded application data:", data);
				setApplication(data);
			} catch (error) {
				console.error("Error fetching application:", error);
				toast.error("Failed to fetch application details");
			} finally {
				setLoading(false);
			}
		};

		fetchApplication();
	}, [id]);

	const handleEdit = () => {
		if (application) {
			console.log("Opening edit modal with application:", application);
			setIsEditModalOpen(true);
		}
	};

	const handleDelete = () => {
		setIsDeleteModalOpen(true);
	};

	const handleSaveEdit = async (updatedApplication: Application) => {
		const result = await updateApplicationItem(
			updatedApplication.id,
			updatedApplication
		);

		if (result) {
			setApplication(result);
			toast.success("Application updated successfully");
			setIsEditModalOpen(false);
		} else {
			toast.error("Failed to update application");
		}
	};

	const handleConfirmDelete = async () => {
		if (!application?.id) return;

		const success = await removeApplication(application.id);

		if (success) {
			toast.success("Application deleted successfully");
			navigate(ROUTES.Applications.tracker);
		} else {
			toast.error("Failed to delete application");
		}
	};

	// Format date for display
	const formatDate = (dateStr?: string | null): string => {
		if (!dateStr) return "Not specified";
		const date = new Date(dateStr);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	// Helper function to get status badge color
	const getStatusColor = (status?: string): string => {
		switch (status) {
			case "Draft":
				return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
			case "In Progress":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200";
			case "Pending":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200";
			case "Accepted":
				return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200";
			case "Rejected":
				return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200";
			case "Deferred":
				return "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200";
			case "Withdrawn":
				return "bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
		}
	};

	// Application detail skeleton loader
	const ApplicationDetailSkeleton = () => (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-3 animate-pulse">
			{/* Main Information Card Skeleton */}
			<div className="lg:col-span-2">
				<div className="rounded-xl border border-gray-200 bg-white overflow-hidden dark:border-gray-700 dark:bg-gray-800">
					{/* Header with Institution Info Skeleton */}
					<div className="relative overflow-hidden bg-gray-50 px-6 py-8 dark:bg-gray-800/80">
						<div className="space-y-3">
							<div className="h-7 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
							<div className="h-5 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
							<div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
							<div className="flex items-center gap-3 mt-2">
								<div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
								<div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
							</div>
						</div>
					</div>

					{/* Program Details Skeleton */}
					<div className="divide-y divide-gray-200 px-6 py-4 dark:divide-gray-700">
						<div className="pb-4">
							<div className="h-6 w-40 rounded bg-gray-200 dark:bg-gray-700 mb-4"></div>
							<div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
								{Array(4)
									.fill(0)
									.map((_, i) => (
										<div key={i}>
											<div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
											<div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
										</div>
									))}
							</div>
						</div>

						<div className="py-4">
							<div className="h-6 w-40 rounded bg-gray-200 dark:bg-gray-700 mb-4"></div>
							<div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
								{Array(2)
									.fill(0)
									.map((_, i) => (
										<div key={i}>
											<div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
											<div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
										</div>
									))}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Sidebar Cards Skeleton */}
			<div className="space-y-6">
				{/* Links Card Skeleton */}
				<div className="rounded-xl border border-gray-200 bg-white overflow-hidden dark:border-gray-700 dark:bg-gray-800">
					<div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
						<div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
					</div>
					<div className="px-6 py-4 space-y-4">
						{Array(2)
							.fill(0)
							.map((_, i) => (
								<div key={i}>
									<div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700 mb-1"></div>
									<div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700"></div>
								</div>
							))}
					</div>
				</div>

				{/* Meta Info Card Skeleton */}
				<div className="rounded-xl border border-gray-200 bg-white overflow-hidden dark:border-gray-700 dark:bg-gray-800">
					<div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
						<div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
					</div>
					<div className="px-6 py-4 space-y-3">
						{Array(2)
							.fill(0)
							.map((_, i) => (
								<div key={i}>
									<div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700 mb-1"></div>
									<div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
								</div>
							))}
					</div>
				</div>
			</div>
		</div>
	);

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-6">
				<div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
					<div className="h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
					<div className="flex gap-3">
						<div className="h-9 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
						<div className="h-9 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
						<div className="h-9 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
					</div>
				</div>
				<ApplicationDetailSkeleton />
			</div>
		);
	}

	if (!application) {
		return (
			<div className="flex h-full items-center justify-center p-6">
				<div className="text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-900/20 dark:text-red-400">
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
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</div>
					<h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
						Application Not Found
					</h3>
					<p className="mb-6 text-gray-600 dark:text-gray-400">
						The application you're looking for doesn't exist or has been
						removed.
					</p>
					<Button onClick={() => navigate(ROUTES.Applications.tracker)}>
						Back to Applications
					</Button>
				</div>
			</div>
		);
	}

	return (
		<>
			<PageMeta
				title={`${application.program_name} | School Tracker`}
				description={`Details for ${application.program_name} at ${
					application.institution_details?.name || application.institution
				}`}
			/>

			<div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
				<PageBreadcrumb pageTitle={application.program_name} />
				<div className="flex gap-3">
					<Button
						size="sm"
						variant="outline"
						onClick={() => navigate(ROUTES.Applications.tracker)}
					>
						Back to Applications
					</Button>
					<Button size="sm" variant="outline" onClick={handleEdit}>
						Edit
					</Button>
					<Button
						size="sm"
						variant="danger"
						onClick={handleDelete}
						className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-800 dark:text-red-50 dark:hover:bg-red-700 dark:border-red-700"
					>
						Delete
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Main Information Card */}
				<div className="lg:col-span-2">
					<div className="rounded-xl border border-gray-200 bg-white overflow-hidden dark:border-gray-700 dark:bg-gray-800">
						{/* Header with Institution Info */}
						<div className="relative overflow-hidden bg-gray-50 px-6 py-8 dark:bg-gray-800/80">
							<div className="relative z-10">
								<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
									{application.program_name}
								</h1>
								<div className="mt-2 flex items-center gap-2">
									<span className="text-lg text-gray-600 dark:text-gray-300">
										{application.institution_details?.name ||
											application.institution}
									</span>
									{application.institution_details?.rank && (
										<span className="rounded-md bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
											Rank #{application.institution_details.rank}
										</span>
									)}
								</div>
								<p className="mt-1 text-gray-500 dark:text-gray-400">
									{application.institution_country ||
										application.institution_details?.country}
								</p>
								<div className="mt-4 flex items-center gap-3">
									<span
										className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${getStatusColor(
											application.status
										)}`}
									>
										{application.status}
									</span>
									<span className="text-sm font-medium text-gray-500 dark:text-gray-400">
										{application.degree_type} Program
									</span>
								</div>
							</div>
						</div>

						{/* Program Details */}
						<div className="divide-y divide-gray-200 px-6 py-4 dark:divide-gray-700">
							<div className="pb-4">
								<h2 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
									Program Details
								</h2>
								<dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
									<div>
										<dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Department
										</dt>
										<dd className="text-sm text-gray-900 dark:text-white">
											{application.department || "Not specified"}
										</dd>
									</div>
									<div>
										<dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Program Start Date
										</dt>
										<dd className="text-sm text-gray-900 dark:text-white">
											{formatDate(application.start_date)}
										</dd>
									</div>
									<div>
										<dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Duration
										</dt>
										<dd className="text-sm text-gray-900 dark:text-white">
											{application.duration_years
												? `${application.duration_years} years`
												: "Not specified"}
										</dd>
									</div>
									<div>
										<dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Annual Tuition
										</dt>
										<dd className="text-sm text-gray-900 dark:text-white">
											{application.tuition_fee
												? `$${application.tuition_fee.toLocaleString()}`
												: "Not specified"}
										</dd>
									</div>
								</dl>
							</div>

							{/* Application Timeline */}
							<div className="py-4">
								<h2 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
									Application Timeline
								</h2>
								<dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
									<div>
										<dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Submitted Date
										</dt>
										<dd className="text-sm text-gray-900 dark:text-white">
											{formatDate(application.submitted_date)}
										</dd>
									</div>
									<div>
										<dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Decision Date
										</dt>
										<dd className="text-sm text-gray-900 dark:text-white">
											{formatDate(application.decision_date)}
										</dd>
									</div>
								</dl>
							</div>

							{/* Notes Section */}
							{application.notes && (
								<div className="py-4">
									<h2 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
										Notes
									</h2>
									<div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700 dark:bg-gray-700/50 dark:text-gray-300">
										{application.notes}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Sidebar Cards */}
				<div className="space-y-6">
					{/* Important Links Card */}
					<div className="rounded-xl border border-gray-200 bg-white overflow-hidden dark:border-gray-700 dark:bg-gray-800">
						<div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
							<h2 className="text-lg font-medium text-gray-900 dark:text-white">
								Important Links
							</h2>
						</div>
						<div className="px-6 py-4 space-y-4">
							{application.application_link && (
								<div>
									<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
										Application Portal
									</h3>
									<a
										href={application.application_link}
										target="_blank"
										rel="noopener noreferrer"
										className="mt-1 block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
									>
										{application.application_link}
									</a>
								</div>
							)}

							{application.program_info_link && (
								<div>
									<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
										Program Information
									</h3>
									<a
										href={application.program_info_link}
										target="_blank"
										rel="noopener noreferrer"
										className="mt-1 block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
									>
										{application.program_info_link}
									</a>
								</div>
							)}

							{application.scholarship_link && (
								<div>
									<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
										Scholarship Information
									</h3>
									<a
										href={application.scholarship_link}
										target="_blank"
										rel="noopener noreferrer"
										className="mt-1 block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
									>
										{application.scholarship_link}
									</a>
								</div>
							)}

							{!application.application_link &&
								!application.program_info_link &&
								!application.scholarship_link && (
									<p className="text-sm text-gray-500 dark:text-gray-400">
										No links have been added for this application.
									</p>
								)}
						</div>
					</div>

					{/* School Information Card */}
					{application.institution_details && (
						<div className="rounded-xl border border-gray-200 bg-white overflow-hidden dark:border-gray-700 dark:bg-gray-800">
							<div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
								<h2 className="text-lg font-medium text-gray-900 dark:text-white">
									Institution Details
								</h2>
							</div>
							<div className="px-6 py-4 space-y-4">
								<div>
									<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
										Country
									</h3>
									<p className="mt-1 text-sm text-gray-900 dark:text-white">
										{application.institution_details.country}
									</p>
								</div>
								{application.institution_details.overall_score && (
									<div>
										<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
											Overall Score
										</h3>
										<p className="mt-1 text-sm text-gray-900 dark:text-white">
											{application.institution_details.overall_score}
										</p>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Application Meta Info */}
					<div className="rounded-xl border border-gray-200 bg-white overflow-hidden dark:border-gray-700 dark:bg-gray-800">
						<div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
							<h2 className="text-lg font-medium text-gray-900 dark:text-white">
								Meta Information
							</h2>
						</div>
						<div className="px-6 py-4">
							<dl className="space-y-3">
								<div>
									<dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
										Created
									</dt>
									<dd className="text-sm text-gray-900 dark:text-white">
										{new Date(application.created_at).toLocaleDateString(
											"en-US",
											{
												year: "numeric",
												month: "short",
												day: "numeric",
											}
										)}
									</dd>
								</div>
								<div>
									<dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
										Last Updated
									</dt>
									<dd className="text-sm text-gray-900 dark:text-white">
										{new Date(application.updated_at).toLocaleDateString(
											"en-US",
											{
												year: "numeric",
												month: "short",
												day: "numeric",
											}
										)}
									</dd>
								</div>
							</dl>
						</div>
					</div>
				</div>
			</div>

			{/* Edit Modal */}
			<Modal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				className="max-w-[800px] m-4"
			>
				<EditApplicationModal
					data={application}
					onSave={handleSaveEdit}
					onClose={() => setIsEditModalOpen(false)}
				/>
			</Modal>

			{/* Delete Confirmation Modal */}
			<Modal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				className="max-w-[500px] m-4"
			>
				<DeleteConfirmationModal
					title="Delete Application"
					message={`Are you sure you want to delete the application for ${application.program_name}? This action cannot be undone.`}
					onConfirm={handleConfirmDelete}
					onCancel={() => setIsDeleteModalOpen(false)}
				/>
			</Modal>
		</>
	);
}
