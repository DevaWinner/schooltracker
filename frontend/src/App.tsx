import { BrowserRouter as Router, Routes, Route } from "react-router";
import { ROUTES } from "./constants/Routes";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

// Import all page components
import Home from "./pages/Dashboard/Home";
import Calendar from "./pages/Calendar";
import Recommendations from "./pages/Recommendations";

// Applications
import ApplicationTracker from "./pages/Applications/Tracker";
import ApplicationStatus from "./pages/Applications/Status";

// Documents
import DocumentUpload from "./pages/Documents/Upload";
import DocumentLibrary from "./pages/Documents/Library";

// Directory
import SchoolSearch from "./pages/Directory/Search";

// Authentication
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";

// User Profile
import UserProfiles from "./pages/UserProfile/UserProfileInformation";
import UserBackground from "./pages/UserProfile/UserBackground";

export default function App() {
	return (
		<>
			<Router>
				<ScrollToTop />
				<Routes>
					{/* Dashboard Layout */}
					<Route element={<AppLayout />}>
						<Route index path={ROUTES.App.main} element={<Home />} />

						{/* Applications Routes */}
						<Route
							path={ROUTES.Applications.tracker}
							element={<ApplicationTracker />}
						/>
						<Route
							path={ROUTES.Applications.status}
							element={<ApplicationStatus />}
						/>

						{/* Documents Routes */}
						<Route
							path={ROUTES.Documents.upload}
							element={<DocumentUpload />}
						/>
						<Route
							path={ROUTES.Documents.library}
							element={<DocumentLibrary />}
						/>

						{/* Directory Routes */}
						<Route path={ROUTES.Directory.search} element={<SchoolSearch />} />

						{/* Other Main Routes */}
						<Route path={ROUTES.Other.calendar} element={<Calendar />} />
						<Route
							path={ROUTES.Other.recommendations}
							element={<Recommendations />}
						/>

						{/* Account Routes */}
						<Route
							path={ROUTES.Profile.information}
							element={<UserProfiles />}
						/>
						<Route
							path={ROUTES.Profile.background}
							element={<UserBackground />}
						/>
					</Route>

					{/* Authentication Routes */}
					<Route path={ROUTES.Auth.signin} element={<SignIn />} />
					<Route path={ROUTES.Auth.signup} element={<SignUp />} />

					{/* Fallback Route */}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Router>
		</>
	);
}
