import { useEffect, useState, useCallback } from "react";
import { InstitutionFilters } from "../../types/institutions";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";


interface FiltersProps {
	onApplyFilters: (filters: InstitutionFilters) => void;
	countries: string[];
	loading: boolean;
	initialFilters?: InstitutionFilters;
}

export default function InstitutionFilter({
	onApplyFilters,
	countries,
	loading,
	initialFilters = {},
}: FiltersProps) {
	const [filters, setFilters] = useState<InstitutionFilters>({
		search: "",
		country: "",
		rank_gte: "",
		rank_lte: "",
		research: "",
		size: "",
		focus: "",
		ordering: "",
		...initialFilters,
	});

	const [isExpanded, setIsExpanded] = useState(false);
	const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
		null
	);

	// Update filters if initialFilters change
	useEffect(() => {
		setFilters((prev) => ({ ...prev, ...initialFilters }));
	}, [initialFilters]);

	// Debounce search input to avoid excessive API calls
	const debounceSearch = useCallback(
		(value: string) => {
			if (searchTimeout) {
				clearTimeout(searchTimeout);
			}

			const timeout = setTimeout(() => {
				onApplyFilters({
					...filters,
					search: value,
					// Don't include page to reset to first page when searching
				});
			}, 500); // 500ms delay

			setSearchTimeout(timeout);
		},
		[filters, onApplyFilters]
	);

	// Handle input changes
	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;

		// Update local state
		setFilters((prev) => ({ ...prev, [name]: value }));

		// Apply immediately for search and ordering
		if (name === "search") {
			debounceSearch(value);
		} else if (name === "ordering") {
			// Apply ordering changes immediately
			onApplyFilters({
				...filters,
				ordering: value,
			});
		}
	};

	const handleResetFilters = () => {
		// Reset all filters except page_size
		const resetFilters = {
			search: "",
			country: "",
			rank_gte: "",
			rank_lte: "",
			research: "",
			size: "",
			focus: "",
			ordering: "",
			page_size: initialFilters.page_size,
		};

		setFilters(resetFilters);
		onApplyFilters(resetFilters);
		setIsExpanded(false);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onApplyFilters(filters);
	};

	return (
		<div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
			{/* Search bar - always visible */}
			<form
				className="flex flex-col md:flex-row px-5 py-5"
				onSubmit={handleSubmit}
			>
				<div className="flex-grow mb-3 md:mb-0 md:mr-3">
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<svg
								className="w-5 h-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								></path>
							</svg>
						</div>
						<Input
							type="text"
							name="search"
							placeholder="Search institutions..."
							className="pl-10"
							value={filters.search}
							onChange={handleInputChange}
						/>
					</div>
				</div>

				{/* Ordering dropdown - always visible */}
				<div className="mb-3 md:mb-0 md:mr-3 md:w-48">
					<select
						name="ordering"
						value={filters.ordering || ""}
						onChange={handleInputChange}
						className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					>
						<option value="">Sort by...</option>
						<option value="rank">Rank (Low to High)</option>
						<option value="-rank">Rank (High to Low)</option>
						<option value="name">Name (A-Z)</option>
						<option value="-name">Name (Z-A)</option>
						<option value="country">Country (A-Z)</option>
						<option value="-country">Country (Z-A)</option>
						<option value="-overall_score">Score (High to Low)</option>
						<option value="overall_score">Score (Low to High)</option>
					</select>
				</div>

				<div className="flex items-center">
					<Button
						type="button"
						onClick={() => setIsExpanded(!isExpanded)}
						variant="outline"
						className="mr-2"
					>
						{isExpanded ? "Hide Filters" : "More Filters"}
						<svg
							className={`ml-1 w-4 h-4 transition-transform ${
								isExpanded ? "rotate-180" : ""
							}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M19 9l-7 7-7-7"
							></path>
						</svg>
					</Button>
					<Button type="submit" disabled={loading}>
						Search
					</Button>
				</div>
			</form>

			{/* Advanced filters - expandable */}
			{isExpanded && (
				<div className="p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
					<div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						<div>
							<Label htmlFor="country">Country</Label>
							<select
								id="country"
								name="country"
								className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								value={filters.country || ""}
								onChange={handleInputChange}
							>
								<option value="">All Countries</option>
								{countries.map((country) => (
									<option key={country} value={country}>
										{country}
									</option>
								))}
							</select>
						</div>

						<div>
							<Label htmlFor="rank_gte">Minimum Rank</Label>
							<Input
								type="number"
								id="rank_gte"
								name="rank_gte"
								placeholder="Min"
								value={filters.rank_gte}
								onChange={handleInputChange}
							/>
						</div>

						<div>
							<Label htmlFor="rank_lte">Maximum Rank</Label>
							<Input
								type="number"
								id="rank_lte"
								name="rank_lte"
								placeholder="Max"
								value={filters.rank_lte}
								onChange={handleInputChange}
							/>
						</div>

						<div>
							<Label htmlFor="research">Research Level</Label>
							<select
								id="research"
								name="research"
								className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								value={filters.research || ""}
								onChange={handleInputChange}
							>
								<option value="">Any</option>
								<option value="High">High</option>
								<option value="Medium">Medium</option>
								<option value="Low">Low</option>
							</select>
						</div>

						<div>
							<Label htmlFor="size">Size</Label>
							<select
								id="size"
								name="size"
								className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								value={filters.size || ""}
								onChange={handleInputChange}
							>
								<option value="">Any</option>
								<option value="Large">Large</option>
								<option value="Medium">Medium</option>
								<option value="Small">Small</option>
							</select>
						</div>

						<div>
							<Label htmlFor="focus">Focus</Label>
							<select
								id="focus"
								name="focus"
								className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								value={filters.focus || ""}
								onChange={handleInputChange}
							>
								<option value="">Any</option>
								<option value="Comprehensive">Comprehensive</option>
								<option value="Specialized">Specialized</option>
								<option value="Focused">Focused</option>
							</select>
						</div>
					</div>

					<div className="mt-6 flex justify-end gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={handleResetFilters}
						>
							Reset Filters
						</Button>
						<Button
							type="button"
							onClick={() => onApplyFilters(filters)}
							disabled={loading}
						>
							Apply Filters
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
