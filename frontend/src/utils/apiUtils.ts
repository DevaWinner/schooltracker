import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {
	getAccessToken,
	getRefreshToken,
	updateAccessToken,
	refreshToken,
	updateAuthTokens,
} from "../api/auth";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

// Flag to track if a token refresh is in progress
let isRefreshing = false;
// Store pending requests that are awaiting token refresh
let failedQueue: Array<{
	resolve: (value?: unknown) => void;
	reject: (reason?: unknown) => void;
	config: AxiosRequestConfig;
}> = [];

// Process the queue of pending requests after token refresh
const processQueue = (error: unknown | null, token: string | null = null) => {
	failedQueue.forEach((request) => {
		if (error) {
			request.reject(error);
		} else {
			if (token && request.config.headers) {
				request.config.headers.Authorization = `Bearer ${token}`;
			}
			request.resolve();
		}
	});

	// Reset the queue
	failedQueue = [];
};

// Create a configured axios instance
export const createAuthenticatedApi = (): AxiosInstance => {
	const api = axios.create({
		baseURL: API_BASE_URL,
		headers: {
			"Content-Type": "application/json",
		},
		withCredentials: true,
	});

	// Request interceptor
	api.interceptors.request.use(
		(config) => {
			const token = getAccessToken();
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		},
		(error) => Promise.reject(error)
	);

	// Response interceptor to handle token refresh
	api.interceptors.response.use(
		(response) => response,
		async (error) => {
			const originalRequest = error.config;

			// If the error is not 401 or the request has already been retried, reject
			if (error.response?.status !== 401 || originalRequest._retry) {
				return Promise.reject(error);
			}

			// Mark this request as retried to prevent infinite loops
			originalRequest._retry = true;

			// If we're already refreshing, add this request to the queue
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject, config: originalRequest });
				});
			}

			isRefreshing = true;

			try {
				const refreshTokenStr = getRefreshToken();
				if (!refreshTokenStr) {
					// No refresh token available, reject all pending requests
					processQueue(new Error("No refresh token available"));

					// Dispatch auth error event to notify app that authentication failed
					window.dispatchEvent(
						new CustomEvent("auth_error", {
							detail: {
								type: "auth_error",
								message: "No refresh token available",
							},
						})
					);

					return Promise.reject(error);
				}

				// Attempt to refresh the token
				const { access: newAccessToken, refresh: newRefreshToken } =
					await refreshToken(refreshTokenStr);

				// Update the tokens in storage
				updateAuthTokens(newAccessToken, newRefreshToken);

				// Update the Authorization header
				api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

				// Process all pending requests with the new token
				processQueue(null, newAccessToken);

				// Retry the original request with the new token
				return api(originalRequest);
			} catch (refreshError) {
				// Token refresh failed, reject all pending requests
				processQueue(refreshError);

				// Dispatch auth error event to notify app that authentication failed
				window.dispatchEvent(
					new CustomEvent("auth_error", {
						detail: { type: "auth_error", message: "Failed to refresh token" },
					})
				);

				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}
	);

	return api;
};

// Create and export a default instance
export const authenticatedApi = createAuthenticatedApi();
