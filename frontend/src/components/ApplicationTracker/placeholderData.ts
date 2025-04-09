import { Application } from "../../types/applications"

// Define the table data using the interface
export const tableData: Application[] = [
  {
    id: 1,
    user_id: 1234,
    program_id: 1234,
    status: "In Progress",
    start_date: "2025-04-12",
    submitted_date: "2025-04-12",
    decision_date: "2025-04-15",
    notes: "Note on the application.",
    created_at: "1743812214",
    updated_at: "1743812214"
  },
  {
    id: 2,
    user_id: 4321,
    program_id: 4321,
    status: "In Progress",
    start_date: "2025-04-12",
    submitted_date: "2025-04-12",
    decision_date: "2025-04-13",
    notes: "Note on the application.",
    created_at: "1743812214",
    updated_at: "1743812214"
  },
  {
    id: 3,
    user_id: 1234,
    program_id: 2345,
    status: "Accepted",
    start_date: "2025-04-12",
    submitted_date: "2025-04-12",
    decision_date: "2025-04-13",
    notes: "Application note",
    created_at: "1743812214",
    updated_at: "1743812214"
  }
];