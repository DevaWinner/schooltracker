import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import BarChart from "../../components/charts/bar/BarChart";
import LineChart from "../../components/charts/line/LineChart";
import RecentDocs from "../../components/Dashboard/RecentDocs";
import UpcomingDeadline from "../../components/Dashboard/UpcomingDeadline";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard | School Tracker"
        description="School Tracker Dashboard for tracking applications, deadlines, and documents."
      />
      <PageBreadcrumb pageTitle="Dashboard" />
      <div className="grid grid-cols-2 gap-4 md:gap-6 text-4xl text-gray-900 dark:text-gray-100">
        <div className="col-span-2">
          <RecentDocs />
        </div>
        <div className="col-span-2">
          <UpcomingDeadline />
        </div>
        <div>
          <BarChart />
        </div>
        <div>
          <LineChart />
        </div>
      </div>
    </>
  );
}
