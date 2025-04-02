import React, { createContext, useState, ReactNode } from "react";

interface AuthContextProps {
	user: any;
	accessToken: string | null;
	signIn: (user: any, token: string) => void;
	signOut: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
	user: null,
	accessToken: null,
	signIn: () => {},
	signOut: () => {},
});

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<any>(null);
	const [accessToken, setAccessToken] = useState<string | null>(null);

	const signInHandler = (userData: any, token: string) => {
		setUser(userData);
		setAccessToken(token);
		// Consider storing token in a secure storage or cookie.
	};

	const signOutHandler = () => {
		setUser(null);
		setAccessToken(null);
		// Remove token from secure storage as needed.
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				accessToken,
				signIn: signInHandler,
				signOut: signOutHandler,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
