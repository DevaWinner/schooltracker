import { Institution } from "../../types/institutions";
import Button from "../ui/button/Button";

interface InstitutionCardProps {
	institution: Institution;
	onViewDetails: (id: string) => void;
}

export default function InstitutionCard({
	institution,
	onViewDetails,
}: InstitutionCardProps) {
	return (
		<div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
			<div className="p-5">
				<div className="flex items-start justify-between">
					<div>
						<h3 className="mb-1 truncate text-lg font-semibold text-gray-900 dark:text-white">
							{institution.name}
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							{institution.country}
						</p>
					</div>
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
						<span className="text-xs font-bold">{institution.rank}</span>
					</div>
				</div>

				<div className="mt-4 flex items-center justify-between">
					<div>
						<div className="text-xs text-gray-500 dark:text-gray-400">
							Overall Score
						</div>
						<div className="font-medium text-gray-900 dark:text-white">
							{institution.overall_score}
						</div>
					</div>

					<Button
						variant="outline"
						size="sm"
						onClick={() => onViewDetails(institution.id)}
					>
						View Details
					</Button>
				</div>
			</div>
		</div>
	);
}
