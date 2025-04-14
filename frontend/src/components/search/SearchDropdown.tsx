import React from "react";
import { Link } from "react-router-dom";
import { Application } from "../../types/applications";
import { Document } from "../../types/documents";
import { Institution } from "../../types/institutions";
import { Events } from "../../types/events";
import {
	FaSearch,
	FaUniversity,
	FaFileAlt,
	FaClipboardList,
	FaCalendarAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface SearchDropdownProps {
	isOpen: boolean;
	onClose: () => void;
	applications: Application[];
	documents: Document[];
	institutions: Institution[];
	events: Events[];
	isSearching: boolean;
	query: string;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
	isOpen,
	onClose,
	applications,
	documents,
	institutions,
	events,
	isSearching,
	query,
}) => {
	const hasResults =
		applications.length > 0 ||
		documents.length > 0 ||
		institutions.length > 0 ||
		events.length > 0;

	if (!isOpen) return null;

	return (
		<div className="absolute top-full left-12 mt-1 z-50 w-full bg-white rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
			<AnimatePresence>
				<motion.div
					initial={{ opacity: 0, y: -5 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0 }}
					className="max-h-[calc(100vh-200px)] overflow-y-auto"
				>
					{isSearching ? (
						<div className="flex justify-center py-6">
							<div className="animate-spin h-6 w-6 border-2 border-t-transparent border-blue-500 rounded-full"></div>
						</div>
					) : !query ? (
						<div className="py-8 text-center">
							<FaSearch className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600" />
							<p className="mt-2 text-gray-500 dark:text-gray-400">
								Type to search across the app
							</p>
						</div>
					) : !hasResults ? (
						<div className="py-8 text-center">
							<p className="text-gray-500 dark:text-gray-400">
								No results found for "{query}"
							</p>
						</div>
					) : (
						<div>
							{applications.length > 0 && (
								<div className="mb-2">
									<h3 className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
										Applications
									</h3>
									<div className="divide-y divide-gray-100 dark:divide-gray-700">
										{applications.map((app) => (
											<Link
												key={`app-${app.id}`}
												to={`/applications/detail/${app.id}`}
												onClick={onClose}
												className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700"
											>
												<div className="flex-shrink-0 mr-3">
													<div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
														<FaClipboardList className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
													</div>
												</div>
												<div className="min-w-0 flex-1">
													<p className="text-sm font-medium text-gray-900 dark:text-gray-100">
														{app.program_name}
													</p>
													<p className="text-xs text-gray-500 truncate dark:text-gray-400">
														{app.institution_details?.name ||
															app.institution_name ||
															app.institution}{" "}
														• {app.degree_type}
													</p>
												</div>
											</Link>
										))}
									</div>
								</div>
							)}

							{documents.length > 0 && (
								<div className="mb-2">
									<h3 className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
										Documents
									</h3>
									<div className="divide-y divide-gray-100 dark:divide-gray-700">
										{documents.map((doc) => (
											<Link
												key={`doc-${doc.id}`}
												to={`/documents/library?id=${doc.id}`}
												onClick={onClose}
												className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700"
											>
												<div className="flex-shrink-0 mr-3">
													<div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
														<FaFileAlt className="h-4 w-4 text-green-600 dark:text-green-400" />
													</div>
												</div>
												<div className="min-w-0 flex-1">
													<p className="text-sm font-medium text-gray-900 dark:text-gray-100">
														{doc.file_name}
													</p>
													<p className="text-xs text-gray-500 truncate dark:text-gray-400">
														{doc.document_type}
														{doc.application_info &&
															` • ${doc.application_info.program_name}`}
													</p>
												</div>
											</Link>
										))}
									</div>
								</div>
							)}

							{institutions.length > 0 && (
								<div className="mb-2">
									<h3 className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
										Institutions
									</h3>
									<div className="divide-y divide-gray-100 dark:divide-gray-700">
										{institutions.map((institution) => (
											<Link
												key={`inst-${institution.id}`}
												to={`/directory/institution/${institution.id}`}
												onClick={onClose}
												className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700"
											>
												<div className="flex-shrink-0 mr-3">
													<div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
														<FaUniversity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
													</div>
												</div>
												<div className="min-w-0 flex-1">
													<p className="text-sm font-medium text-gray-900 dark:text-gray-100">
														{institution.name}
													</p>
													<p className="text-xs text-gray-500 truncate dark:text-gray-400">
														{institution.country} • Rank: {institution.rank}
													</p>
												</div>
											</Link>
										))}
									</div>
								</div>
							)}

							{events.length > 0 && (
								<div className="mb-2">
									<h3 className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
										Events
									</h3>
									<div className="divide-y divide-gray-100 dark:divide-gray-700">
										{events.map((event) => (
											<Link
												key={`event-${event.id}`}
												to={
													event.application
														? `/applications/detail/${event.application}`
														: "/events"
												}
												onClick={onClose}
												className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700"
											>
												<div className="flex-shrink-0 mr-3">
													<div
														className={`flex h-9 w-9 items-center justify-center rounded-full ${
															event.event_color === "danger"
																? "bg-red-100 dark:bg-red-900/30"
																: event.event_color === "warning"
																? "bg-yellow-100 dark:bg-yellow-900/30"
																: event.event_color === "success"
																? "bg-green-100 dark:bg-green-900/30"
																: "bg-blue-100 dark:bg-blue-900/30"
														}`}
													>
														<FaCalendarAlt
															className={`h-4 w-4 ${
																event.event_color === "danger"
																	? "text-red-600 dark:text-red-400"
																	: event.event_color === "warning"
																	? "text-yellow-600 dark:text-yellow-400"
																	: event.event_color === "success"
																	? "text-green-600 dark:text-green-400"
																	: "text-blue-600 dark:text-blue-400"
															}`}
														/>
													</div>
												</div>
												<div className="min-w-0 flex-1">
													<p className="text-sm font-medium text-gray-900 dark:text-gray-100">
														{event.event_title}
													</p>
													<p className="text-xs text-gray-500 truncate dark:text-gray-400">
														{new Date(event.event_date).toLocaleDateString()} •{" "}
														{event.notes
															? event.notes.substring(0, 20) +
															  (event.notes.length > 20 ? "..." : "")
															: "No details"}
													</p>
												</div>
											</Link>
										))}
									</div>
								</div>
							)}
						</div>
					)}
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export default SearchDropdown;
