import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";

interface UserBackgroundModalProps {
	userInfo: any;
	onSave: () => void;
	onClose: () => void;
}

export default function UserBackgroundModal({
	userInfo,
	onSave,
	onClose,
}: UserBackgroundModalProps) {
	return (
		<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
			<div className="px-2 pr-14">
				<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
					Academic Background
				</h4>
				<p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
					Update your educational history and academic achievements.
				</p>
			</div>

			<form className="flex flex-col">
				<div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
					{userInfo.academic_background.map((academic: any, index: number) => (
						<div
							key={index}
							className="mb-6 border-b border-gray-200 dark:border-gray-800 pb-6"
						>
							<h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90">
								Institution {index + 1}
							</h5>
							<div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
								<div>
									<Label>Institution Name</Label>
									<Input type="text" value={academic.institution_name} />
								</div>
								<div>
									<Label>Degree</Label>
									<Input type="text" value={academic.degree} />
								</div>
								<div>
									<Label>Field of Study</Label>
									<Input type="text" value={academic.field_of_study} />
								</div>
								<div>
									<Label>GPA</Label>
									<Input type="text" value={academic.gpa} />
								</div>
								<div>
									<Label>Start Date</Label>
									<Input type="date" value={academic.start_date} />
								</div>
								<div>
									<Label>End Date</Label>
									<Input type="date" value={academic.end_date} />
								</div>
								<div className="lg:col-span-2">
									<Label>Description</Label>
									<Input type="text" value={academic.description} />
								</div>
							</div>
						</div>
					))}
				</div>
				<div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
					<Button size="sm" variant="outline" onClick={onClose}>
						Close
					</Button>
					<Button size="sm" onClick={onSave}>
						Save Changes
					</Button>
				</div>
			</form>
		</div>
	);
}
