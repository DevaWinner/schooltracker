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
 * Format a date for input fields (YYYY-MM-DD)
 * @param dateStr Date string to format
 * @returns Formatted date string for input fields
 */
export const formatDateForInput = (dateStr?: string | null): string => {
	if (!dateStr) return "";

	try {
		const date = new Date(dateStr);
		if (isNaN(date.getTime())) return "";

		// Format as YYYY-MM-DD for input type="date"
		return date.toISOString().split("T")[0];
	} catch (error) {
		console.error("Error formatting date for input:", dateStr, error);
		return "";
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
