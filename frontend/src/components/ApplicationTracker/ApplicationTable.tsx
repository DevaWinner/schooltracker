import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "../ui/table";

import { useState } from "react";
import {
	Application,
	ApplicationFilterParams,
	ApplicationProps,
} from "../../types/applications";
import ApplicationCard from "./ApplicationCard";
import ApplicationFilters from "./ApplicationFilters";

export default function ApplicationTable({
	data,
	onRefresh,
}: ApplicationProps) {
	const [filters, setFilters] = useState<ApplicationFilterParams>({});

	const handleEdit = (application: Application) => {
		console.log("Edit application:", application);
	};

	const handleDelete = (id: number) => {
		console.log("Delete application:", id);
		if (onRefresh) onRefresh();
	};

	// Filter applications based on current filters
	const filteredData = data.filter((app) => {
		if (filters.status && app.status !== filters.status) return false;
		if (filters.degree_type && app.degree_type !== filters.degree_type)
			return false;

		if (filters.search) {
			const searchTerm = filters.search.toLowerCase();
			const programName = app.program_name?.toLowerCase() || "";
			const department = app.department?.toLowerCase() || "";
			const institutionName =
				app.institution_name?.toLowerCase() ||
				app.institution_details?.name.toLowerCase() ||
				"";

			if (
				!programName.includes(searchTerm) &&
				!department.includes(searchTerm) &&
				!institutionName.includes(searchTerm)
			) {
				return false;
			}
		}

		return true;
	});

	return (
		<>
			<div className="mb-6">
				<ApplicationFilters
					onFilterChange={setFilters}
					currentFilters={filters}
				/>
			</div>

			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
				<div className="max-w-full overflow-x-auto">
					<Table>
						{/* Table Header */}
						<TableHeader className="bg-gray-50 dark:bg-gray-800/50">
							<TableRow>
								<TableCell
									isHeader
									className="whitespace-nowrap px-5 py-4 font-medium text-gray-700 text-start text-theme-sm dark:text-gray-300"
								>
									Institution
								</TableCell>
								<TableCell
									isHeader
									className="whitespace-nowrap px-5 py-4 font-medium text-gray-700 text-start text-theme-sm dark:text-gray-300"
								>
									Program
								</TableCell>
								<TableCell
									isHeader
									className="whitespace-nowrap px-5 py-4 font-medium text-gray-700 text-start text-theme-sm dark:text-gray-300"
								>
									Degree
								</TableCell>
								<TableCell
									isHeader
									className="whitespace-nowrap px-5 py-4 font-medium text-gray-700 text-start text-theme-sm dark:text-gray-300"
								>
									Status
								</TableCell>
								<TableCell
									isHeader
									className="whitespace-nowrap px-5 py-4 font-medium text-gray-700 text-start text-theme-sm dark:text-gray-300"
								>
									Start Date
								</TableCell>
								<TableCell
									isHeader
									className="whitespace-nowrap px-5 py-4 font-medium text-gray-700 text-start text-theme-sm dark:text-gray-300"
								>
									Actions
								</TableCell>
							</TableRow>
						</TableHeader>

						{/* Table Body */}
						<TableBody>
							{filteredData.length > 0 ? (
								filteredData.map((application) => (
									<TableRow key={application.id}>
										<TableCell className="px-5 py-4 text-theme-sm">
											{application.institution_details?.name ||
												application.institution_name ||
												application.institution ||
												"N/A"}
										</TableCell>
										<TableCell className="px-5 py-4 text-theme-sm">
											{application.program_name}
										</TableCell>
										<TableCell className="px-5 py-4 text-theme-sm">
											{application.degree_type}
										</TableCell>
										<TableCell className="px-5 py-4 text-theme-sm">
											<span
												className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
													application.status === "Accepted"
														? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
														: application.status === "Rejected"
														? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
														: application.status === "Interview"
														? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
														: application.status === "Submitted"
														? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
														: application.status === "In Progress"
														? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
														: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
												}`}
											>
												{application.status}
											</span>
										</TableCell>
										<TableCell className="px-5 py-4 text-theme-sm">
											{application.start_date
												? new Date(application.start_date).toLocaleDateString()
												: "Not set"}
										</TableCell>
										<TableCell className="px-5 py-4 text-theme-sm">
											<div className="flex items-center space-x-2">
												<button
													onClick={() => handleEdit(application)}
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
													onClick={() => handleDelete(application.id)}
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
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={6}
										className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
									>
										No applications found matching the current filters
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			{/* Mobile View - Cards */}
			<div className="mt-6 space-y-4 md:hidden">
				{filteredData.length > 0 ? (
					filteredData.map((application) => (
						<ApplicationCard
							key={application.id}
							data={application}
							onEdit={handleEdit}
							onDelete={handleDelete}
							onRefresh={onRefresh}
						/>
					))
				) : (
					<div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-white/[0.05] dark:bg-white/[0.03]">
						<p className="text-gray-500 dark:text-gray-400">
							No applications found matching the current filters
						</p>
					</div>
				)}
			</div>
		</>
	);
}
