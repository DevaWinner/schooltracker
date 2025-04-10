import React, { createContext, useState, useEffect, ReactNode } from "react";
import { UserInfo, UserProfile, UserSettings } from "../types/user";
import { getProfile, getUserProfile, getUserSettings } from "../api/profile";
import { getAccessToken } from "../api/auth";

interface AuthContextProps {
	user: any;
	accessToken: string | null;
	profile: UserInfo | null;
	userProfile: UserProfile | null;
	userSettings: UserSettings | null;
	signIn: (user: any, token: string) => void;
	signOut: () => void;
	setProfile: (profile: UserInfo) => void;
	setUserProfile: (profile: UserProfile | null) => void;
	setUserSettings: (settings: UserSettings | null) => void;
	refreshProfileData: () => Promise<void>;
	isFirstLogin: boolean;
	setIsFirstLogin: (value: boolean) => void;
	isLoading: boolean;
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

	// Function to fetch all profile data
	const fetchProfileData = async (token: string) => {
		try {
			// Fetch profile data in parallel
			const [profileData, profileDetailsData, settingsData] = await Promise.all(
				[
					getProfile(token),
					getUserProfile(token).catch(() => null),
					getUserSettings(token).catch(() => null),
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
			console.error("Error fetching profile data:", error);
			throw error;
		}
	};

	// Function to refresh profile data (used after profile updates)
	const refreshProfileData = async () => {
		if (!accessToken) return;

		try {
			await fetchProfileData(accessToken);
		} catch (error) {
			console.error("Error refreshing profile data:", error);
		}
	};

	// On mount, check if a token exists and load profile data
	useEffect(() => {
		const initAuth = async () => {
			const token = getAccessToken();
			const userData = localStorage.getItem("userData");
			const rememberMe = localStorage.getItem("rememberMe");

			// Only restore session if token exists and either rememberMe is true or we're not checking
			if (token && (rememberMe === "true" || rememberMe === null)) {
				setAccessToken(token);

				if (userData) {
					try {
						setUser(JSON.parse(userData));
					} catch (e) {
						console.error("Failed to parse user data from localStorage");
					}
				}

				// Fetch all profile data
				try {
					await fetchProfileData(token);
				} catch (error) {
					console.error("Error fetching profile:", error);
					// If we can't fetch the profile with the token, it might be invalid
					signOutHandler();
				}
			}

			setIsLoading(false);
		};

		initAuth();
	}, []);

	const signInHandler = (userData: any, token: string) => {
		setUser(userData);
		setAccessToken(token);

		// Always save token and user data
		try {
			localStorage.setItem("accessToken", token);
			localStorage.setItem("userData", JSON.stringify(userData));

			// Fetch profile data immediately after sign in
			fetchProfileData(token).catch(console.error);
		} catch (e) {
			console.error("Failed to save auth data to localStorage:", e);
		}
	};

	const signOutHandler = () => {
		setUser(null);
		setAccessToken(null);
		setProfile(null);
		setUserProfile(null);
		setUserSettings(null);
		setIsFirstLogin(false);

		// Clear all auth-related data from localStorage
		localStorage.removeItem("accessToken");
		localStorage.removeItem("userData");
		localStorage.removeItem("rememberMe");
	};

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
			}}
		>
			{!isLoading && children}
		</AuthContext.Provider>
	);
};
