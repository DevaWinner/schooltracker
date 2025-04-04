import axios from "axios";
import { UserInfo, UserProfile, UserSettings } from "../types/user";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Basic user info interfaces and functions
export interface UserInfoUpdateRequest {
	first_name?: string;
	last_name?: string;
	phone?: string;
	date_of_birth?: string;
	gender?: "Male" | "Female" | "Other";
	country?: string;
}

// Retrieve the authenticated user's basic info
export const getProfile = async (token: string): Promise<UserInfo> => {
	const response = await axiosInstance.get<UserInfo>("/user/info/", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

// Update the user's basic information
export const updateBasicInfo = async (
	token: string,
	data: UserInfoUpdateRequest
): Promise<UserInfo> => {
	console.log("Updating basic info with:", data);
	const response = await axiosInstance.put<UserInfo>("/user/info/", data, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

// Profile-specific interfaces and functions
export interface ProfileUpdateRequest {
	bio?: string;
	profile_picture?: string;
	facebook?: string;
	twitter?: string;
	linkedin?: string;
	instagram?: string;
}

// Get user profile (bio, social links)
export const getUserProfile = async (token: string): Promise<UserProfile> => {
	const response = await axiosInstance.get<UserProfile>("/user/profile/", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

// Update user profile (bio, social links)
export const updateUserProfile = async (
	token: string,
	data: ProfileUpdateRequest
): Promise<UserProfile> => {
	console.log("Updating profile with:", data);
	const response = await axiosInstance.put<UserProfile>(
		"/user/profile/",
		data,
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);
	return response.data;
};

// Settings-specific interfaces and functions
export interface SettingsUpdateRequest {
	language?: string;
	timezone?: string;
	notification_email?: boolean;
	notification_sms?: boolean;
	notification_push?: boolean;
	marketing_emails?: boolean;
}

// Get user settings
export const getUserSettings = async (token: string): Promise<UserSettings> => {
	const response = await axiosInstance.get<UserSettings>("/user/settings/", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

// Update user settings
export const updateUserSettings = async (
	token: string,
	data: SettingsUpdateRequest
): Promise<UserSettings> => {
	console.log("Updating settings with:", data);
	const response = await axiosInstance.put<UserSettings>(
		"/user/settings/",
		data,
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);
	return response.data;
};

// For backward compatibility
export interface PartialUserProfileUpdate extends UserInfoUpdateRequest {
	bio?: string;
	profile_picture?: string;
	facebook?: string;
	twitter?: string;
	linkedin?: string;
	instagram?: string;
	settings?: SettingsUpdateRequest;
}

// Update all user data at once (for compatibility with existing code)
export const updatePartialProfile = async (
	token: string,
	data: PartialUserProfileUpdate
): Promise<any> => {
	const promises = [];

	// Extract and update each part separately
	const {
		settings,
		bio,
		profile_picture,
		facebook,
		twitter,
		linkedin,
		instagram,
		...basicInfo
	} = data;

	// Update basic info if provided
	if (Object.keys(basicInfo).length > 0) {
		promises.push(updateBasicInfo(token, basicInfo));
	}

	// Update profile if provided
	const profileData: ProfileUpdateRequest = {
		bio,
		profile_picture,
		facebook,
		twitter,
		linkedin,
		instagram,
	};
	if (Object.values(profileData).some((val) => val !== undefined)) {
		promises.push(updateUserProfile(token, profileData));
	}

	// Update settings if provided
	if (settings && Object.keys(settings).length > 0) {
		promises.push(updateUserSettings(token, settings));
	}

	// Wait for all updates to complete
	const results = await Promise.all(promises);

	// Return a merged result
	return results.reduce((acc, result) => ({ ...acc, ...result }), {});
};
