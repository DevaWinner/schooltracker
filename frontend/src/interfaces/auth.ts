export interface SignUpRequest {
	email: string;
	password: string;
	first_name: string;
	last_name: string;
	phone?: string;
	date_of_birth?: string; // ISO date string (YYYY-MM-DD)
	gender?: "Male" | "Female" | "Other";
	country: string;
}

export interface SignUpResponse {
	status: string;
	user: {
		id: string;
		email: string;
		created_at: string;
		updated_at: string;
	};
}

export interface SignInRequest {
	email: string;
	password: string;
}

export interface SignInResponse {
	status: string;
	user: {
		id: string;
		email: string;
	};
	access_token: string;
	refresh_token: string;
}
