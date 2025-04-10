import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getInstitutionById } from "../../api/institutions";
import { InstitutionDetail } from "../../types/institutions";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { toast } from "react-toastify";

export default function InstitutionDetailPage() {
	const { id } = useParams<{ id: string }>();
	const [institution, setInstitution] = useState<InstitutionDetail | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchInstitutionDetails = async () => {
			if (!id) return;

			setLoading(true);
			setError(null);

			try {
				const data = await getInstitutionById(id);
				setInstitution(data);
			} catch (error: any) {
				console.error("Error fetching institution details:", error);
				setError(error.message || "Failed to load institution details");
				toast.error("Failed to load institution details. Please try again.");
			} finally {
				setLoading(false);
			}
		};

		fetchInstitutionDetails();
	}, [id]);

	// Function to generate gradient color based on score (higher is better)
	const getScoreColor = (score: string | undefined, type: string): string => {
		if (!score)
			return "from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800";

		const numScore = parseFloat(score);

		switch (type) {
			case "academic":
				return numScore > 80
					? "from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/20"
					: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10";
			case "employer":
				return numScore > 80
					? "from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/20"
					: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10";
			case "faculty":
				return numScore > 80
					? "from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/20"
					: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10";
			case "citations":
				return numScore > 80
					? "from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/20"
					: "from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/10";
			case "international":
				return numScore > 80
					? "from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/20"
					: "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/10";
			case "network":
				return numScore > 80
					? "from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/20"
					: "from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/10";
			case "employment":
				return numScore > 80
					? "from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/20"
					: "from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/10";
			case "sustainability":
				return numScore > 80
					? "from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/20"
					: "from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/10";
			default:
				return "from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800";
		}
	};

	// Function to get text color for rank badge
	const getRankBadgeColor = (type: string): string => {
		switch (type) {
			case "academic":
				return "bg-blue-500 text-white";
			case "employer":
				return "bg-purple-500 text-white";
			case "faculty":
				return "bg-green-500 text-white";
			case "citations":
				return "bg-yellow-500 text-white";
			case "international":
				return "bg-red-500 text-white";
			case "network":
				return "bg-teal-500 text-white";
			case "employment":
				return "bg-indigo-500 text-white";
			case "sustainability":
				return "bg-emerald-500 text-white";
			default:
				return "bg-gray-500 text-white";
		}
	};

	// Function to render a metric with a color based on score
	const renderMetric = (
		metric: { score: string; rank: string } | undefined,
		label: string,
		type: string
	) => {
		if (!metric) return null;

		const colorGradient = getScoreColor(metric.score, type);
		const badgeColor = getRankBadgeColor(type);

		return (
			<div
				className={`rounded-lg bg-gradient-to-br ${colorGradient} p-6 shadow-sm hover:shadow-md transition-shadow duration-200 h-full`}
			>
				<h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
					{label}
				</h3>
				<div className="flex justify-between items-center">
					<div>
						<span className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
							Score
						</span>
						<span className="text-2xl font-bold text-gray-900 dark:text-white">
							{metric.score}
						</span>
					</div>
					<div className="flex-shrink-0">
						<span className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
							Rank
						</span>
						<span
							className={`inline-flex items-center justify-center px-3 py-1 rounded-full ${badgeColor} font-semibold text-sm`}
						>
							{metric.rank}
						</span>
					</div>
				</div>
			</div>
		);
	};

	return (
		<>
			<PageMeta
				title={
					institution
						? `${institution.name} | School Tracker`
						: "Institution Details"
				}
				description={
					institution
						? `Details about ${institution.name}, ranked ${institution.rank}`
						: "Institution details page"
				}
			/>

			<PageBreadcrumb pageTitle="Institution Details" />

			<div className="container mx-auto pb-12">
				{/* Back button */}
				<div className="mb-6">
					<Link
						to="/directory/search"
						className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
					>
						<svg
							className="w-5 h-5 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
						Back to Directory
					</Link>
				</div>

				{/* Loading state */}
				{loading && (
					<div className="flex items-center justify-center h-64">
						<div className="h-12 w-12 rounded-full border-4 border-t-blue-600 border-blue-200 animate-spin"></div>
					</div>
				)}

				{/* Error state */}
				{error && !loading && (
					<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6 text-center">
						<svg
							className="mx-auto h-12 w-12 text-red-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<h3 className="mt-3 text-lg font-medium text-red-800 dark:text-red-200">
							Error Loading Institution
						</h3>
						<p className="mt-2 text-sm text-red-700 dark:text-red-300">
							{error}
						</p>
						<div className="mt-4">
							<button
								onClick={() => window.location.reload()}
								className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
							>
								Try Again
							</button>
						</div>
					</div>
				)}

				{/* Institution details */}
				{institution && !loading && (
					<div className="space-y-8">
						{/* Header */}
						<div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg text-white">
							<div className="absolute inset-0 opacity-20 flex">
								<div className="w-1/2 h-full bg-[radial-gradient(circle_at_center,_#ffffff33_0%,_transparent_70%)]"></div>
								<div
									className="w-1/2 h-full bg-[radial-gradient(circle_at_center,_#ffffff33_0%,_transparent_70%)]"
									style={{ transform: "translateX(-30%)" }}
								></div>
							</div>
							<div className="relative z-10 px-8 py-12">
								<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
									<div>
										<div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-4">
											<span className="text-sm font-medium text-white">
												Rank {institution.rank}
											</span>
										</div>
										<h1 className="text-3xl md:text-4xl font-bold mb-2">
											{institution.name}
										</h1>
										<p className="text-blue-100">{institution.country}</p>
									</div>
									<div className="flex flex-col items-center md:items-end">
										<div className="bg-white/20 backdrop-blur-sm rounded-lg px-8 py-6 text-center">
											<span className="block text-sm font-medium text-blue-100 mb-1">
												Overall Score
											</span>
											<span className="text-4xl font-extrabold">
												{institution.overall_score}
											</span>
										</div>
									</div>
								</div>

								{institution.web_links && (
									<div className="mt-8">
										<a
											href={institution.web_links}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors rounded-lg px-4 py-2 text-sm font-medium"
										>
											Visit Official Website
											<svg
												className="w-4 h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
												/>
											</svg>
										</a>
									</div>
								)}
							</div>
						</div>

						{/* Classification */}
						{institution.classification && (
							<div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-sm overflow-hidden">
								<div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
									<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
										Classification
									</h2>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
									<div className="flex flex-col p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
										<span className="text-sm text-gray-500 dark:text-gray-400 mb-2">
											Size
										</span>
										<span className="text-xl font-bold text-gray-900 dark:text-white">
											{institution.classification.size}
										</span>
									</div>
									<div className="flex flex-col p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
										<span className="text-sm text-gray-500 dark:text-gray-400 mb-2">
											Focus
										</span>
										<span className="text-xl font-bold text-gray-900 dark:text-white">
											{institution.classification.focus}
										</span>
									</div>
									<div className="flex flex-col p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
										<span className="text-sm text-gray-500 dark:text-gray-400 mb-2">
											Research Level
										</span>
										<span className="text-xl font-bold text-gray-900 dark:text-white">
											{institution.classification.research}
										</span>
									</div>
								</div>
							</div>
						)}

						{/* Performance Metrics */}
						<div>
							<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
								Performance Metrics
							</h2>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{renderMetric(
									institution.academic_reputation,
									"Academic Reputation",
									"academic"
								)}
								{renderMetric(
									institution.employer_reputation,
									"Employer Reputation",
									"employer"
								)}
								{renderMetric(
									institution.faculty_student,
									"Faculty/Student Ratio",
									"faculty"
								)}
								{renderMetric(
									institution.citations_per_faculty,
									"Citations per Faculty",
									"citations"
								)}
								{renderMetric(
									institution.international_faculty,
									"International Faculty",
									"international"
								)}
								{renderMetric(
									institution.international_students,
									"International Students",
									"international"
								)}
								{renderMetric(
									institution.international_research_network,
									"Research Network",
									"network"
								)}
								{renderMetric(
									institution.employment_outcomes,
									"Employment Outcomes",
									"employment"
								)}
								{renderMetric(
									institution.sustainability,
									"Sustainability",
									"sustainability"
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
