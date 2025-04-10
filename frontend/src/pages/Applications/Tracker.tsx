import { useState, useCallback, useEffect } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import AddApplication from "../../components/ApplicationTracker/AddApplication";
import ApplicationTable from "../../components/ApplicationTracker/ApplicationTable";
import ApplicationStats from "../../components/ApplicationTracker/ApplicationStats";
import { Application, ApplicationResponse } from "../../types/applications";
import { Modal } from "../../components/ui/modal";
import EditApplicationModal from "../../components/ApplicationTracker/modals/EditApplicationModal";
import DeleteConfirmationModal from "../../components/ApplicationTracker/modals/DeleteConfirmationModal";
import {
	getApplications,
	updateApplication,
	deleteApplication,
} from "../../api/applications";
import { toast } from "react-toastify";

export default function ApplicationTracker() {
	const [applications, setApplications] = useState<Application[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [currentApplication, setCurrentApplication] =
		useState<Application | null>(null);
	const [pagination, setPagination] = useState({
		count: 0,
		next: null as string | null,
		previous: null as string | null,
	});

	const fetchApplications = async () => {
		setIsLoading(true);
		try {
			const response = await getApplications();
			setApplications(response.results);
			setPagination({
				count: response.count,
				next: response.next,
				previous: response.previous,
			});
		} catch (error) {
			console.error("Error fetching applications:", error);
			toast.error("Failed to load applications");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchApplications();
	}, []);

	const refreshData = useCallback(() => {
		fetchApplications();
	}, []);

	const handleView = useCallback((application: Application) => {
		setCurrentApplication(application);
	}, []);

	const handleEdit = useCallback((application: Application) => {
		setCurrentApplication(application);
		setIsEditModalOpen(true);
	}, []);

	const handleDelete = useCallback(
		(id: number) => {
			// Find the application to delete
			const appToDelete = applications.find((app) => app.id === id);
			if (appToDelete) {
				setCurrentApplication(appToDelete);
				setIsDeleteModalOpen(true);
			}
		},
		[applications]
	);

	const handleSaveEdit = useCallback(
		async (updatedApplication: Application) => {
			try {
				await updateApplication(updatedApplication.id, updatedApplication);

				// Update local state
				setApplications((prevApplications) =>
					prevApplications.map((app) =>
						app.id === updatedApplication.id ? updatedApplication : app
					)
				);

				toast.success("Application updated successfully");
				setIsEditModalOpen(false);
				setCurrentApplication(null);
			} catch (error) {
				console.error("Error updating application:", error);
				toast.error("Failed to update application");
			}
		},
		[]
	);

	const handleConfirmDelete = useCallback(async () => {
		if (!currentApplication) return;

		try {
			await deleteApplication(currentApplication.id);

			// Update local state
			setApplications((prevApplications) =>
				prevApplications.filter((app) => app.id !== currentApplication.id)
			);

			toast.success("Application deleted successfully");
			setIsDeleteModalOpen(false);
			setCurrentApplication(null);
		} catch (error) {
			console.error("Error deleting application:", error);
			toast.error("Failed to delete application");
		}
	}, [currentApplication]);

	return (
		<>
			<PageMeta
				title="Application Tracker | School Tracker"
				description="Application tracking page for School Tracker application"
			/>

			<div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
				<PageBreadcrumb pageTitle="Application Tracker" />
				<AddApplication onRefresh={refreshData} />
			</div>

			<div className="space-y-6">
				<div className="grid grid-cols-1 gap-6 md:grid-cols-12">
					{/* Stats Summary Cards */}
					<div className="md:col-span-12">
						<ApplicationStats applications={applications} />
					</div>

					{/* Applications Table */}
					<div className="md:col-span-12">
						<ComponentCard
							title="Applications"
							className="overflow-hidden"
							headerClassName="border-b border-gray-200 dark:border-gray-700"
							headerRight={
								<button className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
									Export
								</button>
							}
						>
							{isLoading ? (
								<div className="flex h-48 items-center justify-center">
									<div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500"></div>
								</div>
							) : (
								<ApplicationTable
									data={applications}
									onRefresh={refreshData}
									onEdit={handleEdit}
									onDelete={handleDelete}
									onView={handleView}
								/>
							)}
						</ComponentCard>
					</div>
				</div>
			</div>

			{/* Edit Application Modal */}
			<Modal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				className="max-w-[800px] m-4"
			>
				{currentApplication && (
					<EditApplicationModal
						data={currentApplication}
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
						currentApplication?.program_name || "this program"
					}? This action cannot be undone.`}
					onConfirm={handleConfirmDelete}
					onCancel={() => setIsDeleteModalOpen(false)}
				/>
			</Modal>
		</>
	);
}
