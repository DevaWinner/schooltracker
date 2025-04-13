import PageMeta from "../../components/common/PageMeta";
import {
	FaChalkboardTeacher,
	FaChartLine,
	FaRegLightbulb,
	FaPiggyBank,
} from "react-icons/fa";

export default function Recommendations() {
	return (
		<>
			<PageMeta
				title="Recommendations | School Tracker"
				description="Recommendations page for School Tracker application"
			/>
			<div className="w-full px-2 sm:px-4 py-4 sm:py-8">
				<div className="text-center space-y-4 sm:space-y-6">
					{/* Decorative background element */}
					<div className="absolute top-20 right-0 -z-10 transform translate-x-1/3 opacity-10 hidden sm:block">
						<svg width="404" height="384" fill="none" viewBox="0 0 404 384">
							<defs>
								<pattern
									id="pattern"
									x="0"
									y="0"
									width="20"
									height="20"
									patternUnits="userSpaceOnUse"
								>
									<rect
										x="0"
										y="0"
										width="4"
										height="4"
										className="text-gray-200 dark:text-gray-700"
										fill="currentColor"
									/>
								</pattern>
							</defs>
							<rect width="404" height="384" fill="url(#pattern)" />
						</svg>
					</div>
					<div className="relative">
						<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
							Smart Recommendations
							<span className="ml-3 inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 animate-pulse">
								Coming Soon
							</span>
						</h2>

						<p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 px-2">
							We're building something special to help you make better decisions
							about your education journey.
						</p>
					</div>

					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mt-8 sm:mt-12 transform hover:scale-[1.02] transition-transform duration-300">
						<h3 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 text-gray-800 dark:text-gray-200">
							What to Expect
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 text-left">
							<div className="space-y-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
								<div className="flex items-center gap-3">
									<div className="flex items-center justify-center w-8 h-8 text-brand-500">
										<FaChalkboardTeacher size={24} />
									</div>
									<h4 className="font-medium text-brand-600 dark:text-brand-400">
										Personalized School Matches
									</h4>
								</div>
								<p className="text-gray-600 dark:text-gray-300 pl-9">
									Get tailored school recommendations based on your academic
									profile, interests, and career goals.
								</p>
							</div>
							<div className="space-y-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
								<div className="flex items-center gap-3">
									<div className="flex items-center justify-center w-8 h-8 text-brand-500">
										<FaRegLightbulb size={24} />
									</div>
									<h4 className="font-medium text-brand-600 dark:text-brand-400">
										Application Strategy
									</h4>
								</div>
								<p className="text-gray-600 dark:text-gray-300 pl-9">
									Receive insights on application timing and school selection
									strategy.
								</p>
							</div>
							<div className="space-y-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
								<div className="flex items-center gap-3">
									<div className="flex items-center justify-center w-8 h-8 text-brand-500">
										<FaChartLine size={24} />
									</div>
									<h4 className="font-medium text-brand-600 dark:text-brand-400">
										Success Probability
									</h4>
								</div>
								<p className="text-gray-600 dark:text-gray-300 pl-9">
									See your estimated chances of acceptance based on historical
									data and your profile.
								</p>
							</div>
							<div className="space-y-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
								<div className="flex items-center gap-3">
									<div className="flex items-center justify-center w-8 h-8 text-brand-500">
										<FaPiggyBank size={24} />
									</div>
									<h4 className="font-medium text-brand-600 dark:text-brand-400">
										Cost Analysis
									</h4>
								</div>
								<p className="text-gray-600 dark:text-gray-300 pl-9">
									Compare program costs and potential return on investment
									across different schools.
								</p>
							</div>
						</div>
					</div>

					<div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 sm:p-6 mt-6 sm:mt-8 border border-gray-200 dark:border-gray-700 mx-2">
						<p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
							<span className="relative flex h-3 w-3">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
								<span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
							</span>
							We're working hard to bring you these features. Stay tuned for
							updates!
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
