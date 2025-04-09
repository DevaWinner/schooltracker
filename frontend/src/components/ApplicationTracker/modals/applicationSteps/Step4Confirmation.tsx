import { Application } from "../../../../types/applications";

interface StepProps {
	data: Partial<Application>;
}

export default function Step4Confirmation({ data }: StepProps) {
	// Format date for display
	const formatDate = (dateStr?: string): string => {
		if (!dateStr) return "Not specified";
		const date = new Date(dateStr);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	// Helper function to get status badge color
	const getStatusColor = (status?: string): string => {
		switch (status) {
			case "Draft":
				return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
			case "In Progress":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
			case "Submitted":
				return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
			case "Interview":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
			case "Accepted":
				return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
			case "Rejected":
				return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
		}
	};

	return (
		<div className="space-y-6">
			<h5 className="text-lg font-medium text-gray-700 dark:text-white/90">
				Review Your Application
			</h5>

			<div className="rounded-lg border border-gray-200 overflow-hidden dark:border-gray-700">
				<div className="bg-gray-50 px-4 py-3 dark:bg-gray-800">
					<h6 className="font-medium">{data.program_name || "New Program"}</h6>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						{data.institution}
					</p>
				</div>

				<div className="px-4 py-3 bg-white dark:bg-gray-900">
					<dl className="divide-y divide-gray-200 dark:divide-gray-700">
						<div className="grid grid-cols-1 gap-2 py-3 sm:grid-cols-3 sm:gap-4">
							<dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
								Status
							</dt>
							<dd className="text-sm text-gray-900 dark:text-white sm:col-span-2">
								<span
									className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(
										data.status
									)}`}
								>
									{data.status}
								</span>
							</dd>
						</div>
						<div className="grid grid-cols-1 gap-2 py-3 sm:grid-cols-3 sm:gap-4">
							<dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
								Degree Type
							</dt>
							<dd className="text-sm text-gray-900 dark:text-white sm:col-span-2">
								{data.degree_type}
							</dd>
						</div>
						<div className="grid grid-cols-1 gap-2 py-3 sm:grid-cols-3 sm:gap-4">
							<dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
								Department
							</dt>
							<dd className="text-sm text-gray-900 dark:text-white sm:col-span-2">
								{data.department || "Not specified"}
							</dd>
						</div>
						<div className="grid grid-cols-1 gap-2 py-3 sm:grid-cols-3 sm:gap-4">
							<dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
								Program Start
							</dt>
							<dd className="text-sm text-gray-900 dark:text-white sm:col-span-2">
								{formatDate(data.start_date)}
							</dd>
						</div>
						<div className="grid grid-cols-1 gap-2 py-3 sm:grid-cols-3 sm:gap-4">
							<dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
								Duration
							</dt>
							<dd className="text-sm text-gray-900 dark:text-white sm:col-span-2">
								{data.duration_years
									? `${data.duration_years} years`
									: "Not specified"}
							</dd>
						</div>
						<div className="grid grid-cols-1 gap-2 py-3 sm:grid-cols-3 sm:gap-4">
							<dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
								Tuition Fee
							</dt>
							<dd className="text-sm text-gray-900 dark:text-white sm:col-span-2">
								{data.tuition_fee ? `$${data.tuition_fee}` : "Not specified"}
							</dd>
						</div>
					</dl>
				</div>
			</div>

			<div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
				<h6 className="mb-2 font-medium text-gray-900 dark:text-white">
					Terms and Disclaimer
				</h6>
				<div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
					<p>By submitting this application record, you acknowledge that:</p>
					<ul className="list-disc pl-5 space-y-1">
						<li>
							This information is stored locally for your personal tracking
							purposes only.
						</li>
						<li>
							This does not constitute an actual submission to any institution.
						</li>
						<li>
							You are responsible for keeping track of deadlines and
							requirements.
						</li>
						<li>You can edit or delete this application record at any time.</li>
					</ul>
					<p className="font-medium text-gray-900 dark:text-white">
						Click "Submit Application" to save this information to your
						application tracker.
					</p>
				</div>
			</div>
		</div>
	);
}
