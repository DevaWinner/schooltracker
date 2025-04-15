import PageMeta from "../../components/common/PageMeta";
import {
  FaHeadset,
  FaComments,
  FaQuestionCircle,
  FaBookOpen,
} from "react-icons/fa";

export default function Support() {
  return (
    <>
      <PageMeta
        title="Support | School Tracker"
        description="Support page for School Tracker application"
      />
      <div className="w-full">
        <div className="mb-10 flex flex-col justify-center items-center text-center">
          <div className="max-w-3xl">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
              Customer Support
              <span className="ml-3 inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 animate-pulse">
                Coming Soon
              </span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mt-4">
              We're setting up comprehensive support services to assist you with any questions or issues.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Support Services Coming Your Way
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 text-left">
            <div className="space-y-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 text-brand-500">
                  <FaHeadset size={24} />
                </div>
                <h4 className="font-medium text-brand-600 dark:text-brand-400">
                  24/7 Live Chat Support
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300 pl-9">
                Get immediate assistance from our education specialists whenever you need help with your applications.
              </p>
            </div>
            <div className="space-y-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 text-brand-500">
                  <FaComments size={24} />
                </div>
                <h4 className="font-medium text-brand-600 dark:text-brand-400">
                  Community Forums
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300 pl-9">
                Connect with other students, share experiences, and get advice from those who've been through the application process.
              </p>
            </div>
            <div className="space-y-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 text-brand-500">
                  <FaQuestionCircle size={24} />
                </div>
                <h4 className="font-medium text-brand-600 dark:text-brand-400">
                  FAQ Knowledge Base
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300 pl-9">
                Browse our extensive library of answers to common questions about school applications and admissions.
              </p>
            </div>
            <div className="space-y-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 text-brand-500">
                  <FaBookOpen size={24} />
                </div>
                <h4 className="font-medium text-brand-600 dark:text-brand-400">
                  Video Tutorials
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300 pl-9">
                Step-by-step visual guides to help you navigate every aspect of the School Tracker platform.
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
            In the meantime, please email support@schooltracker.com for assistance!
          </p>
        </div>
      </div>
    </>
  );
}
