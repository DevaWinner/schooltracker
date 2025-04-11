import React from "react";

interface FormFieldProps {
	label: string;
	name: string;
	type:
		| "text"
		| "email"
		| "password"
		| "textarea"
		| "select"
		| "date"
		| "number";
	value: string | number | undefined;
	onChange: (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => void;
	placeholder?: string;
	required?: boolean;
	options?: { value: string; label: string }[];
	disabled?: boolean;
	error?: string;
	className?: string;
}

export default function FormField({
	label,
	name,
	type,
	value,
	onChange,
	placeholder,
	required,
	options,
	disabled,
	error,
	className,
}: FormFieldProps) {
	const baseInputClasses =
		"w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400";

	const renderField = () => {
		switch (type) {
			case "textarea":
				return (
					<textarea
						id={name}
						name={name}
						value={value || ""}
						onChange={onChange}
						placeholder={placeholder}
						required={required}
						disabled={disabled}
						className={`${baseInputClasses} min-h-[100px]`}
					/>
				);
			case "select":
				return (
					<select
						id={name}
						name={name}
						value={value || ""}
						onChange={onChange}
						required={required}
						disabled={disabled}
						className={baseInputClasses}
					>
						{options?.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				);
			default:
				return (
					<input
						id={name}
						name={name}
						type={type}
						value={value || ""}
						onChange={onChange}
						placeholder={placeholder}
						required={required}
						disabled={disabled}
						className={baseInputClasses}
					/>
				);
		}
	};

	return (
		<div className={`space-y-1 ${className}`}>
			<label
				htmlFor={name}
				className="block text-sm font-medium text-gray-700 dark:text-gray-300"
			>
				{label}
				{required && <span className="ml-1 text-red-500">*</span>}
			</label>
			{renderField()}
			{error && (
				<p className="text-xs text-red-600 dark:text-red-400">{error}</p>
			)}
		</div>
	);
}
