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
	const response = await axiosInstance.put<UserInfo>(
		"/user/info/update/",
		data,
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);
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

// Get user profile (bio, social links) - Improve error handling
export const getUserProfile = async (token: string): Promise<UserProfile> => {
	try {
		const response = await axiosInstance.get<UserProfile>("/user/profile/", {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data;
	} catch (error) {
		throw error;
	}
};

// Update user profile (bio, social links)
export const updateUserProfile = async (
	token: string,
	data: ProfileUpdateRequest
): Promise<UserProfile> => {
	const response = await axiosInstance.put<UserProfile>(
		"/user/profile/update/",
		data,
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);
	return response.data;
};

// Upload profile picture to Supabase Storage
export const uploadProfilePicture = async (
	token: string,
	file: File
): Promise<{ profile_picture: string }> => {
	// Create form data for file upload
	const formData = new FormData();
	formData.append("profile_picture", file);

	try {
		// Special headers for multipart/form-data
		const response = await axiosInstance.post<{ profile_picture: string }>(
			"/user/upload-profile-picture/",
			formData,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data",
				},
			}
		);
		return response.data;
	} catch (error: any) {
		// Extract detailed error message if available
		let errorMessage = "Failed to upload profile picture";

		if (error.response?.data?.error) {
			errorMessage = error.response.data.error;
		} else if (error.message) {
			errorMessage = error.message;
		}

		const enhancedError = new Error(errorMessage);
		throw enhancedError;
	}
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

// Get user settings - Improve error handling
export const getUserSettings = async (token: string): Promise<UserSettings> => {
	try {
		const response = await axiosInstance.get<UserSettings>("/user/settings/", {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data;
	} catch (error) {
		throw error;
	}
};

// Update user settings
export const updateUserSettings = async (
	token: string,
	data: SettingsUpdateRequest
): Promise<UserSettings> => {
	const response = await axiosInstance.put<UserSettings>(
		"/user/settings/update/",
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

// New function to fetch combined profile data for dropdown
export const getProfileForDropdown = async (
	token: string
): Promise<{
	userInfo: UserInfo;
	userProfile: UserProfile | null;
}> => {
	try {
		// Fetch both user info and profile in parallel
		const [userInfoResponse, userProfileResponse] = await Promise.all([
			getProfile(token),
			getUserProfile(token).catch(() => null), // Handle if profile doesn't exist yet
		]);

		return {
			userInfo: userInfoResponse,
			userProfile: userProfileResponse,
		};
	} catch (error) {
		throw error;
	}
};
