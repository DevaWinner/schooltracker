import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/table/BasicTable";

export default function ApplicationTracker() {
  return (
    <>
      <PageMeta
        title="Application Tracker | School Tracker"
        description="Application tracking page for School Tracker application"
      />
      <PageBreadcrumb pageTitle="Application Tracker" />
      <div className="space-y-6 text-4xl text-gray-900 dark:text-gray-100">
        <ComponentCard title="Basic Table 1">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
