// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { UserInfo } from "../types/user";
import { getProfile } from "../api/profile";

interface AuthContextProps {
	user: any;
	accessToken: string | null;
	profile: UserInfo | null;
	signIn: (user: any, token: string) => void;
	signOut: () => void;
	setProfile: (profile: UserInfo) => void;
	isFirstLogin: boolean;
	setIsFirstLogin: (value: boolean) => void;
	isLoading: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
	user: null,
	accessToken: null,
	profile: null,
	signIn: () => {},
	signOut: () => {},
	setProfile: () => {},
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
	const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	// On mount, check if a token exists in localStorage
	useEffect(() => {
		const initAuth = async () => {
			const token = localStorage.getItem("accessToken");
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

				// Fetch profile data
				try {
					const profileData = await getProfile(token);
					setProfile(profileData);

					// Check if it's first login (created_at equals updated_at)
					if (profileData.created_at === profileData.updated_at) {
						setIsFirstLogin(true);
					}
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
		} catch (e) {
			console.error("Failed to save auth data to localStorage:", e);
		}
	};

	const signOutHandler = () => {
		setUser(null);
		setAccessToken(null);
		setProfile(null);
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
				signIn: signInHandler,
				signOut: signOutHandler,
				setProfile,
				isFirstLogin,
				setIsFirstLogin,
				isLoading,
			}}
		>
			{!isLoading && children}
		</AuthContext.Provider>
	);
};
