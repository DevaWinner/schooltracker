import { format, formatDistance } from "date-fns";

/**
 * Format a date string to a human-readable format
 * @param dateStr Date string to format
 * @param defaultValue Value to return if date is invalid or undefined
 * @returns Formatted date string
 */
export const formatDate = (
	dateStr?: string | null,
	defaultValue = "Not set"
): string => {
	if (!dateStr) return defaultValue;

	try {
		const date = new Date(dateStr);
		if (isNaN(date.getTime())) return defaultValue;

		// Special case for "Recently" - check if date is within last 7 days
		if (defaultValue === "Recently") {
			const now = new Date();
			const diffTime = Math.abs(now.getTime() - date.getTime());
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

			if (diffDays === 0) {
				return "Today";
			} else if (diffDays === 1) {
				return "Yesterday";
			} else if (diffDays <= 7) {
				return `${diffDays} days ago`;
			}
		}

		return date.toLocaleDateString();
	} catch (error) {
		console.error("Error formatting date:", dateStr, error);
		return defaultValue;
	}
};

/**
 * Format a date string for use in an input[type="date"] element
 * Returns empty string for null, undefined or invalid dates
 */
export const formatDateForInput = (dateStr?: string | null): string => {
	// If date is null or undefined, return empty string
	if (dateStr === null || dateStr === undefined || dateStr === "") {
		return "";
	}

	try {
		const date = new Date(dateStr);

		// Check if date is valid
		if (isNaN(date.getTime())) {
			return "";
		}

		// Format as YYYY-MM-DD (expected by input[type="date"])
		return date.toISOString().split("T")[0];
	} catch (error) {
		return "";
	}
};

/**
 * Parse date string from input and return a properly formatted date value or null
 */
export const parseDateInput = (inputValue: string): string | null => {
	if (!inputValue || inputValue.trim() === "") {
		return null;
	}

	try {
		// Validate the date
		const date = new Date(inputValue);
		if (isNaN(date.getTime())) {
			return null;
		}
		return inputValue; // Return the validated input
	} catch (error) {
		return null;
	}
};

/**
 * Returns a more descriptive relative time (e.g., "2 weeks ago", "1 month ago")
 * @param dateStr Date string to format
 * @returns Relative time string
 */
export const getRelativeTimeString = (dateStr?: string | null): string => {
	if (!dateStr) return "Not set";

	try {
		const date = new Date(dateStr);
		if (isNaN(date.getTime())) return "Invalid date";

		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) {
			return "Today";
		} else if (diffDays === 1) {
			return "Yesterday";
		} else if (diffDays < 7) {
			return `${diffDays} days ago`;
		} else if (diffDays < 30) {
			const weeks = Math.floor(diffDays / 7);
			return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
		} else if (diffDays < 365) {
			const months = Math.floor(diffDays / 30);
			return `${months} month${months > 1 ? "s" : ""} ago`;
		} else {
			const years = Math.floor(diffDays / 365);
			return `${years} year${years > 1 ? "s" : ""} ago`;
		}
	} catch (error) {
		console.error("Error calculating relative time:", dateStr, error);
		return "Unknown";
	}
};

/**
 * Formats a date to a human-readable relative format (e.g. "2 days ago")
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export const formatRelativeDate = (dateString: string): string => {
	try {
		const date = new Date(dateString);
		return formatDistance(date, new Date(), { addSuffix: true });
	} catch (error) {
		return "Unknown date";
	}
};

/**
 * Formats a date to a standard format (e.g. "Jan 1, 2023")
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export const formatStandardDate = (dateString: string): string => {
	try {
		const date = new Date(dateString);
		return format(date, "MMM d, yyyy");
	} catch (error) {
		return "Invalid date";
	}
};

/**
 * Returns true if the date is in the future
 * @param dateString ISO date string
 * @returns boolean
 */
export const isUpcoming = (dateString: string): boolean => {
	try {
		const date = new Date(dateString);
		return date > new Date();
	} catch (error) {
		return false;
	}
};

/**
 * Determines if a date is today
 * @param dateString ISO date string
 * @returns boolean
 */
export const isToday = (dateString: string): boolean => {
	try {
		const date = new Date(dateString);
		const today = new Date();

		return (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear()
		);
	} catch (error) {
		return false;
	}
};
