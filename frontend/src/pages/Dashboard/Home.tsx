import PageMeta from "../../components/common/PageMeta";

export default function Home() {
	return (
		<>
			<PageMeta
				title="Dashboard | School Tracker"
				description="School Tracker Dashboard for tracking applications, deadlines, and documents."
			/>
			<div className="text-4xl text-gray-900 dark:text-gray-100">
				<h2>Main Dashboard</h2>
			</div>
		</>
	);
}
