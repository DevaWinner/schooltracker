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
			<div className="w-full">
				<div className="mb-10 flex flex-col justify-center items-center text-center">
					<div className="max-w-3xl">
						<h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
							Smart Recommendations
							<span className="ml-3 inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 animate-pulse">
								Coming Soon
							</span>
						</h2>
						<p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mt-4">
							We're building something special to help you make better decisions
							about your education journey.
						</p>
					</div>
				</div>

				<div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 shadow-sm">
					<h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
						Features to Expect
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
								Compare program costs and potential return on investment across
								different schools.
							</p>
						</div>
					</div>
				</div>

				<div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 shadow-sm">
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
		</>
	);
}
