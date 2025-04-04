// src/api/profile.ts
import axios from "axios";
import { UserInfo } from "../types/user";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Define interfaces for profile operations
export interface UserProfileUpdateRequest {
	first_name?: string;
	last_name?: string;
	phone?: string;
	date_of_birth?: string;
	gender?: "Male" | "Female" | "Other";
	country?: string;
}

// Retrieve the authenticated user's profile
export const getProfile = async (token: string): Promise<UserInfo> => {
	const response = await axiosInstance.get<UserInfo>("/user/info/", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

// Update the user's basic information
export const updateProfile = async (
	token: string,
	data: UserProfileUpdateRequest
): Promise<UserInfo> => {
	const response = await axiosInstance.put<UserInfo>("/user/info/", data, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

export interface PartialUserProfileUpdate extends UserProfileUpdateRequest {
	settings?: {
		language?: string;
		timezone?: string;
		notification_email?: boolean;
		notification_sms?: boolean;
		notification_push?: boolean;
		marketing_emails?: boolean;
	};
}

// Update partial profile data including settings
export const updatePartialProfile = async (
	token: string,
	data: PartialUserProfileUpdate
): Promise<UserInfo> => {
	const response = await axiosInstance.put<UserInfo>("/user/info/", data, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};
