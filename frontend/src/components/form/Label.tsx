import React from "react";

interface LabelProps {
	children: React.ReactNode;
	className?: string;
	htmlFor?: string;
	required?: boolean;
}

export default function Label({
	children,
	className = "",
	htmlFor = "",
	required = false,
}: LabelProps) {
	return (
		<label
			htmlFor={htmlFor}
			className={`mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/80 ${className}`}
		>
			{children}
			{required && (
				<span className="ml-0.5 text-red-600 dark:text-red-400">*</span>
			)}
		</label>
	);
}
