import { UserInfo, UserProfile, UserSettings } from "../types/user";
import { authenticatedApi } from "../utils/apiUtils";
import axios from "axios";

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
export const getProfile = async (): Promise<UserInfo> => {
	const response = await authenticatedApi.get<UserInfo>("/user/info/");
	return response.data;
};

// Update the user's basic information
export const updateBasicInfo = async (
	data: UserInfoUpdateRequest
): Promise<UserInfo> => {
	const response = await authenticatedApi.put<UserInfo>(
		"/user/info/update/",
		data
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
export const getUserProfile = async (): Promise<UserProfile> => {
	try {
		const response = await authenticatedApi.get<UserProfile>("/user/profile/");
		return response.data;
	} catch (error) {
		// If unauthorized, dispatch auth error event
		if (axios.isAxiosError(error) && error.response?.status === 401) {
			window.dispatchEvent(
				new CustomEvent("auth_error", {
					detail: { type: "auth_error", message: "Unauthorized access" },
				})
			);
		}
		throw error;
	}
};

// Update user profile (bio, social links)
export const updateUserProfile = async (
	data: ProfileUpdateRequest
): Promise<UserProfile> => {
	const response = await authenticatedApi.put<UserProfile>(
		"/user/profile/update/",
		data
	);
	return response.data;
};

// Upload profile picture to Supabase Storage
export const uploadProfilePicture = async (
	file: File
): Promise<{ profile_picture: string }> => {
	// Create form data for file upload
	const formData = new FormData();
	formData.append("profile_picture", file);

	try {
		// Special headers for multipart/form-data
		const response = await authenticatedApi.post<{ profile_picture: string }>(
			"/user/upload-profile-picture/",
			formData,
			{
				headers: {
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
export const getUserSettings = async (): Promise<UserSettings> => {
	try {
		const response = await authenticatedApi.get<UserSettings>(
			"/user/settings/"
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};

// Update user settings
export const updateUserSettings = async (
	data: SettingsUpdateRequest
): Promise<UserSettings> => {
	const response = await authenticatedApi.put<UserSettings>(
		"/user/settings/update/",
		data
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
		promises.push(updateBasicInfo(basicInfo));
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
		promises.push(updateUserProfile(profileData));
	}

	// Update settings if provided
	if (settings && Object.keys(settings).length > 0) {
		promises.push(updateUserSettings(settings));
	}

	try {
		// Wait for all updates to complete
		const results = await Promise.all(promises);

		// Return a merged result
		return results.reduce((acc, result) => ({ ...acc, ...result }), {});
	} catch (error) {
		// Check for authentication error
		if (axios.isAxiosError(error) && error.response?.status === 401) {
			window.dispatchEvent(
				new CustomEvent("auth_error", {
					detail: { type: "auth_error", message: "Unauthorized access" },
				})
			);
		}
		throw error;
	}
};

// New function to fetch combined profile data for dropdown
export const getProfileForDropdown = async (): Promise<{
	userInfo: UserInfo;
	userProfile: UserProfile | null;
}> => {
	try {
		// Fetch both user info and profile in parallel
		const [userInfoResponse, userProfileResponse] = await Promise.all([
			getProfile(),
			getUserProfile().catch(() => null), // Handle if profile doesn't exist yet
		]);

		return {
			userInfo: userInfoResponse,
			userProfile: userProfileResponse,
		};
	} catch (error) {
		throw error;
	}
};
