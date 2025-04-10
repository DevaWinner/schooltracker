import { useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/Routes";
import ApplicationStats from "../../components/ApplicationTracker/ApplicationStats";
import ApplicationCharts from "../../components/Dashboard/ApplicationCharts";
import ComponentCard from "../../components/common/ComponentCard";
import { useApplications } from "../../context/ApplicationContext";

export default function Home() {
	const { applications, isLoading, fetchApplications } = useApplications();

	useEffect(() => {
		// This will only fetch if data is stale or non-existent
		fetchApplications();
	}, [fetchApplications]);

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

			<div className="space-y-8">
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

				{applications.length > 0 && (
					<div>
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
							<div className="p-5">
								<div className="space-y-3">
									{applications.slice(0, 3).map((app) => (
										<Link
											key={app.id}
											to={`/applications/detail/${app.id}`}
											className="block rounded-lg border border-gray-100 p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/30"
										>
											<div className="flex items-center justify-between">
												<div>
													<h4 className="font-medium text-gray-900 dark:text-white">
														{app.program_name}
													</h4>
													<p className="text-sm text-gray-500 dark:text-gray-400">
														{app.institution_details?.name || app.institution}
													</p>
												</div>
												<span
													className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium 
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
									))}

									{applications.length === 0 && (
										<p className="text-center py-5 text-gray-500 dark:text-gray-400">
											No applications found
										</p>
									)}
								</div>
							</div>
						</ComponentCard>
					</div>
				)}
			</div>
		</>
	);
}
