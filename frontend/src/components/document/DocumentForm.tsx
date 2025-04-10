import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { ChangeEvent, useContext, useRef, useState } from "react";
import { ApplicationProps } from "../../types/applications";
import { toast } from "react-toastify";
import { uploadDocumentFile } from "../../api/document";
import { UploadDocumentRequest } from "../../types/documents";
import { AuthContext } from "../../context/AuthContext";

export default function DocumentForm({ data }: ApplicationProps) {
  const { accessToken, refreshProfileData } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    application_id: "",
    document_type: "",
    file_name: "",
    file: null,
  });

  // Updates values when the form is updated
  const changeForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Updates file value when a file is given
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFile(file);
  };

  // Handles form submission, beginning the document POST request
  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!accessToken) {
      toast.error("Authentication required");
      return;
    }
    setLoading(true);
    // Create upload payload
    const payload: UploadDocumentRequest = {
      //user_id: user,
      file: file,
      document_type: formData.document_type,
      application: Number(formData.application_id),
      file_name: formData.file_name,
    };
    try {
      // Send update request to API using uploadDocumentFile for /document/upload/ endpoint
      await uploadDocumentFile(payload);

      // Refresh global profile state
      await refreshProfileData();

      toast.success("Document uploaded successfully!");
    } catch (err: any) {
      let errorMessage = "Upload failed. Please try again.";
      if (err.response?.data) {
        // Handle specific API error responses
        const errorData = err.response.data;
        if (typeof errorData === "object" && !Array.isArray(errorData)) {
          // Extract field-specific errors
          const fieldErrors = Object.entries(errorData)
            .map(([field, errors]) => {
              if (Array.isArray(errors)) {
                return `${field}: ${errors.join(", ")}`;
              }
              return `${field}: ${errors}`;
            })
            .join("; ");

          errorMessage = fieldErrors || errorMessage;
        } else {
          errorMessage =
            err.response.data.message ||
            err.response.data.detail ||
            err.response.data.error ||
            (typeof err.response.data === "string"
              ? err.response.data
              : errorMessage);
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const options = () => {
    if (data) {
      return data.map((data) => <option value={data.id}>{data.notes}</option>);
    } else {
      return <option value="">No Applications</option>;
    }
  };

  return (
    <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
      <form onSubmit={submitForm} className="flex flex-col">
        <div className="custom-scrollbar h-[280px] overflow-y-auto px-2 pb-3">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <div className="col-span-full">
              <Label>File</Label>
              <input
                type="file"
                id="file_url"
                name="file_url"
                ref={fileInputRef}
                className={`focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400`}
                onChange={handleFileChange}
              />
            </div>
            <div>
              <Label>Application</Label>
              <select
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                id="application_id"
                name="application_id"
                onChange={changeForm}
              >
                {options()}
              </select>
            </div>
            <div>
              <Label>Document Type</Label>
              <select
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                id="document_type"
                name="document_type"
                onChange={changeForm}
              >
                <option value="Transcript">Transcript</option>
                <option value="Essay">Essay</option>
                <option value="CV">CV</option>
                <option value="Recommendation Letter">
                  Recommendation Letter
                </option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <Label>File Name</Label>
              <Input
                type="text"
                id="file_name"
                name="file_name"
                placeholder="Enter a name for the file"
                value={formData.file_name}
                onChange={changeForm}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button size="sm" type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </form>
    </div>
  );
}
