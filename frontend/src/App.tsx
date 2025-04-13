import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ROUTES } from "./constants/Routes";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import { ApplicationProvider } from "./context/ApplicationContext";
import { DocumentProvider } from "./context/DocumentContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { EventProvider } from "./context/EventContext";

// Import page components
import Home from "./pages/Home/Home";
import Calendar from "./pages/Calendar/Calendar";
import AllEvents from "./pages/Events/AllEvents";
import Recommendations from "./pages/Recommendations";
import ApplicationTracker from "./pages/Applications/Tracker";
import ApplicationDetail from "./pages/Applications/ApplicationDetail";
import ApplicationDocuments from "./pages/Applications/ApplicationDocuments";

// Documents
import DocumentLibrary from "./pages/Documents/Library";
import SchoolSearch from "./pages/Directory/Search";
import InstitutionDetail from "./pages/Directory/InstitutionDetail";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import UserProfiles from "./pages/UserProfile/UserProfileInformation";

// Create a wrapper for ToastContainer to use theme context
const ThemedToast = () => {
	const { theme } = useTheme();
	return (
		<ToastContainer
			position="bottom-right"
			autoClose={5000}
			hideProgressBar={false}
			newestOnTop
			closeOnClick
			rtl={false}
			pauseOnFocusLoss
			draggable
			pauseOnHover
			theme={theme}
			aria-label={undefined}
		/>
	);
};

export default function App() {
	return (
		<>
			<AuthProvider>
				<ThemeProvider>
					<ApplicationProvider>
						<DocumentProvider>
							<EventProvider>
								<Router>
									<ScrollToTop />
									<Routes>
										{/* Protected Routes */}
										<Route
											element={
												<PrivateRoute>
													<AppLayout />
												</PrivateRoute>
											}
										>
											<Route index path={ROUTES.App.main} element={<Home />} />
											<Route
												path={ROUTES.Applications.tracker}
												element={<ApplicationTracker />}
											/>
											<Route
												path={ROUTES.Applications.detail}
												element={<ApplicationDetail />}
											/>
											<Route
												path={ROUTES.Applications.documents}
												element={<ApplicationDocuments />}
											/>
											<Route
												path={ROUTES.Documents.library}
												element={<DocumentLibrary />}
											/>
											<Route
												path={ROUTES.Directory.search}
												element={<SchoolSearch />}
											/>
											{/* Add route for institution detail */}
											<Route
												path={ROUTES.Directory.institution}
												element={<InstitutionDetail />}
											/>
											<Route
												path={ROUTES.Other.calendar}
												element={<Calendar />}
											/>
											<Route
												path={ROUTES.Other.events}
												element={<AllEvents />}
											/>
											<Route
												path={ROUTES.Other.recommendations}
												element={<Recommendations />}
											/>
											<Route
												path={ROUTES.Profile.information}
												element={<UserProfiles />}
											/>
										</Route>

										{/* Public Routes */}
										<Route path={ROUTES.Auth.signin} element={<SignIn />} />
										<Route path={ROUTES.Auth.signup} element={<SignUp />} />

										{/* Fallback Route */}
										<Route path="*" element={<NotFound />} />
									</Routes>
								</Router>
								<ThemedToast />
							</EventProvider>
						</DocumentProvider>
					</ApplicationProvider>
				</ThemeProvider>
			</AuthProvider>
		</>
	);
}
