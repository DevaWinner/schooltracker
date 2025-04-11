import { useState } from "react";
import { ApplicationFilterParams } from "../../types/applications";

interface ApplicationFiltersProps {
	onFilterChange: (filters: ApplicationFilterParams) => void;
	currentFilters: ApplicationFilterParams;
}

export default function ApplicationFilters({
	onFilterChange,
	currentFilters,
}: ApplicationFiltersProps) {
	const [localFilters, setLocalFilters] =
		useState<ApplicationFilterParams>(currentFilters);

	const handleFilterChange = (key: string, value: string) => {
		const updatedFilters = { ...localFilters, [key]: value };
		setLocalFilters(updatedFilters);
		onFilterChange(updatedFilters);
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const updatedFilters = { ...localFilters, search: e.target.value };
		setLocalFilters(updatedFilters);
		onFilterChange(updatedFilters);
	};

	const clearFilters = () => {
		const emptyFilters = {
			status: "",
			degree_type: "",
			search: "",
		};
		setLocalFilters(emptyFilters);
		onFilterChange(emptyFilters);
	};

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm border border-gray-100 dark:border-gray-700">
			<div className="flex flex-wrap items-center gap-4">
				<div className="w-full flex items-center justify-between mb-2">
					<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
						Filter Applications
					</h3>
					{(localFilters.status ||
						localFilters.degree_type ||
						localFilters.search) && (
						<button
							onClick={clearFilters}
							className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
						>
							Clear Filters
						</button>
					)}
				</div>

				<div className="flex-grow flex flex-wrap gap-6 md:gap-8">
					{/* Status Filter */}
					<div className="w-full sm:w-40">
						<label
							htmlFor="status-filter"
							className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"
						>
							Status
						</label>
						<select
							id="status-filter"
							value={localFilters.status || ""}
							onChange={(e) => handleFilterChange("status", e.target.value)}
							className="w-full rounded-lg border border-gray-300 text-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
						>
							<option value="">All Statuses</option>
							<option value="Draft">Draft</option>
							<option value="In Progress">In Progress</option>
							<option value="Submitted">Submitted</option>
							<option value="Interview">Interview</option>
							<option value="Accepted">Accepted</option>
							<option value="Rejected">Rejected</option>
						</select>
					</div>

					{/* Degree Type Filter */}
					<div className="w-full sm:w-40">
						<label
							htmlFor="degree-filter"
							className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"
						>
							Degree Type
						</label>
						<select
							id="degree-filter"
							value={localFilters.degree_type || ""}
							onChange={(e) =>
								handleFilterChange("degree_type", e.target.value)
							}
							className="w-full rounded-lg border border-gray-300 text-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
						>
							<option value="">All Degrees</option>
							<option value="Associate">Associate</option>
							<option value="Bachelor">Bachelor</option>
							<option value="Master">Master</option>
							<option value="PhD">PhD</option>
							<option value="Certificate">Certificate</option>
							<option value="Diploma">Diploma</option>
							<option value="Other">Other</option>
						</select>
					</div>
				</div>

				{/* Search Field - Right-justified */}
				<div className="w-full sm:w-64 sm:ml-auto mt-2 sm:mt-0">
					<label
						htmlFor="application-search"
						className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"
					>
						Search
					</label>
					<div className="relative">
						<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<svg
								className="h-4 w-4 text-gray-500 dark:text-gray-400"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 20 20"
							>
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
								/>
							</svg>
						</div>
						<input
							id="application-search"
							type="search"
							value={localFilters.search || ""}
							onChange={handleSearchChange}
							className="block w-full rounded-lg border border-gray-300 bg-white p-2 pl-10 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							placeholder="Search applications..."
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
