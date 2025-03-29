export interface AcademicBackground {
	institution_name: string;
	degree: string;
	field_of_study: string;
	start_date: string;
	end_date: string;
	gpa: string;
	description: string;
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
