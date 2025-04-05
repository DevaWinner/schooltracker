import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import UserInfoModal from "./modals/UserInfoModal";
import { ComponentCardProps } from "../../types/user";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

// Update the props to include refreshData function
interface ExtendedCardProps extends ComponentCardProps {
	refreshData?: () => void;
}

export default function UserInfoCard({
	userInfo,
	refreshData,
}: ExtendedCardProps) {
	const { isOpen, openModal, closeModal } = useModal();
	const { profile } = useContext(AuthContext);

	const handleSave = () => {
		// Call the refresh function when modal is saved
		if (refreshData) {
			refreshData();
		}
		closeModal();
	};

	if (!userInfo) return null;

	return (
		<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
			<div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
				<div>
					<h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
						Personal Information
					</h4>
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<div>
							<p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
								First Name
							</p>
							<p className="text-sm font-medium text-gray-800 dark:text-white/90">
								{userInfo.first_name}
							</p>
						</div>
						<div>
							<p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
								Last Name
							</p>
							<p className="text-sm font-medium text-gray-800 dark:text-white/90">
								{userInfo.last_name}
							</p>
						</div>
						<div>
							<p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
								Email
							</p>
							<p className="text-sm font-medium text-gray-800 dark:text-white/90">
								{userInfo.email}
							</p>
						</div>
						<div>
							<p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
								Phone
							</p>
							<p className="text-sm font-medium text-gray-800 dark:text-white/90">
								{userInfo.phone || "N/A"}
							</p>
						</div>
						<div>
							<p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
								Date of Birth
							</p>
							<p className="text-sm font-medium text-gray-800 dark:text-white/90">
								{userInfo.date_of_birth
									? new Date(userInfo.date_of_birth).toLocaleDateString()
									: "N/A"}
							</p>
						</div>
						<div>
							<p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
								Gender
							</p>
							<p className="text-sm font-medium text-gray-800 dark:text-white/90">
								{userInfo.gender || "N/A"}
							</p>
						</div>
						<div>
							<p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
								Country
							</p>
							<p className="text-sm font-medium text-gray-800 dark:text-white/90">
								{userInfo.country}
							</p>
						</div>
					</div>
				</div>
				<button
					onClick={openModal}
					className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
				>
					<svg
						className="fill-current"
						width="18"
						height="18"
						viewBox="0 0 18 18"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206Z" />
					</svg>
					Edit
				</button>
			</div>
			<Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
				<UserInfoModal
					userInfo={userInfo}
					onSave={handleSave}
					onClose={closeModal}
				/>
			</Modal>
		</div>
	);
}
