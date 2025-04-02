import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";

interface AcademicBackgroundModalProps {
	userInfo: any;
	onSave: () => void;
	onClose: () => void;
}

export default function AcademicBackgroundModal({
	onSave,
	onClose,
}: AcademicBackgroundModalProps) {
	return (
		<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
			<div className="px-2 pr-14">
				<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
					Add Academic Background
				</h4>
				<p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
					Add your educational history and academic achievements.
				</p>
			</div>

			<form className="flex flex-col">
				<div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
					<div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
						<div>
							<Label>Institution Name</Label>
							<Input type="text" placeholder="Enter institution name" />
						</div>
						<div>
							<Label>Degree</Label>
							<Input type="text" placeholder="Enter degree" />
						</div>
						<div>
							<Label>Field of Study</Label>
							<Input type="text" placeholder="Enter field of study" />
						</div>
						<div>
							<Label>GPA</Label>
							<Input type="text" placeholder="Enter GPA" />
						</div>
						<div>
							<Label>Start Date</Label>
							<Input type="date" />
						</div>
						<div>
							<Label>End Date</Label>
							<Input type="date" />
						</div>
						<div className="lg:col-span-2">
							<Label>Description</Label>
							<Input
								type="text"
								placeholder="Enter description, achievements, etc."
							/>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
					<Button size="sm" variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button size="sm" onClick={onSave}>
						Save
					</Button>
				</div>
			</form>
		</div>
	);
}
