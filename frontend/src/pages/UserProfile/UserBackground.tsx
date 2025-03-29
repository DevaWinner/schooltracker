import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AcademicBackgroundCard from "../../components/UserBackground/AcademicBackgroundCard";
import PageMeta from "../../components/common/PageMeta";

export default function UserBackground() {
	return (
		<>
			<PageMeta
				title="Academic Background | School Tracker"
				description="View and manage your academic background information"
			/>
			<PageBreadcrumb pageTitle="Academic Background" />
			<div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
				<h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
					Academic History
				</h3>
				<div className="space-y-6">
					<AcademicBackgroundCard />
				</div>
			</div>
		</>
	);
}
