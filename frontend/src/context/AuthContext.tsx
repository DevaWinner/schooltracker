import React, {
	createContext,
	useState,
	useEffect,
	ReactNode,
	useCallback,
} from "react";
import { UserInfo, UserProfile, UserSettings } from "../types/user";
import { getProfile, getUserProfile, getUserSettings } from "../api/profile";
import {
	getAccessToken,
	getRefreshToken,
	clearAuthTokens,
	verifyToken,
	refreshToken,
	updateAuthTokens,
} from "../api/auth";

interface AuthContextProps {
	user: any;
	accessToken: string | null;
	profile: UserInfo | null;
	userProfile: UserProfile | null;
	userSettings: UserSettings | null;
	sessionId: string | null;
	signIn: (
		user: any,
		token: string,
		refreshTokenStr: string,
		rememberMe?: boolean,
		sessionId?: string
	) => void;
	signOut: (notifyComponents?: boolean) => void;
	setProfile: (profile: UserInfo) => void;
	setUserProfile: (profile: UserProfile | null) => void;
	setUserSettings: (settings: UserSettings | null) => void;
	refreshProfileData: () => Promise<void>;
	isFirstLogin: boolean;
	setIsFirstLogin: (value: boolean) => void;
	isLoading: boolean;
	isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
	user: null,
	accessToken: null,
	profile: null,
	userProfile: null,
	userSettings: null,
	sessionId: null,
	signIn: () => {},
	signOut: () => {},
	setProfile: () => {},
	setUserProfile: () => {},
	setUserSettings: () => {},
	refreshProfileData: async () => {},
	isFirstLogin: false,
	setIsFirstLogin: () => {},
	isLoading: true,
	isAuthenticated: false,
});

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<any>(null);
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [profile, setProfile] = useState<UserInfo | null>(null);
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	// Function to fetch all profile data
	const fetchProfileData = async () => {
		try {
			// Fetch profile data in parallel
			const [profileData, profileDetailsData, settingsData] = await Promise.all(
				[
					getProfile(),
					getUserProfile().catch(() => null),
					getUserSettings().catch(() => null),
				]
			);

			// Update states with fetched data
			setProfile(profileData);
			setUserProfile(profileDetailsData);
			setUserSettings(settingsData);

			// Store user data in localStorage for persistence
			localStorage.setItem("userData", JSON.stringify(profileData));

			// Check if it's first login (created_at equals updated_at)
			if (profileData.created_at === profileData.updated_at) {
				setIsFirstLogin(true);
			}

			return { profileData, profileDetailsData, settingsData };
		} catch (error) {
			throw error;
		}
	};

	// Function to refresh profile data (used after profile updates)
	const refreshProfileData = useCallback(async () => {
		try {
			await fetchProfileData();
		} catch (error) {}
	}, []);

	// Function to check if token is valid
	const checkTokenValidity = useCallback(async (token: string) => {
		try {
			const result = await verifyToken(token);
			return result.valid;
		} catch {
			return false;
		}
	}, []);

	// On mount, check if a token exists and load profile data
	useEffect(() => {
		const initAuth = async () => {
			setIsLoading(true);
			const storedToken = getAccessToken();
			const storedRefreshToken = getRefreshToken();
			const userData = localStorage.getItem("userData");

			if (storedToken && storedRefreshToken) {
				try {
					// Try to validate the token
					const isValid = await checkTokenValidity(storedToken);

					if (isValid) {
						// Token is valid, set authenticated state
						setAccessToken(storedToken);
						setIsAuthenticated(true);

						if (userData) {
							try {
								const parsedUserData = JSON.parse(userData);
								setUser(parsedUserData);
								setProfile(parsedUserData);
							} catch (e) {
								console.error("Error parsing stored user data", e);
							}
						}

						// Fetch fresh profile data
						try {
							await fetchProfileData();
						} catch (error) {
							console.error("Failed to fetch profile data", error);
						}
					} else {
						// Token is invalid, try to refresh it
						try {
							const { access: newAccessToken, refresh: newRefreshToken } =
								await refreshToken(storedRefreshToken);

							// Update tokens in storage
							updateAuthTokens(newAccessToken, newRefreshToken);
							setAccessToken(newAccessToken);
							setIsAuthenticated(true);

							// Load user data from storage if available
							if (userData) {
								try {
									const parsedUserData = JSON.parse(userData);
									setUser(parsedUserData);
									setProfile(parsedUserData);
								} catch (e) {}
							}

							// Fetch fresh profile data with new token
							await fetchProfileData();
						} catch (refreshError) {
							// Refresh failed, clear auth state
							console.error("Token refresh failed", refreshError);
							signOutHandler();
						}
					}
				} catch (error) {
					console.error("Error during authentication validation", error);
					signOutHandler();
				}
			} else {
				// No stored tokens found
				signOutHandler();
			}

			setIsLoading(false);
		};

		initAuth();
	}, [checkTokenValidity]);

	useEffect(() => {
		const handleForceDataReset = () => {
			console.log("Force data reset received");
			signOutHandler(true);
		};

		window.addEventListener("force_data_reset", handleForceDataReset);
		return () => {
			window.removeEventListener("force_data_reset", handleForceDataReset);
		};
	}, []);

	const signInHandler = (
		userData: any,
		token: string,
		refreshTokenStr: string,
		rememberMe: boolean = false,
		newSessionId: string = `session_${Date.now()}`
	) => {
		// Clear any existing data first to prevent contamination
		signOutHandler(false);

		// Now set the new auth state
		setUser(userData);
		setAccessToken(token);
		setIsAuthenticated(true);
		setSessionId(newSessionId);

		// Store tokens based on rememberMe preference
		const storage = rememberMe ? localStorage : sessionStorage;

		// Save auth data
		try {
			storage.setItem("access_token", token);
			storage.setItem("refresh_token", refreshTokenStr);
			storage.setItem("session_id", newSessionId);
			localStorage.setItem("current_session_id", newSessionId);
			localStorage.setItem("userData", JSON.stringify(userData));
			localStorage.setItem("rememberMe", String(rememberMe));

			// Fetch profile data immediately after sign in
			fetchProfileData().catch(() => {});
		} catch (e) {}
	};

	const signOutHandler = (notifyComponents: boolean = true) => {
		console.log("Signing out and clearing all state");

		// Clear all auth-related state
		setUser(null);
		setAccessToken(null);
		setProfile(null);
		setUserProfile(null);
		setUserSettings(null);
		setIsFirstLogin(false);
		setIsAuthenticated(false);
		setSessionId(null);

		// Clear all data from storage
		clearAuthTokens();

		// Only notify components if requested (to avoid recursive loops during sign-in)
		if (notifyComponents) {
			// Dispatch an event to notify other contexts that the user has signed out
			window.dispatchEvent(
				new CustomEvent("user_signed_out_event", {
					detail: { timestamp: new Date().getTime(), complete: true },
				})
			);
		}
	};

	// Listen for authentication errors that might happen in API calls
	useEffect(() => {
		const handleAuthError = (event: CustomEvent) => {
			if (event.detail?.type === "auth_error") {
				// If we get an auth error event from our API utilities
				console.log("Auth error detected, signing out");
				signOutHandler();
			}
		};

		window.addEventListener(
			"auth_error" as any,
			handleAuthError as EventListener
		);

		return () => {
			window.removeEventListener(
				"auth_error" as any,
				handleAuthError as EventListener
			);
		};
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				accessToken,
				profile,
				userProfile,
				userSettings,
				sessionId,
				signIn: signInHandler,
				signOut: signOutHandler,
				setProfile,
				setUserProfile,
				setUserSettings,
				refreshProfileData,
				isFirstLogin,
				setIsFirstLogin,
				isLoading,
				isAuthenticated,
			}}
		>
			{!isLoading && children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => React.useContext(AuthContext);
