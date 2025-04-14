import { useState, useEffect } from "react";
import { Application } from "../../../types/applications";
import { getInstitutionsForSelect } from "../../../api/institutions";
import Button from "../../ui/button/Button";
import StepIndicator from "./StepIndicator";
import Step1BasicInfo from "./applicationSteps/Step1BasicInfo";
import Step2ProgramDetails from "./applicationSteps/Step2ProgramDetails";
import Step3LinksResources from "./applicationSteps/Step3LinksResources";
import Step4Confirmation from "./applicationSteps/Step4Confirmation";
import { toast } from "react-toastify";
import { Modal } from "../../ui/modal";

interface Institution {
	id: string;
	name: string;
	country: string;
}

interface MultiStepApplicationModalProps {
	isOpen: boolean;
	onSave: (data: Application) => Promise<void>;
	onClose: () => void;
	isLoading?: boolean;
	data?: Application;
}

const TOTAL_STEPS = 4;

export default function MultiStepApplicationModal({
	isOpen,
	onSave,
	onClose,
	data,
}: MultiStepApplicationModalProps) {
	const [formData, setFormData] = useState<Partial<Application>>(
		data || {
			status: "Draft",
			degree_type: "Master",
		}
	);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [currentStep, setCurrentStep] = useState(1);
	const [institutions, setInstitutions] = useState<Institution[]>([]);
	const [isLoadingInstitutions, setIsLoadingInstitutions] = useState(false);

	useEffect(() => {
		const fetchInstitutions = async () => {
			setIsLoadingInstitutions(true);
			try {
				const institutionsList = await getInstitutionsForSelect();
				setInstitutions(institutionsList);

				if (data?.institution_id) {
					const selectedInstitution = institutionsList.find(
						(inst) => inst.id === data.institution_id
					);

					if (selectedInstitution) {
						setFormData((prev) => ({
							...prev,
							institution_id: selectedInstitution.id,
							institution: selectedInstitution.name,
							institution_country: selectedInstitution.country,
						}));
					}
				}
			} catch (error) {
				// Remove console.error
			} finally {
				setIsLoadingInstitutions(false);
			}
		};

		fetchInstitutions();
	}, [data]);

	const updateFormData = (newData: Partial<Application>) => {
		setFormData((prev) => ({ ...prev, ...newData }));
	};

	const handleNext = () => {
		setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
	};

	const handlePrevious = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 1));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (isSubmitting) return;

		// Add validation for required fields
		if (!formData.program_name) {
			toast.error("Program name is required");
			return;
		}

		if (!formData.institution_id) {
			toast.error("Please select a valid institution from the dropdown");
			return;
		}

		setIsSubmitting(true);
		try {
			// Ensure institution field has the ID value for API submission
			const finalData = {
				...formData,
				institution: formData.institution_id,
				created_at: formData.created_at || new Date().toISOString(),
				updated_at: new Date().toISOString(),
				program_name: formData.program_name || "Unnamed Program",
			} as Application;

			if ("id" in finalData) {
				delete (finalData as Record<string, any>).id;
			}

			await onSave(finalData);
		} catch (error) {
			// Handle error if needed
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSubmitButtonClick = () => {
		const event = new Event("submit") as unknown as React.FormEvent;
		handleSubmit(event);
	};

	const renderStep = () => {
		switch (currentStep) {
			case 1:
				return (
					<Step1BasicInfo
						data={formData}
						updateData={updateFormData}
						institutions={institutions}
						isLoadingInstitutions={isLoadingInstitutions}
					/>
				);
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
		<Modal isOpen={isOpen} onClose={onClose}>
			<div className="flex flex-col h-[85vh] bg-white dark:bg-gray-900 rounded-3xl overflow-hidden w-[90vw] lg:w-[600px]">
				{/* Fixed Header */}
				<div className="w-full flex-shrink-0 border-b border-gray-200 px-8 pt-6 pb-4 dark:border-gray-700">
					<h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
						{formData.id ? "Edit Application" : "Add New Application"}
					</h4>
					<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
						{currentStep === TOTAL_STEPS
							? "Review and submit your application details"
							: "Complete the form to add your application"}
					</p>
				</div>

				<div className="w-full px-8 mt-2 flex-shrink-0">
					<StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />
				</div>

				{/* Scrollable Content */}
				<div className="flex-1 overflow-y-auto min-h-0">
					<div className="w-full px-8 py-4">{renderStep()}</div>
				</div>

				{/* Fixed Footer */}
				<div className="w-full flex-shrink-0 flex items-center justify-between border-t border-gray-200 px-8 py-4 bg-white dark:bg-gray-900 dark:border-gray-700">
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
							<Button
								size="sm"
								onClick={handleSubmitButtonClick}
								disabled={isSubmitting}
							>
								{isSubmitting ? "Submitting..." : "Submit Application"}
							</Button>
						)}
					</div>
				</div>
			</div>
		</Modal>
	);
}
