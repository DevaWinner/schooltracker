import { useContext, useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { JSX } from "react/jsx-runtime";

interface PrivateRouteProps {
	children?: JSX.Element;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
	const { accessToken, isFirstLogin, isLoading } = useContext(AuthContext);
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		// If user is authenticated and it's their first login, and they're not already on the profile page
		if (
			accessToken &&
			isFirstLogin &&
			!location.pathname.includes("/profile/information") &&
			!isLoading
		) {
			navigate("/profile/information", { replace: true });
		}
	}, [accessToken, isFirstLogin, location, navigate, isLoading]);

	// Show loading indicator while checking authentication
	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="w-10 h-10 border-4 border-gray-200 rounded-full border-t-blue-600 animate-spin"></div>
			</div>
		);
	}

	// Check if the user is authenticated
	if (!accessToken) {
		// Redirect to the login page if not authenticated
		return <Navigate to="/signin" state={{ from: location }} replace />;
	}

	// If there are children, render them, otherwise render the outlet
	return children ? children : <Outlet />;
}
