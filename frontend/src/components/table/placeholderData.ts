import { Application } from "../../types/applications"

// Define the table data using the interface
export const tableData: Application[] = [
  {
    id: 1,
    institution: "Nondescript College",
    tag: "Community College",
    website: "Agency Website",
    scholarship: true,
    status: "Active",
    deadline: "04-12-2025"
  },
  {
    id: 2,
    institution: "Nondescript University",
    tag: "University",
    website: "Agency Website",
    scholarship: true,
    status: "Cancel",
    deadline: "03-24-2025"
  },
  {
    id: 3,
    institution: "Other University",
    tag: "University",
    website: "Agency Website",
    scholarship: false,
    status: "Pending",
    deadline: "04-12-2025"
  }
];