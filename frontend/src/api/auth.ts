import axios from "axios";
import {
	SignUpRequest,
	SignUpResponse,
	SignInRequest,
	SignInResponse,
} from "../interfaces/auth";

// Use the auth-specific URL directly if available
const AUTH_BASE_URL = import.meta.env.VITE_BASE_AUTH_URL;

// Create axios instance with complete URL
const axiosInstance = axios.create({
	baseURL: AUTH_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

// Simple request interceptor without console.log
axiosInstance.interceptors.request.use(
	(config) => {
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Function to register a new user
export const signUp = async (data: SignUpRequest): Promise<SignUpResponse> => {
	try {
		const response = await axiosInstance.post<SignUpResponse>(
			"/auth/register/",
			data
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};

// Function to authenticate a user
export const signIn = async (data: SignInRequest): Promise<SignInResponse> => {
	try {
		const response = await axiosInstance.post<SignInResponse>(
			"/auth/signin/",
			data
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};

// Store auth tokens in local storage
export const storeAuthTokens = (
	accessToken: string,
	refreshToken: string,
	rememberMe: boolean = false
) => {
	const storage = rememberMe ? localStorage : sessionStorage;
	storage.setItem("access_token", accessToken);
	storage.setItem("refresh_token", refreshToken);
};

// Clear auth tokens from storage
export const clearAuthTokens = () => {
	localStorage.removeItem("access_token");
	localStorage.removeItem("refresh_token");
	sessionStorage.removeItem("access_token");
	sessionStorage.removeItem("refresh_token");
};

// Get the stored access token
export const getAccessToken = (): string | null => {
	return (
		localStorage.getItem("access_token") ||
		sessionStorage.getItem("access_token")
	);
};
