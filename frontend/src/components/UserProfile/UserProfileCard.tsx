import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import UserProfileModal from "./modals/UserProfileModal";
import { ComponentCardProps } from "../../types/user";

export default function UserProfileCard({ userProfile }: ComponentCardProps) {
	const { isOpen, openModal, closeModal } = useModal();

	const handleSave = () => {
		console.log("User profile updated");
		closeModal();
	};

	if (!userProfile) return null;

	return (
		<>
			<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
				<div className="flex flex-col items-center gap-6 xl:flex-row">
					<div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
						{userProfile.profile_picture ? (
							<img src={userProfile.profile_picture} alt="Profile" />
						) : (
							<div className="w-full h-full flex items-center justify-center bg-gray-200">
								No Image
							</div>
						)}
					</div>
					<div className="text-center xl:text-left">
						<h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
							{userProfile.bio || "No bio available"}
						</h4>
						<div className="mt-2 flex justify-center gap-3">
							{userProfile.facebook && (
								<a
									href={userProfile.facebook}
									target="_blank"
									rel="noopener"
									className="text-blue-600"
								>
									FB
								</a>
							)}
							{userProfile.twitter && (
								<a
									href={userProfile.twitter}
									target="_blank"
									rel="noopener"
									className="text-blue-400"
								>
									TW
								</a>
							)}
							{userProfile.linkedin && (
								<a
									href={userProfile.linkedin}
									target="_blank"
									rel="noopener"
									className="text-blue-700"
								>
									LI
								</a>
							)}
							{userProfile.instagram && (
								<a
									href={userProfile.instagram}
									target="_blank"
									rel="noopener"
									className="text-pink-500"
								>
									IG
								</a>
							)}
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
			</div>
			<Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
				<UserProfileModal
					userProfile={userProfile}
					onSave={handleSave}
					onClose={closeModal}
				/>
			</Modal>
		</>
	);
}
