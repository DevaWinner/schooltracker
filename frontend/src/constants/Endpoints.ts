// src/constants/Endpoints.ts

const BASE_URL = import.meta.env.VITE_BASE_URL;

const endpoints = {
	SchoolTrackerUser: {
		main: BASE_URL + "/schooltracker/users",
		getApplications: BASE_URL + "/schooltracker/users/applications",
	},
};

export { endpoints, BASE_URL };
