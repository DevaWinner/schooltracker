/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import { useState } from "react";
import { Application } from "../../../types/applications";

interface EditApplicationModalProps {
	data: Application;
	onSave: (data: Application) => void;
	onClose: () => void;
}

export default function EditApplicationModal({
	data,
	onSave,
	onClose,
}: EditApplicationModalProps) {
	const [formData, setData] = useState({
		id: data.id,
		institution: data.institution || "",
		program_name: data.program_name || "",
		degree_type: data.degree_type || "Master",
		department: data.department || "",
		duration_years: data.duration_years || "",
		tuition_fee: data.tuition_fee || "",
		application_link: data.application_link || "",
		scholarship_link: data.scholarship_link || "",
		program_info_link: data.program_info_link || "",
		status: data.status || "Draft",
		start_date: data.start_date || "",
		submitted_date: data.submitted_date || "",
		decision_date: data.decision_date || "",
		notes: data.notes || "",
	});

	// Updates values when the form is updated
	const changeForm = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;
		setData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const submitForm = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(formData as any);
	};

	return (
		<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-7">
			<div className="mb-6 px-2">
				<h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
					Edit Application
				</h4>
				<p className="text-sm text-gray-500 dark:text-gray-400">
					Update your application details
				</p>
			</div>

			<form onSubmit={submitForm} className="flex flex-col">
				<div className="custom-scrollbar max-h-[60vh] overflow-y-auto px-2 pb-3">
					<div className="mb-6">
						<h5 className="mb-4 text-lg font-medium text-gray-700 dark:text-white/80">
							Program Information
						</h5>
						<div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
							<div>
								<Label htmlFor="institution">Institution</Label>
								<Input
									id="institution"
									name="institution"
									placeholder="Institution name or ID"
									value={formData.institution}
									onChange={changeForm}
								/>
							</div>
							<div>
								<Label htmlFor="program_name">Program Name</Label>
								<Input
									id="program_name"
									name="program_name"
									placeholder="e.g. Computer Science"
									value={formData.program_name}
									onChange={changeForm}
								/>
							</div>
							<div>
								<Label htmlFor="degree_type">Degree Type</Label>
								<select
									className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
									id="degree_type"
									name="degree_type"
									value={formData.degree_type}
									onChange={changeForm}
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
							<div>
								<Label htmlFor="department">Department</Label>
								<Input
									id="department"
									name="department"
									placeholder="e.g. School of Engineering"
									value={formData.department}
									onChange={changeForm}
								/>
							</div>
							<div>
								<Label htmlFor="duration_years">Duration (Years)</Label>
								<Input
									id="duration_years"
									name="duration_years"
									placeholder="e.g. 2"
									value={formData.duration_years}
									onChange={changeForm}
								/>
							</div>
							<div>
								<Label htmlFor="tuition_fee">Tuition Fee</Label>
								<Input
									id="tuition_fee"
									name="tuition_fee"
									placeholder="e.g. 50000"
									value={formData.tuition_fee}
									onChange={changeForm}
								/>
							</div>
						</div>
					</div>

					<div className="mb-6">
						<h5 className="mb-4 text-lg font-medium text-gray-700 dark:text-white/80">
							Links & Resources
						</h5>
						<div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
							<div>
								<Label htmlFor="application_link">Application Link</Label>
								<Input
									id="application_link"
									name="application_link"
									placeholder="https://..."
									value={formData.application_link}
									onChange={changeForm}
								/>
							</div>
							<div>
								<Label htmlFor="scholarship_link">Scholarship Link</Label>
								<Input
									id="scholarship_link"
									name="scholarship_link"
									placeholder="https://..."
									value={formData.scholarship_link}
									onChange={changeForm}
								/>
							</div>
							<div>
								<Label htmlFor="program_info_link">Program Info Link</Label>
								<Input
									id="program_info_link"
									name="program_info_link"
									placeholder="https://..."
									value={formData.program_info_link}
									onChange={changeForm}
								/>
							</div>
						</div>
					</div>

					<div className="mb-6">
						<h5 className="mb-4 text-lg font-medium text-gray-700 dark:text-white/80">
							Status & Dates
						</h5>
						<div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
							<div>
								<Label htmlFor="status">Status</Label>
								<select
									className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
									id="status"
									name="status"
									value={formData.status}
									onChange={changeForm}
								>
									<option value="Draft">Draft</option>
									<option value="In Progress">In Progress</option>
									<option value="Submitted">Submitted</option>
									<option value="Interview">Interview</option>
									<option value="Accepted">Accepted</option>
									<option value="Rejected">Rejected</option>
								</select>
							</div>
							<div>
								<Label htmlFor="start_date">Program Start Date</Label>
								<Input
									type="date"
									id="start_date"
									name="start_date"
									value={formData.start_date}
									onChange={changeForm}
								/>
							</div>
							<div>
								<Label htmlFor="submitted_date">Application Submit Date</Label>
								<Input
									type="date"
									id="submitted_date"
									name="submitted_date"
									value={formData.submitted_date}
									onChange={changeForm}
								/>
							</div>
							<div>
								<Label htmlFor="decision_date">Decision Date</Label>
								<Input
									type="date"
									id="decision_date"
									name="decision_date"
									value={formData.decision_date}
									onChange={changeForm}
								/>
							</div>
						</div>
					</div>

					<div className="mb-6">
						<h5 className="mb-4 text-lg font-medium text-gray-700 dark:text-white/80">
							Additional Information
						</h5>
						<div>
							<Label htmlFor="notes">Notes</Label>
							<textarea
								id="notes"
								name="notes"
								rows={4}
								className="h-auto w-full resize-y appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
								placeholder="Additional notes about your application..."
								value={formData.notes}
								onChange={changeForm}
							></textarea>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-3 border-t border-gray-200 px-2 pt-6 mt-4 dark:border-gray-700 lg:justify-end">
					<Button size="sm" variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button size="sm" type="submit">
						Save Changes
					</Button>
				</div>
			</form>
		</div>
	);
}
