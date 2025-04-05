import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	className?: string;
}

const Input: React.FC<InputProps> = ({ className = "", ...props }) => {
	const baseClasses =
		"h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:text-white/90 dark:placeholder:text-gray-500 dark:bg-gray-800 dark:border-gray-700";

	return <input className={`${baseClasses} ${className}`} {...props} />;
};

export default Input;
