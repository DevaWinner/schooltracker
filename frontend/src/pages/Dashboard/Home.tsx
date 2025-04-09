import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import BarChart from "../../components/charts/bar/BarChart";
import RecentDocs from "../../components/Dashboard/RecentDocs";
import UpcomingDeadline from "../../components/Dashboard/UpcomingDeadline";
import { tableData } from "../../components/ApplicationTracker/placeholderData";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard | School Tracker"
        description="School Tracker Dashboard for tracking applications, deadlines, and documents."
      />
      <PageBreadcrumb pageTitle="Dashboard" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 text-4xl text-gray-900 dark:text-gray-100">
        <div className="col-span-full">
          <RecentDocs />
        </div>
        <div className="col-span-full">
          <UpcomingDeadline />
        </div>
        <div className="col-span-full">
          <BarChart data={tableData} />
        </div>
      </div>
    </>
  );
}
