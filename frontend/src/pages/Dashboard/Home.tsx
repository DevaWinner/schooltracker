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

			{isLoading ? (
				<div className="flex h-48 items-center justify-center">
					<div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500"></div>
				</div>
			) : (
				<div className="space-y-8">
					<div>
						<h2 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
							Application Overview
						</h2>
						<ApplicationStats applications={applications} />
					</div>

					{/* Additional dashboard content can go here */}
				</div>
			)}
		</>
	);
}
