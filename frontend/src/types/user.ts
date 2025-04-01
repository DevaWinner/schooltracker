export interface AcademicBackground {
	institution_name: string;
	degree: string;
	field_of_study: string;
	start_date: string;
	end_date: string;
	gpa: string;
	description: string;
}

export interface UserAddress {
	address: string;
	city: string;
	state: string;
	country: string;
	zip: string;
}

export interface UserSettings {
	language: string;
	timezone: string;
	notification_email: boolean;
	notification_sms: boolean;
	notification_push: boolean;
	marketing_emails: boolean;
}

export interface UserMeta {
	first_name: string;
	last_name: string;
	role: string;
	profile_picture: string;
	city: string;
	state: string;
	facebook: string;
	twitter: string;
	linkedin: string;
	instagram: string;
	email: string;
	phone: string;
	date_of_birth: string;
	gender: string;
	bio: string;
	address: string;
	country: string;
	zip: string;
	language: string;
	timezone: string;
	notification_email: boolean;
	notification_sms: boolean;
	notification_push: boolean;
	marketing_emails: boolean;
}

export interface UserInfo extends UserMeta {
	id: number;
	username: string;
	status: string;
	is_active: boolean;
	is_verified: boolean;
	last_login: string;
	created_at: string;
	updated_at: string;
	academic_background: AcademicBackground[];
}

export interface UserAddressModalProps {
	userAddress: UserAddress;
	selectedCountry: string;
	onSave: () => void;
	onClose: () => void;
	onCountryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface UserBackgroundModalProps {
	userInfo: UserInfo;
	onSave: () => void;
	onClose: () => void;
}

export interface UserInfoModalProps {
	userInfo: UserInfo;
	onSave: () => void;
	onClose: () => void;
}

export interface UserMetaModalProps {
	userInfo: UserInfo;
	onSave: () => void;
	onClose: () => void;
}

export interface UserSettingsModalProps {
	settings: UserSettings;
	onSave: () => void;
	onClose: () => void;
}

export interface UserCardProps {
	userInfo: UserInfo | null;
}
