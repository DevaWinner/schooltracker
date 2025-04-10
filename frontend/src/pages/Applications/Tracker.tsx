import { useState, useCallback } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import AddApplication from "../../components/ApplicationTracker/AddApplication";
import ApplicationTable from "../../components/ApplicationTracker/ApplicationTable";
import ApplicationStats from "../../components/ApplicationTracker/ApplicationStats";
import { tableData } from "../../components/ApplicationTracker/placeholderData";
import { Application } from "../../types/applications";
import { Modal } from "../../components/ui/modal";
import EditApplicationModal from "../../components/ApplicationTracker/modals/EditApplicationModal";
import DeleteConfirmationModal from "../../components/ApplicationTracker/modals/DeleteConfirmationModal";
import ApplicationDetailModal from "../../components/ApplicationTracker/modals/ApplicationDetailModal";

export default function ApplicationTracker() {
	const [applications, setApplications] = useState(tableData);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [currentApplication, setCurrentApplication] =
		useState<Application | null>(null);

	const refreshData = useCallback(() => {
		// In a real application, this would fetch updated data from an API
		// For now, we'll just use the tableData
		setApplications([...tableData]);
	}, []);

	const handleView = useCallback((application: Application) => {
		setCurrentApplication(application);
		setIsDetailModalOpen(true);
	}, []);

	const handleEdit = useCallback((application: Application) => {
		setCurrentApplication(application);
		setIsEditModalOpen(true);
		setIsDetailModalOpen(false);
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

	const handleSaveEdit = useCallback((updatedApplication: Application) => {
		// In a real app, you would make an API call here
		// For now, update the local state
		setApplications((prevApplications) =>
			prevApplications.map((app) =>
				app.id === updatedApplication.id ? updatedApplication : app
			)
		);
		setIsEditModalOpen(false);
		setCurrentApplication(null);
	}, []);

	const handleConfirmDelete = useCallback(() => {
		if (!currentApplication) return;

		// In a real app, you would make an API call here
		// For now, update the local state
		setApplications((prevApplications) =>
			prevApplications.filter((app) => app.id !== currentApplication.id)
		);
		setIsDeleteModalOpen(false);
		setIsDetailModalOpen(false);
		setCurrentApplication(null);
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
							<ApplicationTable
								data={applications}
								onRefresh={refreshData}
								onEdit={handleEdit}
								onDelete={handleDelete}
								onView={handleView}
							/>
						</ComponentCard>
					</div>
				</div>
			</div>

			{/* Application Detail Modal */}
			<Modal
				isOpen={isDetailModalOpen}
				onClose={() => setIsDetailModalOpen(false)}
				className="max-w-[900px] m-4"
			>
				{currentApplication && (
					<ApplicationDetailModal
						application={currentApplication}
						onClose={() => setIsDetailModalOpen(false)}
						onEdit={handleEdit}
					/>
				)}
			</Modal>

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
