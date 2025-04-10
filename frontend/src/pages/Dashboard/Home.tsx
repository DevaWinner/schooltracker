import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { Application } from "../../types/applications";
import { getApplications } from "../../api/applications";
import { toast } from "react-toastify";
import ApplicationStats from "../../components/ApplicationTracker/ApplicationStats";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/Routes";

export default function Home() {
	const [applications, setApplications] = useState<Application[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchApplications = async () => {
			setIsLoading(true);
			try {
				const response = await getApplications();
				setApplications(response.results);
			} catch (error) {
				console.error("Error fetching applications:", error);
				toast.error("Failed to load applications data");
			} finally {
				setIsLoading(false);
			}
		};

		fetchApplications();
	}, []);

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

				{/* Additional dashboard content can go here */}
			</div>
		</>
	);
}
