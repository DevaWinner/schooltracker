import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import InstitutionFilter from "../../components/Directory/InstitutionFilter";
import Pagination from "../../components/Directory/Pagination";
import { getInstitutions, getCountries } from "../../api/institutions";
import { Institution, InstitutionFilters } from "../../types/institutions";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { toast } from "react-toastify";

const DEFAULT_PAGE_SIZE = 10;

export default function SchoolSearch() {
	// State management
	const [institutions, setInstitutions] = useState<Institution[]>([]);
	const [loading, setLoading] = useState(true);
	const [totalCount, setTotalCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [countries, setCountries] = useState<string[]>([]);
	const [filters, setFilters] = useState<InstitutionFilters>({
		page: 1,
		page_size: DEFAULT_PAGE_SIZE,
		ordering: "rank",
	});

	// Initial data loading
	useEffect(() => {
		const loadCountries = async () => {
			try {
				const countryList = await getCountries();
				setCountries(countryList);
			} catch (error) {
				console.error("Failed to load countries:", error);
			}
		};

		loadCountries();
		fetchInstitutions();
	}, []);

	// Fetch institutions when filters change
	useEffect(() => {
		fetchInstitutions();
	}, [currentPage, filters.page_size, filters.ordering]);

	const fetchInstitutions = async () => {
		setLoading(true);
		try {
			const currentFilters = {
				...filters,
				page: currentPage,
				page_size: filters.page_size, // Explicitly ensure page_size is included
			};

			const data = await getInstitutions(currentFilters);
			setInstitutions(data.results);
			setTotalCount(data.count);
		} catch (error: any) {
			toast.error(error.message || "Failed to load institutions");
			setInstitutions([]);
		} finally {
			setLoading(false);
		}
	};

	const handleApplyFilters = (newFilters: InstitutionFilters) => {
		setCurrentPage(1);
		setFilters({
			...newFilters,
			page_size: filters.page_size,
			ordering: newFilters.ordering || filters.ordering,
		});

		setTimeout(fetchInstitutions, 0);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newPageSize = Number(e.target.value);
		// Set page back to 1 when changing page size
		setCurrentPage(1);
		// Update filters with new page size
		setFilters((prev) => ({
			...prev,
			page_size: newPageSize,
		}));

		// Force fetch with new page size
		setTimeout(() => {
			fetchInstitutions();
		}, 0);
	};

	const totalPages = Math.ceil(totalCount / filters.page_size);

	return (
		<>
			<PageMeta
				title="Institution Directory | School Tracker"
				description="Browse and search educational institutions worldwide"
			/>

			<PageBreadcrumb pageTitle="Institution Directory" />

			<div className="container mx-auto space-y-6 pb-12">
				{/* Intro section */}
				<div className="mb-6">
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						Browse Institutions
					</h1>
					<p className="mt-2 text-gray-600 dark:text-gray-400">
						Explore educational institutions from around the world and find
						detailed information about their rankings and performance metrics.
					</p>
				</div>

				{/* Filters section */}
				<InstitutionFilter
					onApplyFilters={handleApplyFilters}
					countries={countries}
					loading={loading}
					initialFilters={filters}
				/>

				{/* Results info section */}
				<div className="flex flex-wrap items-center justify-between gap-4 mb-4">
					<div className="text-sm text-gray-600 dark:text-gray-400">
						{loading ? (
							"Loading institutions..."
						) : (
							<>
								Showing {institutions.length} of {totalCount} institutions
								{filters.search && ` matching "${filters.search}"`}
							</>
						)}
					</div>

					<div className="flex items-center gap-2">
						<label
							htmlFor="pageSize"
							className="text-sm text-gray-600 dark:text-gray-400"
						>
							Results per page:
						</label>
						<select
							id="pageSize"
							value={filters.page_size}
							onChange={handlePageSizeChange}
							className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-800"
						>
							<option value={10}>10</option>
							<option value={20}>20</option>
							<option value={50}>50</option>
							<option value={100}>100</option>
						</select>
					</div>
				</div>

				{/* Loading state */}
				{loading && (
					<div className="flex h-64 items-center justify-center">
						<div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
					</div>
				)}

				{/* No results state */}
				{!loading && institutions.length === 0 && (
					<div className="flex h-64 flex-col items-center justify-center rounded-lg bg-white px-4 py-8 text-center shadow-sm dark:bg-gray-800">
						<svg
							className="mb-4 h-16 w-16 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
							No institutions found
						</h3>
						<p className="text-gray-600 dark:text-gray-400">
							Try adjusting your search criteria or filters
						</p>
					</div>
				)}

				{/* Results Table */}
				{!loading && institutions.length > 0 && (
					<div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
						<table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
							<thead className="bg-gray-50 dark:bg-gray-700">
								<tr>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
									>
										Rank
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
									>
										Institution
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
									>
										Country
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
									>
										Score
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
									>
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
								{institutions.map((institution, index) => (
									<tr
										key={institution.id}
										className={`hover:bg-gray-50 transition duration-150 dark:hover:bg-gray-700 ${
											index % 2 === 0
												? "bg-white dark:bg-gray-800"
												: "bg-gray-50 dark:bg-gray-800/50"
										}`}
									>
										<td className="whitespace-nowrap px-6 py-4">
											<div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20">
												<span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
													{institution.rank}
												</span>
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="text-sm font-medium text-gray-900 dark:text-white">
												{institution.name}
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="text-sm text-gray-500 dark:text-gray-400">
												{institution.country}
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
												{institution.overall_score}
											</div>
										</td>
										<td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
											<Link
												to={`/directory/institution/${institution.id}`}
												className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
											>
												View Details
											</Link>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="mt-6">
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
						/>
					</div>
				)}
			</div>
		</>
	);
}
