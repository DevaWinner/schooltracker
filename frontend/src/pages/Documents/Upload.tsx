import { tableData } from "../../components/ApplicationTracker/placeholderData";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import DocumentForm from "../../components/document/DocumentForm";

export default function DocumentUpload() {
  return (
    <>
      <PageMeta
        title="Upload Documents | School Tracker"
        description="Document upload page for School Tracker application"
      />
      <div className="text-4xl text-gray-900 dark:text-gray-100">
        <ComponentCard title="Upload Documents">
          <DocumentForm data={tableData} />
        </ComponentCard>
      </div>
    </>
  );
}
