import { Application } from "../../../../types/applications";
import Input from "../../../form/input/InputField";
import Label from "../../../form/Label";

interface StepProps {
	data: Partial<Application>;
	updateData: (data: Partial<Application>) => void;
}

export default function Step1BasicInfo({ data, updateData }: StepProps) {
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
				Basic Information
			</h5>

			<div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
				<div>
					<Label htmlFor="institution" required>
						Institution
					</Label>
					<Input
						id="institution"
						name="institution"
						placeholder="University or college name"
						value={data.institution || ""}
						onChange={handleChange}
						required
					/>
					<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
						Enter the name of the university or institution
					</p>
				</div>

				<div>
					<Label htmlFor="institution_country">Country</Label>
					<select
						className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
						id="institution_country"
						name="institution_country"
						value={data.institution_country || ""}
						onChange={handleChange}
					>
						<option value="">Select country</option>
						<option value="USA">United States</option>
						<option value="Canada">Canada</option>
						<option value="UK">United Kingdom</option>
						<option value="Australia">Australia</option>
						<option value="Germany">Germany</option>
						<option value="Other">Other</option>
					</select>
				</div>

				<div>
					<Label htmlFor="program_name" required>
						Program Name
					</Label>
					<Input
						id="program_name"
						name="program_name"
						placeholder="e.g. Computer Science"
						value={data.program_name || ""}
						onChange={handleChange}
						required
					/>
				</div>

				<div>
					<Label htmlFor="department">Department</Label>
					<Input
						id="department"
						name="department"
						placeholder="e.g. School of Engineering"
						value={data.department || ""}
						onChange={handleChange}
					/>
				</div>

				<div>
					<Label htmlFor="degree_type">Degree Type</Label>
					<select
						className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
						id="degree_type"
						name="degree_type"
						value={data.degree_type || "Master"}
						onChange={handleChange}
					>
						<option value="Associate">Associate</option>
						<option value="Bachelor">Bachelor</option>
						<option value="Master">Master</option>
						<option value="PhD">PhD</option>
						<option value="Certificate">Certificate</option>
						<option value="Diploma">Diploma</option>
						<option value="Other">Other</option>
					</select>
				</div>
			</div>
		</div>
	);
}
