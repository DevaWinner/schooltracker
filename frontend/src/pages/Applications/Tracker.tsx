import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import AddApplication from "../../components/ApplicationTracker/AddApplication";
import ApplicationTable from "../../components/ApplicationTracker/ApplicationTable";
import {
	Application,
	ApplicationFilterParams,
} from "../../interfaces/applications";
import EditApplicationModal from "../../components/ApplicationTracker/modals/EditApplicationModal";
import DeleteConfirmationModal from "../../components/ApplicationTracker/modals/DeleteConfirmationModal";
import { useApplications } from "../../context/ApplicationContext";
import {
	loadApplicationById,
	updateApplicationCache,
} from "../../utils/applicationUtils";

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
	const [isLoadingApplication, setIsLoadingApplication] = useState(false);

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
		// Cache the application data to avoid extra API calls
		updateApplicationCache(application);
		setCurrentApplication(application);
	}, []);

	const handleEdit = useCallback(async (application: Application) => {
		// Show modal immediately with initial application data
		setCurrentApplication(application);
		setIsEditModalOpen(true);

		// Then fetch complete data in the background
		setIsLoadingApplication(true);

		try {
			// Fetch complete application data
			const completeData = await loadApplicationById(application.id);

			if (completeData) {
				setCurrentApplication(completeData);
			}
		} catch (error) {
			toast.error("Failed to load complete application details");
			// Modal stays open with partial data
		} finally {
			setIsLoadingApplication(false);
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
		if (!currentApplication)
			return { success: false, message: "No application selected" };

		const result = await removeApplication(currentApplication.id);

		if (result.success) {
			setIsDeleteModalOpen(false);
			setCurrentApplication(null);
		}

		return result;
	}, [currentApplication, removeApplication]);

	const handleExport = useCallback(() => {
		try {
			// Simple CSV export of filtered applications
			if (filteredApplications.length === 0) {
				toast.info("No applications to export");
				return;
			}

			// Get headers from first application
			const headers = Object.keys(filteredApplications[0])
				.filter((key) => key !== "onRefresh" && key !== "institution_details")
				.join(",");

			// Convert each application to CSV format
			const csvRows = filteredApplications.map((app) => {
				return Object.entries(app)
					.filter(
						([key]) => key !== "onRefresh" && key !== "institution_details"
					)
					.map(([_, value]) => {
						// Handle values that might contain commas
						if (
							typeof value === "string" &&
							(value.includes(",") || value.includes("\n"))
						) {
							return `"${value.replace(/"/g, '""')}"`;
						}
						return value || "";
					})
					.join(",");
			});

			// Combine headers and rows
			const csvContent = [headers, ...csvRows].join("\n");

			// Create blob and download
			const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.setAttribute("href", url);
			link.setAttribute(
				"download",
				`applications_export_${new Date().toISOString().slice(0, 10)}.csv`
			);
			link.style.visibility = "hidden";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			toast.success("Applications exported successfully");
		} catch (error) {
			toast.error("Failed to export applications");
		}
	}, [filteredApplications]);

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
							<button
								onClick={handleExport}
								className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
							>
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
			{currentApplication && (
				<EditApplicationModal
					isOpen={isEditModalOpen}
					data={currentApplication}
					onSave={handleSaveEdit}
					onClose={() => setIsEditModalOpen(false)}
					isLoading={isLoadingApplication}
				/>
			)}

			{/* Delete Confirmation Modal - Now directly using the modal component */}
			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				title="Delete Application"
				message={`Are you sure you want to delete the application for ${
					currentApplication?.program_name || "this program"
				}? This action cannot be undone.`}
				onConfirm={handleConfirmDelete}
				onCancel={() => setIsDeleteModalOpen(false)}
			/>
		</>
	);
}
