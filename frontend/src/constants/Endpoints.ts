const BASE_URL = import.meta.env.VITE_BASE_URL;
const AUTH_URL = import.meta.env.VITE_BASE_AUTH_URL;

const endpoints = {
	Auth: {
		getLoginOtp: AUTH_URL + "",
		verifyOtp: AUTH_URL + "",
		getRegisterOtp: AUTH_URL + "",
	},
	SchoolTrackerUser: {
		main: BASE_URL + "/schooltracker/users",
		getApplications: BASE_URL + "/schooltracker/users/applications",
	},
};

export { endpoints, BASE_URL };
