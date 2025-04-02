/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import { useState } from "react";

interface EditApplicationModalProps {
  data: any;
  onSave: () => void;
  onClose: () => void;
}

export default function EditApplicationModal({
  data,
  onSave,
  onClose,
}: EditApplicationModalProps) {
  const [formData, setData] = useState({
    institution: data.institution,
    tag: data.tag,
    website: data.website,
    scholarship: data.scholarship,
    status: data.status,
    deadline: data.deadline,
  });
  // Updates values when the form is updated
  const changeForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
      <div className="px-2 pr-14">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Edit Application
        </h4>
      </div>

      <form onSubmit={submitForm} className="flex flex-col">
        <div className="custom-scrollbar h-[300px] overflow-y-auto px-2 pb-3">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <div>
              <Label>Institution Name</Label>
              <Input
                type="text"
                id="institution"
                name="institution"
                placeholder="Enter institution name"
                value={formData.institution}
                onChange={changeForm}
              />
            </div>
            <div>
              <Label>Institution Type</Label>
              <Input
                type="text"
                id="tag"
                name="tag"
                placeholder="Community college, university, etc."
                value={formData.tag}
                onChange={changeForm}
              />
            </div>
            <div>
              <Label>Website</Label>
              <Input
                type="text"
                id="website"
                name="website"
                placeholder="Enter institution site link"
                value={formData.website}
                onChange={changeForm}
              />
            </div>
            <div>
              <Label>Scholarship</Label>
              <select
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                id="scholarship"
                name="scholarship"
                onChange={changeForm}
              >
                <option value="false">False</option>
                <option value="true">True</option>
              </select>
            </div>
            <div>
              <Label>Deadline</Label>
              <Input
                type="date"
                id="deadline"
                name="deadline"
                onChange={changeForm}
                value={formData.deadline}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button size="sm" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" type="submit">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
