import { useState, useCallback } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import AddApplication from "../../components/ApplicationTracker/AddApplication";
import ApplicationTable from "../../components/ApplicationTracker/ApplicationTable";
import ApplicationStats from "../../components/ApplicationTracker/ApplicationStats";
import { tableData } from "../../components/ApplicationTracker/placeholderData";

export default function ApplicationTracker() {
	const [applications, setApplications] = useState(tableData);

	const refreshData = useCallback(() => {
		// In a real application, this would fetch updated data from an API
		// For now, we'll just use the tableData
		setApplications([...tableData]);
	}, []);

	return (
		<>
			<PageMeta
				title="Application Tracker | School Tracker"
				description="Application tracking page for School Tracker application"
			/>

			<div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
				<PageBreadcrumb pageTitle="Application Tracker" />
				<AddApplication onRefresh={refreshData} />
			</div>

			<div className="space-y-6">
				<div className="grid grid-cols-1 gap-6 md:grid-cols-12">
					{/* Stats Summary Cards */}
					<div className="md:col-span-12">
						<ApplicationStats applications={applications} />
					</div>

					{/* Applications Table */}
					<div className="md:col-span-12">
						<ComponentCard
							title="Applications"
							className="overflow-hidden"
							headerClassName="border-b border-gray-200 dark:border-gray-700"
							headerRight={
								<button className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
									Export
								</button>
							}
						>
							<ApplicationTable data={applications} onRefresh={refreshData} />
						</ComponentCard>
					</div>
				</div>
			</div>
		</>
	);
}
