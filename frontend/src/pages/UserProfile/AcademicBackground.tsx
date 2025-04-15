import PageMeta from "../../components/common/PageMeta";
import {
  FaGraduationCap,
  FaHistory,
  FaChartBar,
  FaCertificate,
} from "react-icons/fa";

export default function AcademicBackground() {
  return (
    <>
      <PageMeta
        title="Academic Background | School Tracker"
        description="Academic Background page for School Tracker application"
      />
      <div className="w-full">
        <div className="mb-10 flex flex-col justify-center items-center text-center">
          <div className="max-w-3xl">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
              Academic Background
              <span className="ml-3 inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 animate-pulse">
                Coming Soon
              </span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mt-4">
              Soon you'll be able to track and showcase your entire academic journey in one place.
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
                  <FaGraduationCap size={24} />
                </div>
                <h4 className="font-medium text-brand-600 dark:text-brand-400">
                  Education History
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300 pl-9">
                Record all your schools, degrees, majors, and graduation dates in a comprehensive timeline.
              </p>
            </div>
            <div className="space-y-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 text-brand-500">
                  <FaChartBar size={24} />
                </div>
                <h4 className="font-medium text-brand-600 dark:text-brand-400">
                  GPA Tracking
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300 pl-9">
                Store and calculate your GPA by term, cumulative, and major-specific metrics to highlight your academic strengths.
              </p>
            </div>
            <div className="space-y-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 text-brand-500">
                  <FaHistory size={24} />
                </div>
                <h4 className="font-medium text-brand-600 dark:text-brand-400">
                  Course History
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300 pl-9">
                Log completed courses with grades, credits, and term information for a detailed academic record.
              </p>
            </div>
            <div className="space-y-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 text-brand-500">
                  <FaCertificate size={24} />
                </div>
                <h4 className="font-medium text-brand-600 dark:text-brand-400">
                  Test Scores & Certifications
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300 pl-9">
                Add standardized test scores, professional certifications, and other academic achievements.
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
            We're working on making your academic profile comprehensive and beautiful. Stay tuned!
          </p>
        </div>
      </div>
    </>
  );
}
