import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import AddApplication from "../../components/table/AddApplication";
import ApplicationTable from "../../components/table/ApplicationTable";
// Placeholder data. Should be replaced on integration
import { tableData } from "../../components/table/placeholderData";

export default function ApplicationTracker() {
  return (
    <>
      <PageMeta
        title="Application Tracker | School Tracker"
        description="Application tracking page for School Tracker application"
      />
      <PageBreadcrumb pageTitle="Application Tracker" />
      <div className="space-y-6 text-4xl text-gray-900 dark:text-gray-100">
        <ComponentCard title="Applications">
          <AddApplication data={tableData} />
          <ApplicationTable data={tableData} />
        </ComponentCard>
      </div>
    </>
  );
}
