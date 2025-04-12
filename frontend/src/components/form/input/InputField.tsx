import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	className?: string;
	icon?: React.ReactNode;
	iconPosition?: "left" | "right";
}

const Input: React.FC<InputProps> = ({
	className = "",
	icon,
	iconPosition = "left",
	...props
}) => {
	const baseClasses =
		"h-11 w-full rounded-lg border appearance-none text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:text-white/90 dark:placeholder:text-gray-500 dark:bg-gray-800 dark:border-gray-700 transition-all duration-200";

	const paddingClasses = icon
		? iconPosition === "left"
			? "pl-10 pr-4"
			: "pr-10 pl-4"
		: "px-4 py-2.5";

	return (
		<div className="relative w-full">
			{icon && (
				<div
					className={`absolute inset-y-0 ${
						iconPosition === "left" ? "left-0" : "right-0"
					} flex items-center ${
						iconPosition === "left" ? "pl-3" : "pr-3"
					} pointer-events-none text-gray-500 dark:text-gray-400`}
				>
					{icon}
				</div>
			)}
			<input
				className={`${baseClasses} ${paddingClasses} ${className}`}
				{...props}
			/>
		</div>
	);
};

export default Input;
