import PageMeta from "../../components/common/PageMeta";
import DocumentGrid from "../../components/document/DocumentGrid";

export default function DocumentLibrary() {
  return (
    <>
      <PageMeta
        title="Document Library | School Tracker"
        description="Document library page for School Tracker application"
      />
      <div className="text-4xl text-gray-900 dark:text-gray-100">
        <DocumentGrid />
      </div>
    </>
  );
}
