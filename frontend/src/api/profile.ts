// src/api/profile.ts
import axios from "axios";
import {
	UserInfo,
	UserProfileUpdateRequest,
	UserProfileUpdateResponse,
} from "../types/user";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Retrieve the authenticated user’s profile
export const getProfile = async (token: string): Promise<UserInfo> => {
	const response = await axiosInstance.get<UserInfo>("/user/profile/", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

// Update the user’s profile
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
