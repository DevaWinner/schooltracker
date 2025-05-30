import { useMemo } from "react";
import { Application } from "../../interfaces/applications";
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
					label: "Degree Types",
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

	// Calculate application timeline data (submissions and decisions by month)
	const timelineChartData = useMemo(() => {
		// Create maps for submitted and decision dates
		const submittedData: Record<string, number> = {};
		const decisionData: Record<string, number> = {};
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
			submittedData[monthKey] = 0;
			decisionData[monthKey] = 0;
		}

		// Count applications by submitted date and decision date
		applications.forEach((app) => {
			// Track submissions
			if (app.submitted_date) {
				const date = new Date(app.submitted_date);
				const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
				submittedData[monthKey] = (submittedData[monthKey] || 0) + 1;
			}

			// Track decisions (Accepted or Rejected)
			if (
				app.decision_date &&
				(app.status === "Accepted" || app.status === "Rejected")
			) {
				const date = new Date(app.decision_date);
				const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
				decisionData[monthKey] = (decisionData[monthKey] || 0) + 1;
			}
		});

		const labels = Object.keys(submittedData);

		return {
			labels,
			datasets: [
				{
					label: "Applications Submitted",
					data: labels.map((label) => submittedData[label]),
					borderColor: "rgba(59, 130, 246, 1)", // blue
					backgroundColor: "rgba(59, 130, 246, 0.2)",
					tension: 0.3,
					fill: true,
				},
				{
					label: "Decisions Received",
					data: labels.map((label) => decisionData[label]),
					borderColor: "rgba(139, 92, 246, 1)", // purple
					backgroundColor: "rgba(139, 92, 246, 0.2)",
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
					label: "",
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
					display: true,
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

	// Options for charts without dataset labels (like country chart)
	const chartOptionsNoDatasetLabels = {
		...chartOptions,
		plugins: {
			...chartOptions.plugins,
			legend: {
				...chartOptions.plugins.legend,
				display: false, // Don't show dataset labels for country chart
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
		plugins: {
			...chartOptions.plugins,
			tooltip: {
				callbacks: {
					label: function (context: any) {
						const datasetLabel = context.dataset.label || "";
						return `${datasetLabel}: ${context.raw}`;
					},
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
								...chartOptionsNoDatasetLabels, // Use the options without dataset labels
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

			{/* Application Progress Timeline Chart */}
			<div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
				<h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
					Application Progress Timeline
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
						<Bar
							data={countryChartData}
							options={chartOptionsNoDatasetLabels}
						/>
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
