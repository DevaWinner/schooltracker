import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import FileInput from "../form/input/FileInput";
import Label from "../form/Label";
import { useState } from "react";

export default function DocumentForm() {
  const [formData, setFormData] = useState({
    application_id: "",
    document_type: "",
    file_name: "",
    file_url: "",
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
  /*const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        // Takes a post event to submit the document with parameters
    } catch (error) {
      console.error("Network error:", error);
    }
  };*/

  return (
    <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
      <form /*onSubmit={submitForm}*/ className="flex flex-col">
        <div className="custom-scrollbar h-[280px] overflow-y-auto px-2 pb-3">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <div className="col-span-full">
              <FileInput />
            </div>
            <div>
              <Label>Application</Label>
              <Input
                type="text"
                id="application"
                name="application"
                placeholder="Will be replaced or removed on integration"
                value={formData.application_id}
                onChange={changeForm}
              />
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
            <div>
              <Label>File URL</Label>
              <Input
                type="text"
                id="file_url"
                name="file_url"
                placeholder="Enter the files URL"
                value={formData.file_url}
                onChange={changeForm}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button size="sm" type="submit">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
