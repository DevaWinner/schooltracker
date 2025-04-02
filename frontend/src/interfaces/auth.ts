export interface SignUpRequest {
	email: string;
	password: string;
	first_name: string;
	last_name: string;
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
