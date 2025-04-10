interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export default function Pagination({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationProps) {
	// Generate an array of page numbers to display
	const getPageNumbers = () => {
		const pages = [];
		const maxPagesToShow = 5;

		let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
		let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

		// Adjust if we're near the end
		if (endPage - startPage + 1 < maxPagesToShow) {
			startPage = Math.max(1, endPage - maxPagesToShow + 1);
		}

		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}

		return pages;
	};

	// Show text with pagination info when there are too many pages
	const renderPaginationInfo = () => {
		if (totalPages > 10) {
			return (
				<span className="text-sm text-gray-500 dark:text-gray-400 mx-2">
					Page {currentPage} of {totalPages}
				</span>
			);
		}
		return null;
	};

	// If there are no pages, don't render anything
	if (totalPages <= 0) return null;

	return (
		<div className="flex flex-wrap justify-center items-center">
			{renderPaginationInfo()}

			<nav className="flex items-center -space-x-px">
				{/* First Page */}
				<button
					onClick={() => onPageChange(1)}
					disabled={currentPage === 1}
					className={`relative inline-flex items-center px-2 py-2 rounded-l-lg border ${
						currentPage === 1
							? "border-gray-300 bg-white text-gray-300 cursor-not-allowed dark:bg-gray-800 dark:border-gray-600"
							: "border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
					}`}
					aria-label="First page"
				>
					<span className="sr-only">First page</span>
					<svg
						className="w-5 h-5"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
							clipRule="evenodd"
						/>
					</svg>
				</button>

				{/* Previous Page */}
				<button
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className={`relative inline-flex items-center px-2 py-2 border ${
						currentPage === 1
							? "border-gray-300 bg-white text-gray-300 cursor-not-allowed dark:bg-gray-800 dark:border-gray-600"
							: "border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
					}`}
					aria-label="Previous page"
				>
					<span className="sr-only">Previous page</span>
					<svg
						className="w-5 h-5"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
							clipRule="evenodd"
						/>
					</svg>
				</button>

				{/* Page Numbers */}
				{getPageNumbers().map((page) => (
					<button
						key={page}
						onClick={() => onPageChange(page)}
						aria-current={currentPage === page ? "page" : undefined}
						className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
							currentPage === page
								? "z-10 border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-400"
								: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
						}`}
					>
						{page}
					</button>
				))}

				{/* Next Page */}
				<button
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					className={`relative inline-flex items-center px-2 py-2 border ${
						currentPage === totalPages
							? "border-gray-300 bg-white text-gray-300 cursor-not-allowed dark:bg-gray-800 dark:border-gray-600"
							: "border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
					}`}
					aria-label="Next page"
				>
					<span className="sr-only">Next page</span>
					<svg
						className="w-5 h-5"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
							clipRule="evenodd"
						/>
					</svg>
				</button>

				{/* Last Page */}
				<button
					onClick={() => onPageChange(totalPages)}
					disabled={currentPage === totalPages}
					className={`relative inline-flex items-center px-2 py-2 rounded-r-lg border ${
						currentPage === totalPages
							? "border-gray-300 bg-white text-gray-300 cursor-not-allowed dark:bg-gray-800 dark:border-gray-600"
							: "border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
					}`}
					aria-label="Last page"
				>
					<span className="sr-only">Last page</span>
					<svg
						className="w-5 h-5"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 000 1.414zm6 0a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L14.586 10l-4.293 4.293a1 1 0 000 1.414z"
							clipRule="evenodd"
						/>
					</svg>
				</button>
			</nav>
		</div>
	);
}
