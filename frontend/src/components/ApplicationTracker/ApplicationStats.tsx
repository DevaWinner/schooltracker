import { useMemo } from "react";
import { Application } from "../../types/applications";

interface ApplicationStatsProps {
	applications: Application[];
}

export default function ApplicationStats({
	applications,
}: ApplicationStatsProps) {
	// Calculate stats from applications data
	const stats = useMemo(() => {
		// Default stats object
		const result = {
			total: applications.length,
			byStatus: {} as Record<string, number>,
			byDegree: {} as Record<string, number>,
			acceptanceRate: 0,
			pendingCount: 0,
			acceptedCount: 0,
			rejectedCount: 0,
			upcomingDeadlines: [] as { date: string; program: string }[],
		};

		// Skip if no applications
		if (applications.length === 0) return result;

		// Count by status
		applications.forEach((app) => {
			// Count by status
			if (app.status) {
				result.byStatus[app.status] = (result.byStatus[app.status] || 0) + 1;

				// Count applications that are still pending a decision
				if (
					["Draft", "In Progress", "Pending", "Deferred"].includes(app.status)
				) {
					result.pendingCount++;
				}

				// Count accepted and rejected applications separately for better tracking
				if (app.status === "Accepted") {
					result.acceptedCount++;
				}

				if (app.status === "Rejected") {
					result.rejectedCount++;
				}
			}

			// Count by degree type
			if (app.degree_type) {
				result.byDegree[app.degree_type] =
					(result.byDegree[app.degree_type] || 0) + 1;
			}

			// Find upcoming deadlines (applications with a pending status and start date)
			if (
				(app.status === "Draft" ||
					app.status === "In Progress" ||
					app.status === "Pending") &&
				app.start_date
			) {
				const deadline = new Date(app.start_date);
				const now = new Date();

				// Only include future deadlines within the next 90 days
				if (
					deadline > now &&
					deadline.getTime() - now.getTime() < 90 * 24 * 60 * 60 * 1000
				) {
					result.upcomingDeadlines.push({
						date: app.start_date!,
						program: app.program_name,
					});
				}
			}
		});

		// Sort upcoming deadlines
		result.upcomingDeadlines.sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
		);

		// Calculate acceptance rate (only if there are decisions)
		const decidedCount = result.acceptedCount + result.rejectedCount;
		if (decidedCount > 0) {
			result.acceptanceRate = Math.round(
				(result.acceptedCount / decidedCount) * 100
			);
		}

		return result;
	}, [applications]);

	// Format date for display
	const formatDate = (dateStr: string): string => {
		const date = new Date(dateStr);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	// Helper function to get status color
	const getStatusColor = (status: string): string => {
		switch (status) {
			case "Draft":
				return "bg-gray-200 text-gray-800";
			case "In Progress":
				return "bg-blue-100 text-blue-800";
			case "Pending":
				return "bg-yellow-100 text-yellow-800";
			case "Accepted":
				return "bg-green-100 text-green-800";
			case "Rejected":
				return "bg-red-100 text-red-800";
			case "Deferred":
				return "bg-orange-100 text-orange-800";
			case "Withdrawn":
				return "bg-gray-300 text-gray-700";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	// Helper function to get degree color
	const getDegreeColor = (degree: string): string => {
		switch (degree) {
			case "Associate":
				return "bg-teal-100 text-teal-800";
			case "Bachelor":
				return "bg-blue-100 text-blue-800";
			case "Master":
				return "bg-purple-100 text-purple-800";
			case "PhD":
				return "bg-indigo-100 text-indigo-800";
			case "Certificate":
				return "bg-amber-100 text-amber-800";
			case "Diploma":
				return "bg-emerald-100 text-emerald-800";
			case "Other":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
			{/* Application Status Stats */}
			<div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
				<h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
					Application Status
				</h3>

				{stats.total === 0 ? (
					<div className="text-center py-8 text-gray-500 dark:text-gray-400">
						No applications yet
					</div>
				) : (
					<div className="space-y-3">
						{Object.entries(stats.byStatus).map(([status, count]) => (
							<div key={status} className="flex items-center justify-between">
								<div className="flex items-center">
									<span
										className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(
											status
										)}`}
									>
										{status}
									</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
										{count}
									</span>
									<span className="text-xs text-gray-500 dark:text-gray-400">
										({Math.round((count / stats.total) * 100)}%)
									</span>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Degree Type Stats */}
			<div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
				<h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
					Degree Types
				</h3>

				{stats.total === 0 ? (
					<div className="text-center py-8 text-gray-500 dark:text-gray-400">
						No applications yet
					</div>
				) : (
					<div className="space-y-3">
						{Object.entries(stats.byDegree).map(([degree, count]) => (
							<div key={degree} className="flex items-center justify-between">
								<div className="flex items-center">
									<span
										className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getDegreeColor(
											degree
										)}`}
									>
										{degree}
									</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
										{count}
									</span>
									<span className="text-xs text-gray-500 dark:text-gray-400">
										({Math.round((count / stats.total) * 100)}%)
									</span>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Application Metrics & Deadlines */}
			<div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
				<h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
					Application Metrics
				</h3>

				<div className="space-y-6">
					{/* Application counts */}
					<div className="grid grid-cols-2 gap-3">
						<div className="rounded bg-gray-50 p-3 dark:bg-gray-800/50">
							<div className="text-xl font-semibold text-gray-800 dark:text-white">
								{stats.total}
							</div>
							<div className="text-xs text-gray-500 dark:text-gray-400">
								Total Applications
							</div>
						</div>
						<div className="rounded bg-gray-50 p-3 dark:bg-gray-800/50">
							<div className="text-xl font-semibold text-gray-800 dark:text-white">
								{stats.pendingCount}
							</div>
							<div className="text-xs text-gray-500 dark:text-gray-400">
								Pending Decision
							</div>
						</div>
						<div className="rounded bg-green-50 p-3 dark:bg-green-900/20">
							<div className="text-xl font-semibold text-green-700 dark:text-green-400">
								{stats.acceptedCount}
							</div>
							<div className="text-xs text-green-600 dark:text-green-400">
								Accepted
							</div>
						</div>
						<div className="rounded bg-red-50 p-3 dark:bg-red-900/20">
							<div className="text-xl font-semibold text-red-700 dark:text-red-400">
								{stats.rejectedCount}
							</div>
							<div className="text-xs text-red-600 dark:text-red-400">
								Rejected
							</div>
						</div>
					</div>

					{/* Acceptance rate */}
					{(stats.acceptedCount > 0 || stats.rejectedCount > 0) && (
						<div>
							<div className="mb-2 flex items-center justify-between">
								<span className="text-sm text-gray-600 dark:text-gray-400">
									Acceptance Rate
								</span>
								<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
									{stats.acceptanceRate}%
								</span>
							</div>
							<div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
								<div
									className="h-2 rounded-full bg-green-500"
									style={{ width: `${stats.acceptanceRate}%` }}
								></div>
							</div>
							<div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
								{stats.acceptedCount} of{" "}
								{stats.acceptedCount + stats.rejectedCount} applications
								submitted
							</div>
						</div>
					)}

					{/* Upcoming deadlines */}
					<div>
						<h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
							Upcoming Deadlines
						</h4>

						{stats.upcomingDeadlines.length === 0 ? (
							<p className="text-sm text-gray-500 dark:text-gray-400">
								No upcoming deadlines
							</p>
						) : (
							<div className="space-y-2">
								{stats.upcomingDeadlines.slice(0, 3).map((deadline, index) => (
									<div
										key={index}
										className="flex items-center justify-between"
									>
										<span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[180px]">
											{deadline.program}
										</span>
										<span className="text-xs font-medium text-brand-500 dark:text-brand-400">
											{formatDate(deadline.date)}
										</span>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
