import { useState, useCallback } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import AddApplication from "../../components/ApplicationTracker/AddApplication";
import ApplicationTable from "../../components/ApplicationTracker/ApplicationTable";
import { Application, ApplicationFilterParams } from "../../types/applications";
import { Modal } from "../../components/ui/modal";
import EditApplicationModal from "../../components/ApplicationTracker/modals/EditApplicationModal";
import DeleteConfirmationModal from "../../components/ApplicationTracker/modals/DeleteConfirmationModal";
import { useApplications } from "../../context/ApplicationContext";
import { loadApplicationById } from "../../utils/applicationUtils";

export default function ApplicationTracker() {
	const {
		filteredApplications,
		isLoading,
		filterApplications,
		updateApplicationItem,
		removeApplication,
		fetchApplications,
	} = useApplications();

	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [currentApplication, setCurrentApplication] =
		useState<Application | null>(null);

	const refreshData = useCallback(() => {
		// Force refresh from API
		fetchApplications(true);
	}, [fetchApplications]);

	const handleFiltersChange = useCallback(
		(filters: ApplicationFilterParams) => {
			filterApplications(filters);
		},
		[filterApplications]
	);

	const handleView = useCallback((application: Application) => {
		setCurrentApplication(application);
	}, []);

	const handleEdit = useCallback(async (application: Application) => {
		try {
			// Fetch complete application data before opening the modal
			const completeData = await loadApplicationById(application.id);

			if (completeData) {
				console.log(
					"Loaded complete application data for editing:",
					completeData
				);
				setCurrentApplication(completeData);
			} else {
				// Fallback to the passed application if fetch fails
				console.log("Using passed application data:", application);
				setCurrentApplication(application);
			}

			setIsEditModalOpen(true);
		} catch (error) {
			console.error("Error preparing application for edit:", error);
			toast.error("Failed to load application details");
		}
	}, []);

	const handleDelete = useCallback(
		(id: number) => {
			// Find the application to delete
			const appToDelete = filteredApplications.find((app) => app.id === id);
			if (appToDelete) {
				setCurrentApplication(appToDelete);
				setIsDeleteModalOpen(true);
			}
		},
		[filteredApplications]
	);

	const handleSaveEdit = useCallback(
		async (updatedApplication: Application) => {
			const result = await updateApplicationItem(
				updatedApplication.id,
				updatedApplication
			);

			if (result) {
				setIsEditModalOpen(false);
				setCurrentApplication(null);
			}
		},
		[updateApplicationItem]
	);

	const handleConfirmDelete = useCallback(async () => {
		if (!currentApplication) return;

		const success = await removeApplication(currentApplication.id);

		if (success) {
			setIsDeleteModalOpen(false);
			setCurrentApplication(null);
		}
	}, [currentApplication, removeApplication]);

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
				{/* Applications Table */}
				<div>
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
						<ApplicationTable
							data={filteredApplications}
							isLoading={isLoading}
							onFilterChange={handleFiltersChange}
							onRefresh={refreshData}
							onEdit={handleEdit}
							onDelete={handleDelete}
							onView={handleView}
						/>
					</ComponentCard>
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
