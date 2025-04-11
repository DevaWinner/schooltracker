export interface SignUpRequest {
	email: string;
	password: string;
	first_name: string;
	last_name: string;
	phone?: string;
	date_of_birth?: string;
	gender?: "Male" | "Female" | "Other";
	country: string;
}

export interface UserData {
	id: number;
	email: string;
	first_name: string;
	last_name: string;
	phone?: string;
	date_of_birth?: string;
	gender?: "Male" | "Female" | "Other";
	country: string;
	created_at: string;
	updated_at: string;
}

export interface SignUpResponse {
	status: string;
	user: UserData;
	access_token: string;
	refresh_token: string;
}

export interface SignInRequest {
	email: string;
	password: string;
}

export interface SignInResponse {
	status: string;
	user: UserData;
	access_token: string;
	refresh_token: string;
}
