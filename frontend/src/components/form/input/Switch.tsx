import { useState } from "react";

interface SwitchProps {
	label: string;
	defaultChecked?: boolean;
	disabled?: boolean;
	onChange?: (checked: boolean) => void;
	color?: "blue" | "gray";
}

const Switch: React.FC<SwitchProps> = ({
	label,
	defaultChecked = false,
	disabled = false,
	onChange,
	color = "blue", // Default to blue color
}) => {
	const [isChecked, setIsChecked] = useState(defaultChecked);

	const handleToggle = () => {
		if (disabled) return;
		const newCheckedState = !isChecked;
		setIsChecked(newCheckedState);
		if (onChange) {
			onChange(newCheckedState);
		}
	};

	const switchColors =
		color === "blue"
			? {
					background: isChecked
						? "bg-brand-500 "
						: "bg-gray-200 dark:bg-white/10", // Blue version
					knob: isChecked
						? "translate-x-full bg-white"
						: "translate-x-0 bg-white",
			  }
			: {
					background: isChecked
						? "bg-gray-800 dark:bg-white/10"
						: "bg-gray-200 dark:bg-white/10", // Gray version
					knob: isChecked
						? "translate-x-full bg-white"
						: "translate-x-0 bg-white",
			  };

	return (
		<div
			className={`flex items-center gap-3 text-sm font-medium ${
				disabled ? "text-gray-400" : "text-gray-700 dark:text-gray-400"
			}`}
		>
			{/* Make only the switch clickable, not the entire label */}
			<div
				className="relative cursor-pointer"
				onClick={handleToggle}
				role="switch"
				aria-checked={isChecked}
				tabIndex={disabled ? -1 : 0}
				aria-label={label}
			>
				<div
					className={`block transition duration-150 ease-linear h-6 w-11 rounded-full ${
						disabled
							? "bg-gray-100 pointer-events-none dark:bg-gray-800"
							: switchColors.background
					}`}
				></div>
				<div
					className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow-theme-sm duration-150 ease-linear transform ${switchColors.knob}`}
				></div>
			</div>
			<span>{label}</span>
		</div>
	);
};

export default Switch;
