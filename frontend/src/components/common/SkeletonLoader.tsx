interface SkeletonProps {
	className?: string;
	variant?: "text" | "circular" | "rectangular" | "rounded";
	width?: string | number;
	height?: string | number;
	animation?: "pulse" | "wave" | "none";
}

export default function Skeleton({
	className = "",
	variant = "text",
	width,
	height,
	animation = "pulse",
}: SkeletonProps) {
	// Base classes
	const baseClasses = [
		"inline-block",
		"bg-gray-200",
		"dark:bg-gray-700",
		animation === "pulse" ? "animate-pulse" : "",
		animation === "wave" ? "skeleton-wave" : "",
	];

	// Variant specific classes
	const variantClasses = {
		text: "h-4 w-full rounded",
		circular: "rounded-full",
		rectangular: "",
		rounded: "rounded-lg",
	};

	// Generate style object
	const style: React.CSSProperties = {};
	if (width) style.width = typeof width === "number" ? `${width}px` : width;
	if (height)
		style.height = typeof height === "number" ? `${height}px` : height;

	return (
		<span
			className={`${baseClasses.join(" ")} ${
				variantClasses[variant]
			} ${className}`}
			style={style}
		/>
	);
}

// Array helper for creating multiple skeletons
export function SkeletonGroup({
	count,
	component: Component,
	...props
}: {
	count: number;
	component: React.ComponentType<any>;
	[key: string]: any;
}) {
	return (
		<>
			{Array(count)
				.fill(0)
				.map((_, index) => (
					<Component key={index} {...props} />
				))}
		</>
	);
}
