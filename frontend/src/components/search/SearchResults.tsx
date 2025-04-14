import React from "react";
import { Link } from "react-router-dom";
import { Application } from "../../types/applications";
import { Document } from "../../types/documents";
import { Institution } from "../../types/institutions";
import {
	FaSearch,
	FaUniversity,
	FaFileAlt,
	FaClipboardList,
} from "react-icons/fa";

interface SearchResultsProps {
	applications: Application[];
	documents: Document[];
	institutions: Institution[];
	isSearching: boolean;
	query: string;
	onClose: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
	applications,
	documents,
	institutions,
	isSearching,
	query,
	onClose,
}) => {
	const hasResults =
		applications.length > 0 || documents.length > 0 || institutions.length > 0;

	if (isSearching) {
		return (
			<div className="py-8 text-center">
				<div
					className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"
					role="status"
				>
					<span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
						Searching...
					</span>
				</div>
			</div>
		);
	}

	if (!query) {
		return (
			<div className="py-10 text-center">
				<FaSearch className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600" />
				<p className="mt-2 text-gray-500 dark:text-gray-400">
					Type to search for applications, documents, and institutions
				</p>
			</div>
		);
	}

	if (query && !hasResults) {
		return (
			<div className="py-10 text-center">
				<p className="text-gray-500 dark:text-gray-400">
					No results found for "{query}"
				</p>
			</div>
		);
	}

	return (
		<div className="max-h-[60vh] overflow-y-auto">
			{applications.length > 0 && (
				<div className="mb-4">
					<h3 className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
						Applications
					</h3>
					<div className="divide-y divide-gray-100 dark:divide-gray-800">
						{applications.slice(0, 5).map((app) => (
							<Link
								key={`app-${app.id}`}
								to={`/applications/${app.id}`}
								className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800"
								onClick={onClose}
							>
								<div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
									<FaClipboardList className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
								</div>
								<div className="min-w-0 flex-1">
									<p className="text-sm font-medium text-gray-900 dark:text-gray-200">
										{app.program_name}
									</p>
									<p className="truncate text-xs text-gray-500 dark:text-gray-400">
										{app.institution_details?.name ||
											app.institution_name ||
											app.institution}{" "}
										• {app.degree_type}
									</p>
								</div>
							</Link>
						))}
						{applications.length > 5 && (
							<Link
								to="/applications"
								className="block px-4 py-2 text-right text-sm text-indigo-600 hover:underline dark:text-indigo-400"
								onClick={onClose}
							>
								View all {applications.length} applications
							</Link>
						)}
					</div>
				</div>
			)}

			{documents.length > 0 && (
				<div className="mb-4">
					<h3 className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
						Documents
					</h3>
					<div className="divide-y divide-gray-100 dark:divide-gray-800">
						{documents.slice(0, 5).map((doc) => (
							<Link
								key={`doc-${doc.id}`}
								to={`/documents?id=${doc.id}`}
								className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800"
								onClick={onClose}
							>
								<div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
									<FaFileAlt className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
								</div>
								<div className="min-w-0 flex-1">
									<p className="text-sm font-medium text-gray-900 dark:text-gray-200">
										{doc.file_name}
									</p>
									<p className="truncate text-xs text-gray-500 dark:text-gray-400">
										{doc.document_type}
										{doc.application_info &&
											` • ${doc.application_info.program_name}`}
									</p>
								</div>
							</Link>
						))}
						{documents.length > 5 && (
							<Link
								to="/documents"
								className="block px-4 py-2 text-right text-sm text-indigo-600 hover:underline dark:text-indigo-400"
								onClick={onClose}
							>
								View all {documents.length} documents
							</Link>
						)}
					</div>
				</div>
			)}

			{institutions.length > 0 && (
				<div className="mb-4">
					<h3 className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
						Institutions
					</h3>
					<div className="divide-y divide-gray-100 dark:divide-gray-800">
						{institutions.slice(0, 5).map((institution) => (
							<Link
								key={`inst-${institution.id}`}
								to={`/institutions/${institution.id}`}
								className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800"
								onClick={onClose}
							>
								<div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
									<FaUniversity className="h-5 w-5 text-blue-500 dark:text-blue-400" />
								</div>
								<div className="min-w-0 flex-1">
									<p className="text-sm font-medium text-gray-900 dark:text-gray-200">
										{institution.name}
									</p>
									<p className="truncate text-xs text-gray-500 dark:text-gray-400">
										{institution.country} • Rank: {institution.rank}
									</p>
								</div>
							</Link>
						))}
						{institutions.length > 5 && (
							<Link
								to="/institutions"
								className="block px-4 py-2 text-right text-sm text-indigo-600 hover:underline dark:text-indigo-400"
								onClick={onClose}
							>
								View all {institutions.length} institutions
							</Link>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default SearchResults;
