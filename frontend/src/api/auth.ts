import axios from "axios";
import {
	SignUpRequest,
	SignUpResponse,
	SignInRequest,
	SignInResponse,
} from "../interfaces/auth";

// Use the auth-specific URL directly if available
const AUTH_BASE_URL =
	import.meta.env.VITE_BASE_AUTH_URL || `${import.meta.env.VITE_BASE_URL}/auth`;

const axiosInstance = axios.create({
	baseURL: AUTH_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Add request interceptor for debugging
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
			"/register", // changed: added leading slash
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
			"/signin", // changed: added leading slash
			data
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};
