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

// Simple request interceptor
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

// Function to refresh token using new endpoint
export const refreshToken = async (
	refreshTokenStr: string
): Promise<{ access: string; refresh: string }> => {
	try {
		const response = await axiosInstance.post<{
			access: string;
			refresh: string;
		}>("/auth/token/refresh/", { refresh: refreshTokenStr });
		return response.data;
	} catch (error) {
		throw error;
	}
};

// Function to verify a token is valid
export const verifyToken = async (
	token: string
): Promise<{ valid: boolean }> => {
	try {
		const response = await axiosInstance.post<{ valid: boolean }>(
			"/auth/token/verify/",
			{ token }
		);
		return response.data;
	} catch (error) {
		return { valid: false };
	}
};

// Store auth tokens in local storage with session ID
export const storeAuthTokens = (
	accessToken: string,
	refreshToken: string,
	rememberMe: boolean = false,
	sessionId: string = `session_${Date.now()}`
) => {
	const storage = rememberMe ? localStorage : sessionStorage;
	storage.setItem("access_token", accessToken);
	storage.setItem("refresh_token", refreshToken);
	storage.setItem("session_id", sessionId);

	// Store the preference
	localStorage.setItem("rememberMe", String(rememberMe));
	localStorage.setItem("current_session_id", sessionId);
};

// Clear auth tokens from storage - more aggressive approach
export const clearAuthTokens = () => {
	// Instead of individually removing items, clear everything
	// This is more reliable when dealing with unknown cached items
	localStorage.clear();
	sessionStorage.clear();

	// Optionally, if you need to keep some system settings like theme preference,
	// you can restore them after clearing
	const savedTheme = document.documentElement.dataset.theme || "light";
	localStorage.setItem("theme", savedTheme);
};

// Get the current session ID
export const getCurrentSessionId = (): string => {
	return (
		localStorage.getItem("current_session_id") ||
		sessionStorage.getItem("session_id") ||
		`session_${Date.now()}`
	);
};

// Get the stored access token
export const getAccessToken = (): string | null => {
	return (
		localStorage.getItem("access_token") ||
		sessionStorage.getItem("access_token")
	);
};

// Get the stored refresh token
export const getRefreshToken = (): string | null => {
	return (
		localStorage.getItem("refresh_token") ||
		sessionStorage.getItem("refresh_token")
	);
};

// Update the stored access token
export const updateAccessToken = (newToken: string): void => {
	if (localStorage.getItem("access_token")) {
		localStorage.setItem("access_token", newToken);
	}
	if (sessionStorage.getItem("access_token")) {
		sessionStorage.setItem("access_token", newToken);
	}
};

// Update both access and refresh tokens
export const updateAuthTokens = (
	accessToken: string,
	refreshToken: string
): void => {
	// Check where tokens are stored (localStorage or sessionStorage)
	const rememberMe = localStorage.getItem("rememberMe") === "true";

	// Update tokens in the appropriate storage
	if (localStorage.getItem("access_token") || rememberMe) {
		localStorage.setItem("access_token", accessToken);
		localStorage.setItem("refresh_token", refreshToken);
	}
	if (sessionStorage.getItem("access_token") || !rememberMe) {
		sessionStorage.setItem("access_token", accessToken);
		sessionStorage.setItem("refresh_token", refreshToken);
	}
};
