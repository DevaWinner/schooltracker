import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import { useState } from "react";
import { Application } from "../../../types/applications";

interface ApplicationTableModalProps {
	data: Partial<Application>;
	onSave: (data: Application) => void;
	onClose: () => void;
}

export default function ApplicationTableModal({
	data,
	onSave,
	onClose,
}: ApplicationTableModalProps) {
	const [formData, setFormData] = useState({
		id: data.id || Math.floor(Date.now() / 1000),
		program_name: data.program_name || "",
		institution: data.institution || "",
		degree_type: data.degree_type || "Master",
		department: data.department || "",
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
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const submitForm = (e: React.FormEvent) => {
		e.preventDefault();
		const applicationData = {
			...formData,
			created_at: data.created_at || new Date().toISOString(),
			updated_at: new Date().toISOString(),
		} as Application;
		onSave(applicationData);
	};

	return (
		<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
			<div className="px-2 pr-14">
				<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
					{data.id ? "Edit Application" : "Add Application"}
				</h4>
				<p className="text-sm text-gray-500 dark:text-gray-400">
					Enter the details of your application
				</p>
			</div>

			<form onSubmit={submitForm} className="flex flex-col">
				<div className="custom-scrollbar max-h-[60vh] overflow-y-auto px-2 pb-3 mt-6">
					<div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
						<div>
							<Label htmlFor="institution" required>
								Institution
							</Label>
							<Input
								id="institution"
								name="institution"
								placeholder="University or college name"
								value={formData.institution}
								onChange={changeForm}
								required
							/>
						</div>
						<div>
							<Label htmlFor="program_name" required>
								Program Name
							</Label>
							<Input
								id="program_name"
								name="program_name"
								placeholder="e.g. Computer Science"
								value={formData.program_name}
								onChange={changeForm}
								required
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
								<option value="Pending">Pending</option>
								<option value="Accepted">Accepted</option>
								<option value="Rejected">Rejected</option>
								<option value="Deferred">Deferred</option>
								<option value="Withdrawn">Withdrawn</option>
							</select>
						</div>
						<div>
							<Label htmlFor="start_date">Start Date</Label>
							<Input
								type="date"
								id="start_date"
								name="start_date"
								value={formData.start_date}
								onChange={changeForm}
							/>
						</div>
						<div>
							<Label htmlFor="submitted_date">Submitted Date</Label>
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
						<div className="lg:col-span-2">
							<Label htmlFor="notes">Notes</Label>
							<textarea
								id="notes"
								name="notes"
								rows={3}
								className="h-auto w-full resize-y appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
								placeholder="Additional notes about your application..."
								value={formData.notes}
								onChange={changeForm}
							/>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-3 px-2 mt-6 lg:justify-end border-t border-gray-200 pt-4 dark:border-gray-700">
					<Button size="sm" variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button size="sm" type="submit">
						Save
					</Button>
				</div>
			</form>
		</div>
	);
}
