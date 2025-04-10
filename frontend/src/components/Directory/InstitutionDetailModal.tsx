import { useEffect, useState } from "react";
import { InstitutionDetail, MetricData } from "../../types/institutions";
import { getInstitutionById } from "../../api/institutions";
import Button from "../ui/button/Button";
import { toast } from "react-toastify";

interface DetailModalProps {
	institutionId: string | null;
	onClose: () => void;
}

export default function InstitutionDetailModal({
	institutionId,
	onClose,
}: DetailModalProps) {
	const [institution, setInstitution] = useState<InstitutionDetail | null>(
		null
	);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (institutionId) {
			setLoading(true);
			getInstitutionById(institutionId)
				.then((data) => {
					setInstitution(data);
					setLoading(false);
				})
				.catch((error) => {
					toast.error(error.message || "Failed to load institution details");
					setLoading(false);
					onClose();
				});
		}
	}, [institutionId]);

	if (!institutionId) return null;

	const renderMetricRow = (metric: MetricData | undefined, label: string) => {
		if (!metric) return null;

		return (
			<tr className="border-b dark:border-gray-700">
				<th
					scope="row"
					className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
				>
					{label}
				</th>
				<td className="px-6 py-4">
					<div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
						{metric.score}
					</div>
				</td>
				<td className="px-6 py-4">
					<div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
						{metric.rank}
					</div>
				</td>
			</tr>
		);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
			<div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-900">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
					<div>
						<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
							{loading ? "Loading..." : institution?.name}
						</h2>
						{!loading && institution && (
							<p className="text-sm text-gray-600 dark:text-gray-400">
								{institution.country} • Rank: {institution.rank}
							</p>
						)}
					</div>
					<button
						onClick={onClose}
						className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800"
					>
						<span className="sr-only">Close</span>
						<svg
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				{/* Content */}
				<div
					className="overflow-y-auto p-6"
					style={{ maxHeight: "calc(90vh - 137px)" }}
				>
					{loading ? (
						<div className="flex h-40 items-center justify-center">
							<div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
						</div>
					) : institution ? (
						<div className="space-y-8">
							{/* Overall score */}
							<div className="flex justify-between items-center">
								<div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
									<h3 className="mb-1 text-lg font-medium text-gray-900 dark:text-white">
										Overall Score
									</h3>
									<p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
										{institution.overall_score}
									</p>
								</div>

								{institution.web_links && (
									<div>
										<a
											href={institution.web_links}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800"
										>
											Visit Official Website
											<svg
												className="h-4 w-4"
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

							{/* Classification */}
							{institution.classification && (
								<div className="rounded-lg border border-gray-200 overflow-hidden dark:border-gray-700">
									<div className="bg-gray-100 px-6 py-3 dark:bg-gray-800">
										<h3 className="text-lg font-medium text-gray-900 dark:text-white">
											Classification
										</h3>
									</div>
									<div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700">
										<div className="p-6 text-center">
											<div className="text-sm text-gray-500 dark:text-gray-400">
												Size
											</div>
											<div className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
												{institution.classification.size}
											</div>
										</div>
										<div className="p-6 text-center">
											<div className="text-sm text-gray-500 dark:text-gray-400">
												Focus
											</div>
											<div className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
												{institution.classification.focus}
											</div>
										</div>
										<div className="p-6 text-center">
											<div className="text-sm text-gray-500 dark:text-gray-400">
												Research
											</div>
											<div className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
												{institution.classification.research}
											</div>
										</div>
									</div>
								</div>
							)}

							{/* Metrics */}
							<div>
								<h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
									Performance Metrics
								</h3>
								<div className="relative overflow-x-auto shadow-sm rounded-lg">
									<table className="w-full text-sm text-left">
										<thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
											<tr>
												<th scope="col" className="px-6 py-3">
													Metric
												</th>
												<th scope="col" className="px-6 py-3">
													Score
												</th>
												<th scope="col" className="px-6 py-3">
													Rank
												</th>
											</tr>
										</thead>
										<tbody>
											{renderMetricRow(
												institution.academic_reputation,
												"Academic Reputation"
											)}
											{renderMetricRow(
												institution.employer_reputation,
												"Employer Reputation"
											)}
											{renderMetricRow(
												institution.faculty_student,
												"Faculty/Student Ratio"
											)}
											{renderMetricRow(
												institution.citations_per_faculty,
												"Citations per Faculty"
											)}
											{renderMetricRow(
												institution.international_faculty,
												"International Faculty"
											)}
											{renderMetricRow(
												institution.international_students,
												"International Students"
											)}
											{renderMetricRow(
												institution.international_research_network,
												"International Research Network"
											)}
											{renderMetricRow(
												institution.employment_outcomes,
												"Employment Outcomes"
											)}
											{renderMetricRow(
												institution.sustainability,
												"Sustainability"
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					) : (
						<div className="py-8 text-center">
							<p className="text-gray-500 dark:text-gray-400">
								Institution not found
							</p>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
					<div className="flex justify-end">
						<Button onClick={onClose}>Close</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
