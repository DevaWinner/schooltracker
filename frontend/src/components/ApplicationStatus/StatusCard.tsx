import { TableCell, TableRow } from "../ui/table";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Badge from "../ui/badge/Badge";
import { Application } from "../../types/applications";
import Button from "../ui/button/Button";
import EditApplicationModal from "./modals/StatusApplicationModal";

interface data {
  data: Application;
}

export default function StatusCard({ data }: data) {
  const { isOpen, openModal, closeModal } = useModal();

  const handleSave = () => {
    console.log("Saving addition...");
    closeModal();
  };

  return (
    <>
      <TableRow key={data.id}>
        <TableCell className="px-5 py-4 sm:px-6 text-start">
          <div className="flex items-center gap-3">
            <div>
              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                {data.institution}
              </span>
              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                {data.tag}
              </span>
            </div>
          </div>
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          <Badge
            size="sm"
            color={
              data.status === "Active"
                ? "success"
                : data.status === "Pending"
                ? "warning"
                : "error"
            }
          >
            {data.status}
          </Badge>
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
          {data.deadline}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
          <Button size="sm" variant="outline" onClick={openModal}>
            Edit
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
