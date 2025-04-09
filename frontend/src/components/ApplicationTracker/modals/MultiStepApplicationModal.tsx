import { useState } from "react";
import { Application } from "../../../types/applications";
import Button from "../../ui/button/Button";
import StepIndicator from "./StepIndicator";
import Step1BasicInfo from "./applicationSteps/Step1BasicInfo";
import Step2ProgramDetails from "./applicationSteps/Step2ProgramDetails";
import Step3LinksResources from "./applicationSteps/Step3LinksResources";
import Step4Confirmation from "./applicationSteps/Step4Confirmation";

interface MultiStepApplicationModalProps {
	onSave: (data: Application) => void;
	onClose: () => void;
}

const TOTAL_STEPS = 4;

export default function MultiStepApplicationModal({
	onSave,
	onClose,
}: MultiStepApplicationModalProps) {
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState<Partial<Application>>({
		status: "Draft",
		degree_type: "Master",
	});

	// Updates values when the form is updated
	const updateFormData = (newData: Partial<Application>) => {
		setFormData((prev) => ({ ...prev, ...newData }));
	};

	const handleNext = () => {
		setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
	};

	const handlePrevious = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 1));
	};

	const handleSubmit = () => {
		// Add an ID if this is a new application
		const finalData = {
			...formData,
			id: formData.id || Math.floor(Date.now() / 1000), // Using timestamp as ID if none exists
			created_at: formData.created_at || new Date().toISOString(),
			updated_at: new Date().toISOString(),
			program_name: formData.program_name || "Unnamed Program", // Ensure required fields have values
		} as Application;

		onSave(finalData);
	};

	// Render the correct step based on currentStep
	const renderStep = () => {
		switch (currentStep) {
			case 1:
				return <Step1BasicInfo data={formData} updateData={updateFormData} />;
			case 2:
				return (
					<Step2ProgramDetails data={formData} updateData={updateFormData} />
				);
			case 3:
				return (
					<Step3LinksResources data={formData} updateData={updateFormData} />
				);
			case 4:
				return <Step4Confirmation data={formData} />;
			default:
				return <Step1BasicInfo data={formData} updateData={updateFormData} />;
		}
	};

	return (
		<div className="no-scrollbar relative w-full overflow-hidden rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-6">
			<div className="mb-6 border-b border-gray-200 pb-4 dark:border-gray-700">
				<h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
					{formData.id ? "Edit Application" : "Add New Application"}
				</h4>
				<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
					{currentStep === TOTAL_STEPS
						? "Review and submit your application details"
						: "Complete the form to add your application"}
				</p>
			</div>

			{/* Step indicators */}
			<StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />

			{/* Step content */}
			<div className="custom-scrollbar max-h-[60vh] overflow-y-auto px-2 py-4">
				{renderStep()}
			</div>

			{/* Navigation buttons */}
			<div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4 dark:border-gray-700">
				<div>
					{currentStep > 1 && (
						<Button size="sm" variant="outline" onClick={handlePrevious}>
							Previous
						</Button>
					)}
				</div>
				<div className="flex items-center gap-3">
					<Button size="sm" variant="outline" onClick={onClose}>
						Cancel
					</Button>
					{currentStep < TOTAL_STEPS ? (
						<Button size="sm" onClick={handleNext}>
							Next
						</Button>
					) : (
						<Button size="sm" onClick={handleSubmit}>
							Submit Application
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
