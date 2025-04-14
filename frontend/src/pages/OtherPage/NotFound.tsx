import { Link } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";

export default function NotFound() {
	return (
		<>
			<PageMeta
				title="Page Not Found | School Tracker"
				description="The page you are looking for could not be found in the School Tracker application"
			/>

			<div className="flex flex-col items-center justify-center min-h-[100vh] p-6 overflow-hidden z-1">
				<div className="mx-auto w-full max-w-[600px] text-center">
					<div className="mx-auto w-32 h-32 flex items-center justify-center rounded-full bg-blue-50 mb-8 dark:bg-blue-900/20">
						<svg
							className="w-16 h-16 text-blue-600 dark:text-blue-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="1.5"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
					</div>

					<h1 className="mb-4 font-bold text-gray-800 text-3xl dark:text-white/90">
						404 - Page Not Found
					</h1>

					<p className="mb-8 text-base text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
						We can't seem to find the page you are looking for. It might have
						been removed, renamed, or did not exist in the first place.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							to="/"
							className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:bg-brand-600 dark:hover:bg-brand-500"
						>
							Back to Home Page
						</Link>

						<button
							onClick={() => window.history.back()}
							className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
						>
							Go Back
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
