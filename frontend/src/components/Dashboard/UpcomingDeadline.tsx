import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "../ui/table";
import { tableData as data } from "../ApplicationTracker/placeholderData";
import { Link } from "react-router";
import { ROUTES } from "../../constants/Routes";
import { Application } from "../../types/applications";

export default function UpcomingDeadline() {
	let application: Application;
	const toDate = (date: string) => {
		const dateObject = new Date(date);
		return dateObject;
	};
	const hasData = () => {
		let date: Date | null;
		if (data) {
			data.map((data) => {
				if (
					(data.status.includes("In Progress") &&
						toDate(data.decision_date) < date) ||
					date == null
				) {
					date = toDate(data.decision_date);
					application = data;
				}
			});
		}
		return "No upcoming deadlines, come back later!";
	};

	return (
		<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
			<div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
						Upcoming Deadline
					</h3>
				</div>

				<div className="flex items-center gap-3">
					<Link
						className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
						to={ROUTES.Applications.tracker}
					>
						See all applications
					</Link>
				</div>
			</div>
			<div className="max-w-full overflow-x-auto">
				<Table>
					{/* Table Header */}
					<TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
						<TableRow>
							<TableCell
								isHeader
								className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
							>
								Program ID
							</TableCell>
							<TableCell
								isHeader
								className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
							>
								Start Date
							</TableCell>
							<TableCell
								isHeader
								className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
							>
								Status
							</TableCell>
							<TableCell
								isHeader
								className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
							>
								Submission Date
							</TableCell>
							<TableCell
								isHeader
								className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
							>
								Deadline
							</TableCell>
							<TableCell
								isHeader
								className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
							>
								Notes
							</TableCell>
							<TableCell
								isHeader
								className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
							>
								Edit
							</TableCell>
							<TableCell
								isHeader
								className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
							>
								Delete
							</TableCell>
						</TableRow>
					</TableHeader>

					{/* Table Body */}

					<TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
						{hasData()}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
