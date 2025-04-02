import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { JSX } from "react/jsx-runtime";

interface PrivateRouteProps {
	children: JSX.Element;
}

export default function PrivateRoute({
	children,
}: PrivateRouteProps): JSX.Element {
	const { user } = useContext(AuthContext);
	if (!user) {
		return <Navigate to="/signin" />;
	}
	return children;
}
