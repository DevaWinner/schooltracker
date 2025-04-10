import { useMemo } from "react";
import { Application } from "../../types/applications";
import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	PointElement,
	LineElement,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
	ArcElement,
	CategoryScale,
	LinearScale,
	BarElement,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

interface ApplicationChartsProps {
	applications: Application[];
}

export default function ApplicationCharts({
	applications,
}: ApplicationChartsProps) {
	// Calculate data for status distribution chart
	const statusChartData = useMemo(() => {
		const statusCounts: Record<string, number> = {};

		applications.forEach((app) => {
			if (app.status) {
				statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
			}
		});

		// Generate colors based on status
		const getStatusColor = (status: string) => {
			switch (status) {
				case "Draft":
					return "rgba(156, 163, 175, 0.7)";
				case "In Progress":
					return "rgba(59, 130, 246, 0.7)";
				case "Pending":
					return "rgba(245, 158, 11, 0.7)";
				case "Accepted":
					return "rgba(16, 185, 129, 0.7)";
				case "Rejected":
					return "rgba(239, 68, 68, 0.7)";
				case "Deferred":
					return "rgba(249, 115, 22, 0.7)";
				case "Withdrawn":
					return "rgba(107, 114, 128, 0.7)";
				default:
					return "rgba(209, 213, 219, 0.7)";
			}
		};

		const labels = Object.keys(statusCounts);
		const data = labels.map((label) => statusCounts[label]);
		const backgroundColor = labels.map((label) => getStatusColor(label));

		return {
			labels,
			datasets: [
				{
					data,
					backgroundColor,
					borderColor: backgroundColor.map((color) =>
						color.replace("0.7", "1")
					),
					borderWidth: 1,
				},
			],
		};
	}, [applications]);

	// Calculate data for degree type distribution
	const degreeChartData = useMemo(() => {
		const degreeCounts: Record<string, number> = {};

		applications.forEach((app) => {
			if (app.degree_type) {
				degreeCounts[app.degree_type] =
					(degreeCounts[app.degree_type] || 0) + 1;
			}
		});

		// Color map for degree types
		const degreeColors: Record<string, string> = {
			Associate: "rgba(20, 184, 166, 0.7)", // teal
			Bachelor: "rgba(59, 130, 246, 0.7)", // blue
			Master: "rgba(139, 92, 246, 0.7)", // purple
			PhD: "rgba(79, 70, 229, 0.7)", // indigo
			Certificate: "rgba(245, 158, 11, 0.7)", // amber
			Diploma: "rgba(16, 185, 129, 0.7)", // emerald
			Other: "rgba(209, 213, 219, 0.7)", // gray
		};

		const labels = Object.keys(degreeCounts);
		const data = labels.map((label) => degreeCounts[label]);
		const backgroundColor = labels.map(
			(label) => degreeColors[label] || "rgba(209, 213, 219, 0.7)"
		);

		return {
			labels,
			datasets: [
				{
					data,
					backgroundColor,
					borderColor: backgroundColor.map((color) =>
						color.replace("0.7", "1")
					),
					borderWidth: 1,
				},
			],
		};
	}, [applications]);

	// Calculate timeline data (applications by month)
	const timelineChartData = useMemo(() => {
		// Create a map of months with application counts
		const monthlyData: Record<string, number> = {};
		const monthNames = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];

		// Initialize with last 6 months
		const today = new Date();
		for (let i = 5; i >= 0; i--) {
			const d = new Date(today);
			d.setMonth(today.getMonth() - i);
			const monthKey = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
			monthlyData[monthKey] = 0;
		}

		// Count applications by created month
		applications.forEach((app) => {
			if (app.created_at) {
				const date = new Date(app.created_at);
				const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
				monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
			}
		});

		const labels = Object.keys(monthlyData);
		const data = labels.map((label) => monthlyData[label]);

		return {
			labels,
			datasets: [
				{
					label: "Applications Created",
					data,
					borderColor: "rgba(79, 70, 229, 1)",
					backgroundColor: "rgba(79, 70, 229, 0.2)",
					tension: 0.3,
					fill: true,
				},
			],
		};
	}, [applications]);

	// Calculate institutions by country
	const countryChartData = useMemo(() => {
		const countryCounts: Record<string, number> = {};

		applications.forEach((app) => {
			const country =
				app.institution_country ||
				app.institution_details?.country ||
				"Unknown";
			countryCounts[country] = (countryCounts[country] || 0) + 1;
		});

		// Sort by count (descending)
		const sortedCountries = Object.keys(countryCounts).sort(
			(a, b) => countryCounts[b] - countryCounts[a]
		);

		// Take top 7 countries
		const topCountries = sortedCountries.slice(0, 7);
		const data = topCountries.map((country) => countryCounts[country]);

		// Generate colors
		const backgroundColor = [
			"rgba(79, 70, 229, 0.7)", // indigo
			"rgba(16, 185, 129, 0.7)", // green
			"rgba(245, 158, 11, 0.7)", // amber
			"rgba(139, 92, 246, 0.7)", // purple
			"rgba(239, 68, 68, 0.7)", // red
			"rgba(59, 130, 246, 0.7)", // blue
			"rgba(107, 114, 128, 0.7)", // gray
		];

		return {
			labels: topCountries,
			datasets: [
				{
					label: "Applications by Country",
					data,
					backgroundColor,
					borderColor: backgroundColor.map((color) =>
						color.replace("0.7", "1")
					),
					borderWidth: 1,
				},
			],
		};
	}, [applications]);

	// Common options for charts
	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "bottom" as const,
				labels: {
					usePointStyle: true,
					boxWidth: 8,
				},
			},
			tooltip: {
				callbacks: {
					label: function (context: any) {
						return ` ${context.label}: ${context.raw} applications`;
					},
				},
			},
		},
	};

	// Line chart options
	const lineChartOptions = {
		...chartOptions,
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					stepSize: 1,
				},
			},
		},
	};

	return (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
			{/* Status Distribution Chart */}
			<div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
				<h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
					Status Distribution
				</h3>
				<div className="h-64">
					{applications.length > 0 ? (
						<Pie data={statusChartData} options={chartOptions} />
					) : (
						<div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
							No application data available
						</div>
					)}
				</div>
			</div>

			{/* Degree Type Distribution */}
			<div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
				<h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
					Degree Types
				</h3>
				<div className="h-64">
					{applications.length > 0 ? (
						<Bar
							data={degreeChartData}
							options={{
								...chartOptions,
								indexAxis: "y" as const,
							}}
						/>
					) : (
						<div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
							No application data available
						</div>
					)}
				</div>
			</div>

			{/* Timeline Chart */}
			<div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
				<h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
					Application Timeline
				</h3>
				<div className="h-64">
					{applications.length > 0 ? (
						<Line data={timelineChartData} options={lineChartOptions} />
					) : (
						<div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
							No application data available
						</div>
					)}
				</div>
			</div>

			{/* Countries Chart */}
			<div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
				<h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
					Top Countries
				</h3>
				<div className="h-64">
					{applications.length > 0 ? (
						<Bar data={countryChartData} options={chartOptions} />
					) : (
						<div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
							No application data available
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
