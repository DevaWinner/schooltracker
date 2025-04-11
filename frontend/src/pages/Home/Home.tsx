import { useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/Routes";
import ApplicationStats from "../../components/ApplicationTracker/ApplicationStats";
import ApplicationCharts from "../../components/Dashboard/ApplicationCharts";
import ComponentCard from "../../components/common/ComponentCard";
import { useApplications } from "../../context/ApplicationContext";
import { formatDate } from "../../utils/dateUtils";

export default function Home() {
	const { applications, isLoading, fetchApplications } = useApplications();

	useEffect(() => {
		// This will only fetch if data is stale or non-existent
		fetchApplications();
	}, [fetchApplications]);

	// Get upcoming submission deadlines - applications in Draft or In Progress status
	const upcomingDeadlines = applications
		.filter(
			(app) =>
				(app.status === "Draft" || app.status === "In Progress") &&
				app.start_date
		)
		.sort((a, b) => {
			const dateA = a.start_date ? new Date(a.start_date).getTime() : Infinity;
			const dateB = b.start_date ? new Date(b.start_date).getTime() : Infinity;
			return dateA - dateB;
		})
		.slice(0, 5);

	// Get recently added or updated applications
	const recentApplications = [...applications]
		.sort((a, b) => {
			const dateA = new Date(a.updated_at).getTime();
			const dateB = new Date(b.updated_at).getTime();
			return dateB - dateA; // Most recent first
		})
		.slice(0, 5);

	// Skeleton loader for ApplicationStats
	const ApplicationStatsSkeleton = () => (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-3 animate-pulse">
			{Array(3)
				.fill(0)
				.map((_, index) => (
					<div
						key={index}
						className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]"
					>
						<div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-700 mb-4"></div>

						{/* Status / Degree items skeleton */}
						<div className="space-y-3">
							{Array(5)
								.fill(0)
								.map((_, i) => (
									<div key={i} className="flex items-center justify-between">
										<div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
										<div className="h-4 w-10 rounded bg-gray-200 dark:bg-gray-700"></div>
									</div>
								))}
						</div>

						{/* For the metrics panel in the third column */}
						{index === 2 && (
							<>
								<div className="grid grid-cols-2 gap-3 mt-6">
									{Array(4)
										.fill(0)
										.map((_, i) => (
											<div
												key={i}
												className="rounded bg-gray-100 p-3 dark:bg-gray-800/50"
											>
												<div className="h-6 w-12 rounded bg-gray-200 dark:bg-gray-700 mb-1"></div>
												<div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
											</div>
										))}
								</div>

								<div className="mt-6">
									<div className="flex items-center justify-between mb-2">
										<div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
										<div className="h-4 w-8 rounded bg-gray-200 dark:bg-gray-700"></div>
									</div>
									<div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
								</div>
							</>
						)}
					</div>
				))}
		</div>
	);

	// Skeleton loader for charts
	const ChartsSkeleton = () => (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
			<div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
				<div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-700 mb-4"></div>
				<div className="h-64 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
			</div>
			<div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
				<div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-700 mb-4"></div>
				<div className="h-64 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
			</div>
		</div>
	);

	// Skeleton loader for the activity cards
	const ActivityCardsSkeleton = () => (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
			{[1, 2].map((i) => (
				<div
					key={i}
					className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]"
				>
					<div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700 flex justify-between items-center">
						<div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
						<div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
					</div>
					<div className="p-5">
						<div className="space-y-4">
							{Array(4)
								.fill(0)
								.map((_, idx) => (
									<div
										key={idx}
										className="flex justify-between items-center p-3 border border-gray-100 dark:border-gray-700 rounded-lg"
									>
										<div className="flex flex-col">
											<div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
											<div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
										</div>
										<div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
									</div>
								))}
						</div>
					</div>
				</div>
			))}
		</div>
	);

	return (
		<>
			<PageMeta
				title="Dashboard | School Tracker"
				description="Dashboard for School Tracker application"
			/>

			<div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
				<PageBreadcrumb pageTitle="Dashboard" />
				<div className="flex space-x-3">
					<Link
						to={ROUTES.Applications.tracker}
						className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
					>
						View All Applications
					</Link>
				</div>
			</div>

			<div className="space-y-6">
				<div>
					<h2 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
						Application Overview
					</h2>
					{isLoading ? (
						<ApplicationStatsSkeleton />
					) : (
						<ApplicationStats applications={applications} />
					)}
				</div>

				<div>
					<h2 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
						Application Analytics
					</h2>
					{isLoading ? (
						<ChartsSkeleton />
					) : (
						<ApplicationCharts applications={applications} />
					)}
				</div>

				{/* Recent Activity and Upcoming Deadlines */}
				{applications.length > 0 && (
					<div>
						<h2 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
							Recent Activity & Upcoming Deadlines
						</h2>
						{isLoading ? (
							<ActivityCardsSkeleton />
						) : (
							<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
								{/* Recent Applications - Improved & more compact */}
								<ComponentCard
									title="Recent Applications"
									className="overflow-hidden"
									headerClassName="border-b border-gray-200 dark:border-gray-700"
									headerRight={
										<Link
											to={ROUTES.Applications.tracker}
											className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
										>
											View All
										</Link>
									}
								>
									<div className="p-3">
										<div className="divide-y divide-gray-100 dark:divide-gray-700">
											{recentApplications.length > 0 ? (
												recentApplications.map((app) => (
													<Link
														key={app.id}
														to={`/applications/detail/${app.id}`}
														className="flex items-center justify-between gap-2 px-2 py-2 hover:bg-gray-50 rounded-md dark:hover:bg-gray-800/30"
													>
														<div className="min-w-0 flex-1">
															<div className="flex items-center gap-1">
																<h4 className="truncate text-sm font-medium text-gray-900 dark:text-white">
																	{app.program_name}
																</h4>
																<span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
																	·
																</span>
																<span className="truncate text-xs text-gray-500 dark:text-gray-400">
																	{app.institution_details?.name ||
																		app.institution}
																</span>
															</div>
														</div>
														<div className="shrink-0">
															<span
																className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium 
																${
																	app.status === "Accepted"
																		? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
																		: app.status === "Rejected"
																		? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
																		: app.status === "Pending"
																		? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
																		: app.status === "Deferred"
																		? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
																		: app.status === "Withdrawn"
																		? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
																		: app.status === "In Progress"
																		? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
																		: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
																}`}
															>
																{app.status}
															</span>
														</div>
													</Link>
												))
											) : (
												<p className="text-center py-4 text-gray-500 dark:text-gray-400">
													No recent applications
												</p>
											)}
										</div>
									</div>
								</ComponentCard>

								{/* Upcoming Deadlines - Also make this card more compact */}
								<ComponentCard
									title="Upcoming Submission Deadlines"
									className="overflow-hidden"
									headerClassName="border-b border-gray-200 dark:border-gray-700"
									headerRight={
										<Link
											to={ROUTES.Applications.tracker}
											className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
										>
											View All
										</Link>
									}
								>
									<div className="p-3">
										<div className="divide-y divide-gray-100 dark:divide-gray-700">
											{upcomingDeadlines.length > 0 ? (
												upcomingDeadlines.map((app) => (
													<Link
														key={app.id}
														to={`/applications/detail/${app.id}`}
														className="flex items-center justify-between gap-2 px-2 py-2 hover:bg-gray-50 rounded-md dark:hover:bg-gray-800/30"
													>
														<div className="min-w-0 flex-1">
															<div className="flex items-center gap-1">
																<h4 className="truncate text-sm font-medium text-gray-900 dark:text-white">
																	{app.program_name}
																</h4>
																<span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
																	·
																</span>
																<span className="truncate text-xs text-gray-500 dark:text-gray-400">
																	{app.institution_details?.name ||
																		app.institution}
																</span>
															</div>
															<p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
																Due {formatDate(app.start_date)}
															</p>
														</div>
														<div className="shrink-0">
															<span className="inline-block rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-900/20 dark:text-brand-400">
																{getDaysUntil(app.start_date)}
															</span>
														</div>
													</Link>
												))
											) : (
												<p className="text-center py-4 text-gray-500 dark:text-gray-400">
													No upcoming deadlines
												</p>
											)}
										</div>
									</div>
								</ComponentCard>
							</div>
						)}
					</div>
				)}
			</div>
		</>
	);
}

// Helper function to get days until a date
function getDaysUntil(dateStr?: string | null): string {
	if (!dateStr) return "";

	try {
		const targetDate = new Date(dateStr);
		const today = new Date();

		// Reset time part for accurate day calculation
		today.setHours(0, 0, 0, 0);
		targetDate.setHours(0, 0, 0, 0);

		const diffTime = targetDate.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays < 0) return "Past due";
		if (diffDays === 0) return "Today";
		if (diffDays === 1) return "Tomorrow";
		if (diffDays < 30) return `${diffDays} days left`;
		if (diffDays < 60) return "About 1 month left";
		return `${Math.floor(diffDays / 30)} months left`;
	} catch (error) {
		console.error("Error calculating days until:", error);
		return "";
	}
}
