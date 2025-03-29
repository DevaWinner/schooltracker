interface AcademicBackground {
	institution_name: string;
	degree: string;
	field_of_study: string;
	start_date: string;
	end_date: string;
	gpa: string;
	description: string;
}

interface UserInfo {
	id: number;
	username: string;
	email: string;
	password?: string; // Not typically returned to frontend for security
	first_name: string;
	last_name: string;
	date_of_birth: string;
	gender: string;
	phone: string;
	address: string;
	city: string;
	state: string;
	zip: string; // postal code
	country: string;
	profile_picture: string; // URL
	role: string; // or user_type
	status: string;
	is_active: boolean;
	is_verified: boolean;
	last_login: string;
	created_at: string;
	updated_at: string;
	bio?: string;
	facebook?: string;
	twitter?: string;
	linkedin?: string;
	instagram?: string;
	language: string;
	timezone: string;
	notification_email: boolean;
	notification_sms: boolean;
	notification_push: boolean;
	marketing_emails: boolean;
	academic_background: AcademicBackground[];
}

export const mockFetchUserInfo = (): Promise<UserInfo> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				id: 1,
				username: "testuser",
				email: "testuser@example.com",
				first_name: "Test",
				last_name: "User",
				date_of_birth: "1990-05-15",
				gender: "Male",
				phone: "+09 363 398 46",
				address: "123 Main St",
				city: "Main City",
				state: "Test State",
				zip: "85001",
				country: "Afghanistan",
				profile_picture:
					"https://ui-avatars.com/api/?name=Test+User&background=random",
				role: "Student",
				status: "active",
				is_active: true,
				is_verified: true,
				last_login: "2023-11-28T10:30:00Z",
				created_at: "2023-01-15T08:00:00Z",
				updated_at: "2023-11-28T10:30:00Z",
				bio: "College Student",
				facebook: "https://www.facebook.com/testuser",
				twitter: "https://x.com/testuser",
				linkedin: "https://www.linkedin.com/in/testuser",
				instagram: "https://instagram.com/testuser",
				language: "en",
				timezone: "America/New_York",
				notification_email: true,
				notification_sms: false,
				notification_push: true,
				marketing_emails: false,
				academic_background: [
					{
						institution_name: "Brigham Young University Idaho",
						degree: "Bachelor's",
						field_of_study: "Computer Science",
						start_date: "2021-09-01",
						end_date: "2024-04-30",
						gpa: "3.8",
						description: "Dean's List, Computer Science Club President",
					},
					{
						institution_name: "Community College",
						degree: "Associate",
						field_of_study: "General Studies",
						start_date: "2019-09-01",
						end_date: "2021-05-30",
						gpa: "3.9",
						description: "Honor Roll Student",
					},
				],
			});
		}, 500);
	});
};
