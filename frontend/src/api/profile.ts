// src/api/profile.ts
import axios from "axios";
import { UserInfo, UserProfile, UserSettings } from "../types/user";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Define missing interfaces
export interface UserProfileUpdateRequest {
	first_name?: string;
	last_name?: string;
	email?: string;
	phone?: string;
	date_of_birth?: string;
	gender?: string;
	country?: string;
	bio?: string;
	profile_picture?: string;
}

export interface UserProfileUpdateResponse {
	message: string;
	user: UserInfo & UserProfile & UserSettings;
}

// Retrieve the authenticated user's profile
export const getProfile = async (
	token: string
): Promise<UserInfo & UserProfile & UserSettings> => {
	const response = await axiosInstance.get<
		UserInfo & UserProfile & UserSettings
	>("/user/profile/", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

// Update the user's profile
export const updateProfile = async (
	token: string,
	data: UserProfileUpdateRequest
): Promise<UserProfileUpdateResponse> => {
	const response = await axiosInstance.put<UserProfileUpdateResponse>(
		"/user/profile/",
		data,
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);
	return response.data;
};

export interface PartialUserProfileUpdate
	extends Partial<UserProfileUpdateRequest> {
	settings?: {
		language?: string;
		timezone?: string;
		notification_email?: boolean;
		notification_sms?: boolean;
		notification_push?: boolean;
		marketing_emails?: boolean;
	};
	social_links?: {
		facebook?: string;
		twitter?: string;
		linkedin?: string;
		instagram?: string;
	};
}

// Update partial profile data
export const updatePartialProfile = async (
	token: string,
	data: PartialUserProfileUpdate
): Promise<UserProfileUpdateResponse> => {
	const response = await axiosInstance.put<UserProfileUpdateResponse>(
		"/user/profile/",
		data,
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);
	return response.data;
};
