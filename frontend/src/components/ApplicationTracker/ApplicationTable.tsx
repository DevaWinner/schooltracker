import { useNavigate } from "react-router-dom";
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "../ui/table";

import { useState } from "react";
import { Application, ApplicationFilterParams } from "../../types/applications";
import ApplicationFilters from "./ApplicationFilters";

interface ApplicationTableProps {
	data: Application[];
	isLoading: boolean;
	onFilterChange: (filters: ApplicationFilterParams) => void;
	onRefresh?: () => void;
	onEdit?: (application: Application) => void;
	onDelete?: (id: number) => void;
	onView?: (application: Application) => void;
}

export default function ApplicationTable({
	data,
	isLoading,
	onFilterChange,
	onRefresh,
	onEdit,
	onDelete,
	onView,
}: ApplicationTableProps) {
	const navigate = useNavigate();
	const [filters, setFilters] = useState<ApplicationFilterParams>({});

	const applyFilters = (newFilters: ApplicationFilterParams) => {
		setFilters(newFilters);
		onFilterChange(newFilters);
	};

	const handleEdit = (application: Application) => {
		console.log("Edit button clicked for application:", application.id);
		if (onEdit) onEdit(application);
	};

	const handleDelete = (id: number) => {
		if (onDelete) onDelete(id);
	};

	const handleInstitutionClick = (
		e: React.MouseEvent,
		application: Application
	) => {
		e.stopPropagation(); // Stop row click event from firing
		navigate(`/applications/detail/${application.id}`);
	};

	// Helper function to format dates consistently
	const formatDate = (dateStr?: string | null): string => {
		if (!dateStr) return "Not set";

		try {
			const date = new Date(dateStr);
			if (isNaN(date.getTime())) return "Invalid date";
			return date.toLocaleDateString();
		} catch (error) {
			console.error("Error formatting date:", error);
			return "Error";
		}
	};

	// Skeleton table rows for loading state
	const TableSkeleton = () => (
		<Table>
			<TableHeader className="bg-gray-50 dark:bg-gray-800/50">
				<TableRow>
					<TableCell
						isHeader
						className="whitespace-nowrap px-5 py-4 font-medium text-gray-700 text-start text-theme-sm dark:text-gray-200"
					>
						Institution
					</TableCell>
					<TableCell
						isHeader
						className="whitespace-nowrap px-5 py-4 font-medium text-gray-700 text-start text-theme-sm dark:text-gray-200"
					>
						Program
					</TableCell>
					<TableCell
						isHeader
						className="whitespace-nowrap px-5 py-4 font-medium text-gray-700 text-start text-theme-sm dark:text-gray-200"
					>
						Degree
					</TableCell>
					<TableCell
						isHeader
						className="whitespace-nowrap px-5 py-4 font-medium text-gray-700 text-start text-theme-sm dark:text-gray-200"
					>
						Status
					</TableCell>
					<TableCell
						isHeader
						className="whitespace-nowrap px-5 py-4 font-medium text-gray-700 text-start text-theme-sm dark:text-gray-200"
					>
						Start Date
					</TableCell>
					<TableCell
						isHeader
						className="whitespace-nowrap px-5 py-4 font-medium text-gray-700 text-start text-theme-sm dark:text-gray-200"
					>
						Actions
					</TableCell>
				</TableRow>
			</TableHeader>
			<TableBody>
				{Array(5)
					.fill(0)
					.map((_, index) => (
						<TableRow key={index}>
							<TableCell className="px-5 py-4">
								<div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
							</TableCell>
							<TableCell className="px-5 py-4">
								<div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
							</TableCell>
							<TableCell className="px-5 py-4">
								<div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
							</TableCell>
							<TableCell className="px-5 py-4">
								<div className="h-5 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
							</TableCell>
							<TableCell className="px-5 py-4">
								<div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
							</TableCell>
							<TableCell className="px-5 py-4">
								<div className="flex space-x-3">
									<div className="h-6 w-6 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
									<div className="h-6 w-6 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
								</div>
							</TableCell>
						</TableRow>
					))}
			</TableBody>
		</Table>
	);

	return (
		<>
			<div className="mb-6">
				<ApplicationFilters
					onFilterChange={applyFilters}
					currentFilters={filters}
				/>
			</div>

			{/* Table View (Desktop) */}
			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
				<div className="max-w-full overflow-x-auto">
					{isLoading ? (
						<TableSkeleton />
					) : (
						<Table>
							{/* Table Header */}
							<TableHeader className="bg-gray-50 dark:bg-gray-800/50">
								<TableRow>
									<TableCell
										isHeader
										className="whitespace-nowrap px-5 py-4 font-medium text-gray-700 text-start text-theme-sm dark:text-gray-200"
									>
										Institution
									</TableCell>
									<TableCell
										isHeader
										className="whitespace-nowrap px-5 py-4 font-medium text-gray-700 text-start text-theme-sm dark:text-gray-200"
									>
										Program
									</TableCell>
									<TableCell
										isHeader
										className="whitespace-nowrap px-5 py-4 font-medium text-gray-700 text-start text-theme-sm dark:text-gray-200"
									>
										Degree
									</TableCell>
									<TableCell
										isHeader
										className="whitespace-nowrap px-5 py-4 font-medium text-gray-700 text-start text-theme-sm dark:text-gray-200"
									>
										Status
									</TableCell>
									<TableCell
										isHeader
										className="whitespace-nowrap px-5 py-4 font-medium text-gray-700 text-start text-theme-sm dark:text-gray-200"
									>
										Start Date
									</TableCell>
									<TableCell
										isHeader
										className="whitespace-nowrap px-5 py-4 font-medium text-gray-700 text-start text-theme-sm dark:text-gray-200"
									>
										Actions
									</TableCell>
								</TableRow>
							</TableHeader>

							{/* Table Body */}
							<TableBody>
								{data.length > 0 ? (
									data.map((application) => (
										<tr
											key={application.id}
											className="cursor-pointer border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/30"
										>
											<TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-gray-300">
												<button
													onClick={(e) =>
														handleInstitutionClick(e, application)
													}
													className="text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300 font-medium text-left"
												>
													{application.institution_details?.name ||
														application.institution_name ||
														application.institution ||
														"N/A"}
												</button>
											</TableCell>
											<TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-gray-300">
												{application.program_name}
											</TableCell>
											<TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-gray-300">
												{application.degree_type}
											</TableCell>
											<TableCell className="px-5 py-4 text-theme-sm">
												<span
													className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
														application.status === "Accepted"
															? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
															: application.status === "Rejected"
															? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
															: application.status === "Pending"
															? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
															: application.status === "Deferred"
															? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
															: application.status === "Withdrawn"
															? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
															: application.status === "In Progress"
															? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
															: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
													}`}
												>
													{application.status}
												</span>
											</TableCell>
											<TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-gray-300">
												{formatDate(application.start_date)}
											</TableCell>
											<TableCell className="px-5 py-4 text-theme-sm">
												<div className="flex items-center space-x-8">
													<button
														onClick={(e) => {
															e.stopPropagation();
															// Pass complete application data to edit handler
															handleEdit(application);
														}}
														className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
														title="Edit"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-5 w-5"
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
													</button>
													<button
														onClick={(e) => {
															e.stopPropagation();
															handleDelete(application.id);
														}}
														className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
														title="Delete"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-5 w-5"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
															/>
														</svg>
													</button>
												</div>
											</TableCell>
										</tr>
									))
								) : (
									<TableRow>
										<TableCell className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
											No applications found matching the current filters
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					)}
				</div>
			</div>
		</>
	);
}
