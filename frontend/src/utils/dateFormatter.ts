/**
 * Provides proper formatting for dates
 */
export function formatDate(dateString?: string): string {
	if (!dateString) return "Not set";

	try {
		const date = new Date(dateString);
		return date.toLocaleDateString(undefined, {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	} catch {
		return "Invalid date";
	}
}
