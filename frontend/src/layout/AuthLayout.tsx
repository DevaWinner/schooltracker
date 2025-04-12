import React from "react";

interface AuthLayoutProps {
	children: React.ReactNode;
	className?: string;
	size?: "small" | "medium" | "large";
}

export default function AuthLayout({
	children,
	className = "",
	size = "medium",
}: AuthLayoutProps) {
	// Set width classes based on size prop
	const sizeClasses = {
		small: "md:max-w-md lg:max-w-md",
		medium: "md:max-w-xl lg:max-w-xl",
		large: "md:max-w-2xl lg:max-w-3xl",
	};

	return (
		<div
			className={`flex min-h-screen h-auto flex-col md:h-screen ${className} bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}
		>
			<div className="flex flex-1 items-center justify-center py-8">
				<div className={`w-full ${sizeClasses[size]} px-4 animate-fadeIn`}>
					<div className="relative backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
						{/* Decorative elements */}
						<div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-brand-500 opacity-70 blur-lg"></div>
						<div className="absolute -bottom-3 -right-3 h-10 w-10 rounded-full bg-indigo-500 opacity-70 blur-lg"></div>
						<div className="relative z-10">{children}</div>
					</div>

					{/* Brand logo or app name could go at the bottom */}
					<div className="mt-6 text-center">
						<p className="text-xs text-gray-500 dark:text-gray-400">
							© {new Date().getFullYear()} School Tracker • All Rights Reserved
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
