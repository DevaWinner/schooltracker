interface StepIndicatorProps {
	currentStep: number;
	totalSteps: number;
}

export default function StepIndicator({
	currentStep,
	totalSteps,
}: StepIndicatorProps) {
	return (
		<div className="mb-8">
			<div className="flex justify-between">
				{Array.from({ length: totalSteps }).map((_, index) => {
					const stepNumber = index + 1;
					const isActive = stepNumber === currentStep;
					const isCompleted = stepNumber < currentStep;

					return (
						<div key={index} className="flex flex-col items-center">
							<div
								className={`
                  flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium
                  ${
										isCompleted
											? "bg-brand-600 text-white dark:bg-brand-500"
											: isActive
											? "bg-brand-100 text-brand-600 ring-2 ring-brand-600 dark:bg-brand-900/40 dark:text-brand-400 dark:ring-brand-500"
											: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
									}
                `}
							>
								{isCompleted ? (
									<svg
										className="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								) : (
									stepNumber
								)}
							</div>
							<div
								className={`mt-2 hidden text-xs font-medium sm:block
                ${
									isCompleted || isActive
										? "text-gray-700 dark:text-brand-300"
										: "text-gray-500 dark:text-gray-400"
								}`}
							>
								{stepNumber === 1 && "Basic Info"}
								{stepNumber === 2 && "Program Details"}
								{stepNumber === 3 && "Resources"}
								{stepNumber === 4 && "Confirmation"}
							</div>
						</div>
					);
				})}
			</div>

			{/* Progress bar */}
			<div className="relative mt-4">
				<div className="absolute inset-0 flex items-center" aria-hidden="true">
					<div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700"></div>
				</div>
				<div className="absolute inset-0 flex items-center" aria-hidden="true">
					<div
						className="h-0.5 bg-brand-600 dark:bg-brand-500 transition-all duration-300"
						style={{
							width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
						}}
					></div>
				</div>
			</div>
		</div>
	);
}
