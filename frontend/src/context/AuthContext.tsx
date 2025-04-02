// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { UserInfo } from "../types/user";

interface AuthContextProps {
	user: any;
	accessToken: string | null;
	profile: UserInfo | null;
	signIn: (user: any, token: string) => void;
	signOut: () => void;
	setProfile: (profile: UserInfo) => void;
}

export const AuthContext = createContext<AuthContextProps>({
	user: null,
	accessToken: null,
	profile: null,
	signIn: () => {},
	signOut: () => {},
	setProfile: () => {},
});

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<any>(null);
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [profile, setProfile] = useState<UserInfo | null>(null);

	// On mount, check if a token exists in localStorage
	useEffect(() => {
		const token = localStorage.getItem("accessToken");
		if (token) {
			setAccessToken(token);
			// Optionally, you could trigger a profile fetch here.
		}
	}, []);

	const signInHandler = (userData: any, token: string) => {
		setUser(userData);
		setAccessToken(token);
		localStorage.setItem("accessToken", token);
	};

	const signOutHandler = () => {
		setUser(null);
		setAccessToken(null);
		setProfile(null);
		localStorage.removeItem("accessToken");
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
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
