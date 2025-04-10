import { useEffect, useState } from "react";
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
		...initialFilters,
	});

	const [isExpanded, setIsExpanded] = useState(false);

	// Update filters if initialFilters change
	useEffect(() => {
		setFilters((prev) => ({ ...prev, ...initialFilters }));
	}, [initialFilters]);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFilters((prev) => ({ ...prev, [name]: value }));
	};

	const handleResetFilters = () => {
		// Reset to empty values but preserve page_size
		setFilters({
			search: "",
			country: "",
			rank_gte: "",
			rank_lte: "",
			research: "",
			size: "",
			focus: "",
			// Don't set default ordering on reset to show natural order
			page_size: initialFilters.page_size,
		});

		// Apply the reset immediately
		onApplyFilters({
			page_size: initialFilters.page_size,
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Create a clean filter object - only include non-empty values
		const cleanFilters: InstitutionFilters = {};

		if (filters.search) cleanFilters.search = filters.search;
		if (filters.country) cleanFilters.country = filters.country; // Make sure country is correctly passed
		if (filters.rank_gte) cleanFilters.rank_gte = filters.rank_gte;
		if (filters.rank_lte) cleanFilters.rank_lte = filters.rank_lte;
		if (filters.research) cleanFilters.research = filters.research;
		if (filters.size) cleanFilters.size = filters.size;
		if (filters.focus) cleanFilters.focus = filters.focus;
		if (filters.ordering) cleanFilters.ordering = filters.ordering;

		// Preserve page size
		cleanFilters.page_size = initialFilters.page_size;

		console.log("Applying filters to API:", cleanFilters);
		onApplyFilters(cleanFilters);
	};

	return (
		<div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
			<div className="p-4 border-b border-gray-200 dark:border-gray-700">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div className="flex-1">
						<div className="relative">
							<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
								<svg
									className="w-4 h-4 text-gray-500 dark:text-gray-400"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</div>
							<input
								type="search"
								name="search"
								className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="Search by institution name..."
								value={filters.search || ""}
								onChange={handleInputChange}
							/>
						</div>
					</div>
					<button
						type="button"
						onClick={() => setIsExpanded(!isExpanded)}
						className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
					>
						{isExpanded ? "Hide Filters" : "Show Filters"}
						<svg
							className={`w-4 h-4 ml-1 transition-transform duration-200 ${
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
							/>
						</svg>
					</button>

					<select
						name="ordering"
						value={filters.ordering || "rank"}
						onChange={handleInputChange}
						className="text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					>
						<option value="rank">Rank (Ascending)</option>
						<option value="-rank">Rank (Descending)</option>
						<option value="name">Name (A-Z)</option>
						<option value="-name">Name (Z-A)</option>
						<option value="-overall_score">Score (Highest)</option>
						<option value="overall_score">Score (Lowest)</option>
					</select>
				</div>
			</div>

			{isExpanded && (
				<form
					onSubmit={handleSubmit}
					className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
				>
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
							<Label htmlFor="size">Institution Size</Label>
							<select
								id="size"
								name="size"
								className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								value={filters.size || ""}
								onChange={handleInputChange}
							>
								<option value="">All Sizes</option>
								<option value="Extra Large">Extra Large</option>
								<option value="Large">Large</option>
								<option value="Medium">Medium</option>
								<option value="Small">Small</option>
							</select>
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
								<option value="">All Research Levels</option>
								<option value="Very High">Very High</option>
								<option value="High">High</option>
								<option value="Medium">Medium</option>
								<option value="Low">Low</option>
							</select>
						</div>

						<div>
							<Label htmlFor="focus">Institution Focus</Label>
							<select
								id="focus"
								name="focus"
								className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								value={filters.focus || ""}
								onChange={handleInputChange}
							>
								<option value="">All Focus Types</option>
								<option value="Full Comprehensive">Full Comprehensive</option>
								<option value="Comprehensive">Comprehensive</option>
								<option value="Focused">Focused</option>
								<option value="Specialist">Specialist</option>
							</select>
						</div>

						<div className="flex items-end gap-2">
							<div className="flex-1">
								<Label htmlFor="rank_gte">Min Rank</Label>
								<input
									id="rank_gte"
									name="rank_gte"
									type="number"
									min="1"
									className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder="From"
									value={filters.rank_gte || ""}
									onChange={handleInputChange}
								/>
							</div>
							<div className="flex-1">
								<Label htmlFor="rank_lte">Max Rank</Label>
								<input
									id="rank_lte"
									name="rank_lte"
									type="number"
									min="1"
									className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder="To"
									value={filters.rank_lte || ""}
									onChange={handleInputChange}
								/>
							</div>
						</div>
					</div>

					<div className="flex items-center justify-end mt-6 gap-3">
						<button
							type="button"
							onClick={handleResetFilters}
							className="py-2 px-4 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
						>
							Reset
						</button>
						<button
							type="submit"
							disabled={loading}
							className="py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 disabled:opacity-50"
						>
							{loading ? "Applying..." : "Apply Filters"}
						</button>
					</div>
				</form>
			)}
		</div>
	);
}
