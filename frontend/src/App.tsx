import { BrowserRouter as Router, Routes, Route } from "react-router";
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

export default function App() {
	return (
		<>
			<Router>
				<ScrollToTop />
				<Routes>
					{/* Dashboard Layout */}
					<Route element={<AppLayout />}>
						<Route index path="/" element={<Home />} />

						{/* Applications Routes */}
						<Route
							path="/applications/tracker"
							element={<ApplicationTracker />}
						/>
						<Route
							path="/applications/status"
							element={<ApplicationStatus />}
						/>

						{/* Documents Routes */}
						<Route path="/documents/upload" element={<DocumentUpload />} />
						<Route path="/documents/library" element={<DocumentLibrary />} />

						{/* Directory Routes */}
						<Route path="/directory/search" element={<SchoolSearch />} />

						{/* Other Main Routes */}
						<Route path="/calendar" element={<Calendar />} />
						<Route path="/recommendations" element={<Recommendations />} />
					</Route>

					{/* Fallback Route */}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Router>
		</>
	);
}
