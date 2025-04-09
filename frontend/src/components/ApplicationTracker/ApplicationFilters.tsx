import { useState, useEffect } from "react";
import { ApplicationFilterParams } from "../../types/applications";

interface FiltersProps {
	onFilterChange: (filters: ApplicationFilterParams) => void;
	currentFilters: ApplicationFilterParams;
}

export default function ApplicationFilters({
	onFilterChange,
	currentFilters,
}: FiltersProps) {
	const [filters, setFilters] =
		useState<ApplicationFilterParams>(currentFilters);

	// Local state for search input to prevent immediate filtering while typing
	const [searchInput, setSearchInput] = useState(currentFilters.search || "");

	// Update filters when parent filters change
	useEffect(() => {
		setFilters(currentFilters);
		setSearchInput(currentFilters.search || "");
	}, [currentFilters]);

	// Handle filter changes
	const handleFilterChange = (key: string, value: string) => {
		const newFilters = {
			...filters,
			[key]: value === "All" ? undefined : value,
		};
		setFilters(newFilters);
		onFilterChange(newFilters);
	};

	// Handle search input change with debounce
	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchInput(value);

		// Debounce search to avoid excessive filtering while typing
		const timer = setTimeout(() => {
			const newFilters = {
				...filters,
				search: value || undefined,
			};
			setFilters(newFilters);
			onFilterChange(newFilters);
		}, 300);

		return () => clearTimeout(timer);
	};

	// Handle search form submit
	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const newFilters = {
			...filters,
			search: searchInput || undefined,
		};
		setFilters(newFilters);
		onFilterChange(newFilters);
	};

	// Reset all filters
	const resetFilters = () => {
		const emptyFilters = {};
		setFilters(emptyFilters);
		setSearchInput("");
		onFilterChange(emptyFilters);
	};

	return (
		<div className="space-y-4">
			<form
				onSubmit={handleSearchSubmit}
				className="flex w-full items-center gap-2"
			>
				<div className="relative flex-grow">
					<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<svg
							className="h-5 w-5 text-gray-400 dark:text-gray-500"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
					<input
						type="text"
						placeholder="Search applications..."
						className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-400"
						value={searchInput}
						onChange={handleSearchInputChange}
					/>
				</div>
				<button
					type="button"
					onClick={resetFilters}
					className={`rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 ${
						Object.keys(filters).length === 0 ? "opacity-50" : ""
					}`}
					disabled={Object.keys(filters).length === 0}
				>
					Clear
				</button>
			</form>

			<div className="flex flex-wrap items-center gap-2">
				<div className="flex items-center gap-2">
					<label
						htmlFor="status-filter"
						className="text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						Status:
					</label>
					<select
						id="status-filter"
						className="rounded-md border border-gray-300 bg-white py-1.5 pl-3 pr-8 text-sm focus:border-brand-300 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white"
						value={filters.status || "All"}
						onChange={(e) => handleFilterChange("status", e.target.value)}
					>
						<option>All</option>
						<option value="Draft">Draft</option>
						<option value="In Progress">In Progress</option>
						<option value="Submitted">Submitted</option>
						<option value="Interview">Interview</option>
						<option value="Accepted">Accepted</option>
						<option value="Rejected">Rejected</option>
					</select>
				</div>

				<div className="flex items-center gap-2">
					<label
						htmlFor="degree-filter"
						className="text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						Degree:
					</label>
					<select
						id="degree-filter"
						className="rounded-md border border-gray-300 bg-white py-1.5 pl-3 pr-8 text-sm focus:border-brand-300 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white"
						value={filters.degree_type || "All"}
						onChange={(e) => handleFilterChange("degree_type", e.target.value)}
					>
						<option>All</option>
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
		</div>
	);
}
