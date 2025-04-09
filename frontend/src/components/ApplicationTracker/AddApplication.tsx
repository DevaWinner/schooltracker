import { useModal } from "../../hooks/useModal";
import { ApplicationProps } from "../../types/applications";
import { Modal } from "../ui/modal";
import ApplicationTableModal from "./modals/ApplicationTableModal";

export default function AddApplication({ data }: ApplicationProps) {
  const { isOpen, openModal, closeModal } = useModal();

  const handleSave = () => {
    console.log("Saving addition...");
    closeModal();
  };

  return (
    <>
      <button
        onClick={openModal}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
      >
        <svg
          className="fill-current"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 1.5C9.41421 1.5 9.75 1.83579 9.75 2.25V8.25H15.75C16.1642 8.25 16.5 8.58579 16.5 9C16.5 9.41421 16.1642 9.75 15.75 9.75H9.75V15.75C9.75 16.1642 9.41421 16.5 9 16.5C8.58579 16.5 8.25 16.1642 8.25 15.75V9.75H2.25C1.83579 9.75 1.5 9.41421 1.5 9C1.5 8.58579 1.83579 8.25 2.25 8.25H8.25V2.25C8.25 1.83579 8.58579 1.5 9 1.5Z"
            fill=""
          />
        </svg>
        Add Application
      </button>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <ApplicationTableModal
          onSave={handleSave}
          onClose={closeModal}
          data={data}
        />
      </Modal>
    </>
  );
}
