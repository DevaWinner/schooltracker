export interface UserInfo {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	phone?: string;
	date_of_birth?: string; // ISO date string (YYYY-MM-DD)
	gender?: "Male" | "Female" | "Other";
	country: string;
	// Include profile and settings fields as they're returned together from API
	bio?: string;
	profile_picture?: string;
	facebook?: string;
	twitter?: string;
	linkedin?: string;
	instagram?: string;
	language?: string;
	timezone?: string;
	notification_email?: boolean;
	notification_sms?: boolean;
	notification_push?: boolean;
	marketing_emails?: boolean;
}

export interface UserProfile {
	id: number;
	user_id: number;
	bio?: string;
	profile_picture?: string;
	facebook?: string;
	twitter?: string;
	linkedin?: string;
	instagram?: string;
}

export interface UserSettings {
	id: number;
	user_id: number;
	language: string; // e.g., "en"
	timezone: string; // e.g., "UTC"
	notification_email: boolean;
	notification_sms?: boolean;
	notification_push?: boolean;
	marketing_emails?: boolean;
}

// Component Props Interfaces
export interface ComponentCardProps {
	userInfo?: UserInfo | null;
	userProfile?: UserProfile | null;
	userSettings?: UserSettings | null;
	onSave?: () => void;
	onClose?: () => void;
}
