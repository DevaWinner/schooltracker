import { useNavigate } from "react-router-dom";
import { Application, ApplicationCardProps } from "../../types/applications";

export default function ApplicationCard({
	data,
	onEdit,
	onDelete,
	onRefresh,
	onView,
}: ApplicationCardProps) {
	const navigate = useNavigate();

	const handleEdit = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onEdit) onEdit(data);
	};

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onDelete) onDelete(data.id);
	};

	const handleCardClick = () => {
		navigate(`/applications/detail/${data.id}`);
	};

	// Helper function to format date
	const formatDate = (dateStr?: string): string => {
		if (!dateStr) return "Not set";
		const date = new Date(dateStr);
		return date.toLocaleDateString();
	};

	// Helper function to get status badge color
	const getStatusColor = (status: string): string => {
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
		<div
			className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03] h-[320px] flex flex-col cursor-pointer hover:border-blue-300 dark:hover:border-blue-400/30 transition-colors duration-200"
			onClick={handleCardClick}
		>
			<div className="mb-3 flex items-center justify-between">
				<div>
					<h3 className="text-base font-medium text-gray-900 dark:text-white">
						{data.program_name}
					</h3>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						{data.institution_details?.name ||
							data.institution_name ||
							data.institution ||
							"Unknown Institution"}
					</p>
				</div>
				<span
					className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
						data.status
					)}`}
				>
					{data.status}
				</span>
			</div>

			<div className="flex-1 overflow-y-auto space-y-2 border-t border-gray-100 pt-3 dark:border-gray-800">
				<div className="flex justify-between">
					<span className="text-sm text-gray-500 dark:text-gray-400">
						Degree:
					</span>
					<span className="text-sm font-medium text-gray-900 dark:text-white">
						{data.degree_type}
					</span>
				</div>

				<div className="flex justify-between">
					<span className="text-sm text-gray-500 dark:text-gray-400">
						Start Date:
					</span>
					<span className="text-sm text-gray-900 dark:text-white">
						{formatDate(data.start_date)}
					</span>
				</div>

				<div className="flex justify-between">
					<span className="text-sm text-gray-500 dark:text-gray-400">
						Submitted:
					</span>
					<span className="text-sm text-gray-900 dark:text-white">
						{formatDate(data.submitted_date)}
					</span>
				</div>

				{data.decision_date && (
					<div className="flex justify-between">
						<span className="text-sm text-gray-500 dark:text-gray-400">
							Decision Date:
						</span>
						<span className="text-sm text-gray-900 dark:text-white">
							{formatDate(data.decision_date)}
						</span>
					</div>
				)}

				{data.notes && (
					<div className="mt-2">
						<span className="text-sm text-gray-500 dark:text-gray-400">
							Notes:
						</span>
						<p className="text-sm text-gray-900 dark:text-white mt-1 line-clamp-2">
							{data.notes}
						</p>
					</div>
				)}
			</div>

			<div className="mt-4 flex items-center justify-end space-x-2 border-t border-gray-100 pt-3 dark:border-gray-800">
				<button
					onClick={handleEdit}
					className="rounded-lg border border-transparent p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-300"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
						/>
					</svg>
				</button>
				<button
					onClick={handleDelete}
					className="rounded-lg border border-transparent p-1 text-red-600 hover:bg-red-50 hover:text-red-800 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
}
