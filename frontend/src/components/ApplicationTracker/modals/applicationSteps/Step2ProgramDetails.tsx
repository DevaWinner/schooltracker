import { Application } from "../../../../interfaces/applications";
import Input from "../../../form/input/InputField";
import Label from "../../../form/Label";

interface StepProps {
	data: Partial<Application>;
	updateData: (data: Partial<Application>) => void;
}

export default function Step2ProgramDetails({ data, updateData }: StepProps) {
	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;
		updateData({ [name]: value });
	};

	return (
		<div className="space-y-6">
			<h5 className="text-lg font-medium text-gray-700 dark:text-white/90">
				Program Details
			</h5>

			<div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
				<div>
					<Label htmlFor="status">Application Status</Label>
					<select
						className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
						id="status"
						name="status"
						value={data.status || "Draft"}
						onChange={handleChange}
					>
						<option value="Draft">Draft</option>
						<option value="In Progress">In Progress</option>
						<option value="Submitted">Submitted</option>
						<option value="Interview">Interview</option>
						<option value="Accepted">Accepted</option>
						<option value="Rejected">Rejected</option>
					</select>
					<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
						Current status of your application
					</p>
				</div>

				<div>
					<Label htmlFor="duration_years">Duration (Years)</Label>
					<Input
						id="duration_years"
						name="duration_years"
						placeholder="e.g. 2"
						value={data.duration_years || ""}
						onChange={handleChange}
						type="number"
						min="0"
						step="0.5"
					/>
				</div>

				<div>
					<Label htmlFor="tuition_fee">Tuition Fee</Label>
					<div className="relative">
						<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<span className="text-gray-500 dark:text-gray-400">$</span>
						</div>
						<Input
							id="tuition_fee"
							name="tuition_fee"
							placeholder="e.g. 50000"
							value={data.tuition_fee || ""}
							onChange={handleChange}
							className="pl-7"
						/>
					</div>
					<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
						Annual tuition fee in USD
					</p>
				</div>

				<div>
					<Label htmlFor="start_date">Program Start Date</Label>
					<Input
						type="date"
						id="start_date"
						name="start_date"
						value={data.start_date || ""}
						onChange={handleChange}
					/>
					<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
						When the program is expected to begin
					</p>
				</div>

				<div>
					<Label htmlFor="submitted_date">Application Submit Date</Label>
					<Input
						type="date"
						id="submitted_date"
						name="submitted_date"
						value={data.submitted_date || ""}
						onChange={handleChange}
					/>
				</div>

				<div>
					<Label htmlFor="decision_date">Decision Date</Label>
					<Input
						type="date"
						id="decision_date"
						name="decision_date"
						value={data.decision_date || ""}
						onChange={handleChange}
					/>
					<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
						Expected or actual date of decision
					</p>
				</div>
			</div>
		</div>
	);
}
