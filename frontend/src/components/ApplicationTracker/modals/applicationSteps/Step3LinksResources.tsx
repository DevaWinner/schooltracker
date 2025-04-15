import { Application } from "../../../../interfaces/applications";
import Input from "../../../form/input/InputField";
import Label from "../../../form/Label";

interface StepProps {
	data: Partial<Application>;
	updateData: (data: Partial<Application>) => void;
}

export default function Step3LinksResources({ data, updateData }: StepProps) {
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
				Links & Resources
			</h5>

			<div className="grid grid-cols-1 gap-x-6 gap-y-5">
				<div>
					<Label htmlFor="application_link">Application Link</Label>
					<Input
						id="application_link"
						name="application_link"
						placeholder="https://..."
						value={data.application_link || ""}
						onChange={handleChange}
						type="url"
					/>
					<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
						URL to the application portal or form
					</p>
				</div>

				<div>
					<Label htmlFor="program_info_link">Program Info Link</Label>
					<Input
						id="program_info_link"
						name="program_info_link"
						placeholder="https://..."
						value={data.program_info_link || ""}
						onChange={handleChange}
						type="url"
					/>
					<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
						Link to the program's website or brochure
					</p>
				</div>

				<div>
					<Label htmlFor="scholarship_link">Scholarship Link</Label>
					<Input
						id="scholarship_link"
						name="scholarship_link"
						placeholder="https://..."
						value={data.scholarship_link || ""}
						onChange={handleChange}
						type="url"
					/>
					<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
						Link to scholarship or funding information
					</p>
				</div>

				<div>
					<Label htmlFor="notes">Notes</Label>
					<textarea
						id="notes"
						name="notes"
						rows={4}
						className="h-auto w-full resize-y appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
						placeholder="Additional notes about your application..."
						value={data.notes || ""}
						onChange={handleChange}
					></textarea>
					<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
						Any additional information, reminders, or important details about
						this application
					</p>
				</div>
			</div>
		</div>
	);
}
