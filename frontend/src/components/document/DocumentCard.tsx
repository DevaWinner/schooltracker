import { Document } from "../../types/documents";
export default function DocumentCard({ data }: Document) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-end justify-between mt-5">
        <div>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {data.file_name}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {data.document_type}
          </p>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {data.uploaded_at}
          </span>
        </div>
      </div>
    </div>
  );
}
