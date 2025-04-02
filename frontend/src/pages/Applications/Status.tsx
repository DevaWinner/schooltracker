import StatusTable from "../../components/ApplicationStatus/StatusTable";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

export default function ApplicationStatus() {
  return (
    <>
      <PageMeta
        title="Status & Deadlines | School Tracker"
        description="Application status and deadlines page for School Tracker application"
      />
      <PageBreadcrumb pageTitle="Status & Deadlines" />
      <div className="space-y-6 text-4xl text-gray-900 dark:text-gray-100">
        <ComponentCard title="Status & Deadlines">
          <StatusTable />
        </ComponentCard>
      </div>
    </>
  );
}
