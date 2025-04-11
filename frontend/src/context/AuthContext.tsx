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
} from "../api/auth";

interface AuthContextProps {
	user: any;
	accessToken: string | null;
	profile: UserInfo | null;
	userProfile: UserProfile | null;
	userSettings: UserSettings | null;
	signIn: (
		user: any,
		token: string,
		refreshTokenStr: string,
		rememberMe?: boolean
	) => void;
	signOut: () => void;
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
			const token = getAccessToken();
			const refreshTokenStr = getRefreshToken();
			const userData = localStorage.getItem("userData");
			const rememberMe = localStorage.getItem("rememberMe");

			// Only restore session if tokens exist and either rememberMe is true or we're not checking
			if (
				token &&
				refreshTokenStr &&
				(rememberMe === "true" || rememberMe === null)
			) {
				// Verify token validity
				const isValid = await checkTokenValidity(token);

				if (isValid) {
					setAccessToken(token);
					setIsAuthenticated(true);

					if (userData) {
						try {
							setUser(JSON.parse(userData));
						} catch (e) {}
					}

					// Fetch all profile data
					try {
						await fetchProfileData();
					} catch (error) {
						// If we can't fetch the profile with the token, it might be invalid
						signOutHandler();
					}
				} else {
					// Token is invalid, sign out
					signOutHandler();
				}
			} else {
				// No valid authentication, ensure we're signed out
				signOutHandler();
			}

			setIsLoading(false);
		};

		initAuth();
	}, [checkTokenValidity]);

	const signInHandler = (
		userData: any,
		token: string,
		refreshTokenStr: string,
		rememberMe: boolean = false
	) => {
		setUser(userData);
		setAccessToken(token);
		setIsAuthenticated(true);

		// Store tokens based on rememberMe preference
		const storage = rememberMe ? localStorage : sessionStorage;

		// Save auth data
		try {
			storage.setItem("access_token", token);
			storage.setItem("refresh_token", refreshTokenStr);
			storage.setItem("userData", JSON.stringify(userData));
			storage.setItem("rememberMe", String(rememberMe));

			// Fetch profile data immediately after sign in
			fetchProfileData().catch(() => {});
		} catch (e) {}
	};

	const signOutHandler = () => {
		setUser(null);
		setAccessToken(null);
		setProfile(null);
		setUserProfile(null);
		setUserSettings(null);
		setIsFirstLogin(false);
		setIsAuthenticated(false);

		// Clear all auth-related data from storage
		clearAuthTokens();
		localStorage.removeItem("userData");
		localStorage.removeItem("rememberMe");
	};

	// Listen for authentication errors that might happen in API calls
	useEffect(() => {
		const handleAuthError = (event: CustomEvent) => {
			if (event.detail?.type === "auth_error") {
				// If we get an auth error event from our API utilities
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
