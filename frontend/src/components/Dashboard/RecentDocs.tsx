import { Document } from "../../types/documents";
import DocumentCard from "../document/DocumentCard";

export default function RecentDocs() {
  const data: Document[] = [
    {
      id: 1,
      user_id: 1234,
      application_id: 1234,
      document_type: "Other",
      file_name: "Placeholder",
      file_url: "file-url",
      uploaded_at: "2025-04-05",
    },
    {
      id: 2,
      user_id: 1234,
      application_id: 1234,
      document_type: "Essay",
      file_name: "Placeholder 2",
      file_url: "file-url",
      uploaded_at: "2025-04-05",
    },
    {
      id: 3,
      user_id: 1234,
      application_id: 1234,
      document_type: "CV",
      file_name: "Placeholder 3",
      file_url: "file-url",
      uploaded_at: "2025-04-03",
    },
    {
      id: 4,
      user_id: 1234,
      application_id: 1234,
      document_type: "Other",
      file_name: "Placeholder 4",
      file_url: "file-url",
      uploaded_at: "2025-04-07",
    },
  ];

  const sortedItems = data.sort(
    (a, b) =>
      new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
  );
  const documents = sortedItems.slice(0, 3);
  const hasData = () => {
    if (documents) {
      return documents.map((data) => <DocumentCard data={data} />);
    } else {
      return "No documents were found";
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {hasData()}
    </div>
  );
}
