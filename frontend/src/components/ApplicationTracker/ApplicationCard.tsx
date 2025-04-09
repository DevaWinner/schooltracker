import { TableCell, TableRow } from "../ui/table";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Badge from "../ui/badge/Badge";
import { Application } from "../../types/applications";
import Button from "../ui/button/Button";
import EditApplicationModal from "./modals/EditApplicationModal";

interface data {
  data: Application;
}

export default function ApplicationCard({ data }: data) {
  const { isOpen, openModal, closeModal } = useModal();

  const handleSave = () => {
    console.log("Saving addition...");
    closeModal();
  };
  // This method will be replaced with a delete method interacting
  // with the official database
  const deleteItem = () => {
    console.log("Deleting application...");
  };

  return (
    <>
      <TableRow key={data.id}>
        <TableCell className="px-5 py-4 sm:px-6 text-start">
          {data.program_id}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {data.start_date}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          <Badge
            size="sm"
            color={
              data.status === "Draft"
                ? "error"
                : data.status === "In Progress"
                ? "warning"
                : data.status === "Submitted"
                ? "primary"
                : data.status === "Interview"
                ? "info"
                : data.status === "Accepted"
                ? "success"
                : "error"
            }
          >
            {data.status}
          </Badge>
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
          {data.submitted_date}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
          {data.decision_date}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
          <Button size="sm" variant="outline" onClick={openModal}>
            Edit
          </Button>
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
          <Button size="sm" variant="outline" onClick={deleteItem}>
            Delete
          </Button>
        </TableCell>
      </TableRow>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <EditApplicationModal
          data={data}
          onSave={handleSave}
          onClose={closeModal}
        />
      </Modal>
    </>
  );
}
