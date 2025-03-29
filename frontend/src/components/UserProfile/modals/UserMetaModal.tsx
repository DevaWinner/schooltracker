import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";

interface UserMetaModalProps {
	userInfo: any;
	onSave: () => void;
	onClose: () => void;
}

export default function UserMetaModal({
	userInfo,
	onSave,
	onClose,
}: UserMetaModalProps) {
	return (
		<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
			<div className="px-2 pr-14">
				<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
					Edit Profile Picture & Social Links
				</h4>
				<p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
					Update your profile picture and social media links.
				</p>
			</div>
			<form className="flex flex-col">
				<div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
					<div className="mb-6">
						<h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90">
							Profile Picture
						</h5>
						<div className="flex items-center gap-4">
							<div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
								<img
									src={userInfo.profile_picture}
									alt={`${userInfo.first_name} ${userInfo.last_name}`}
								/>
							</div>
							<Button size="sm" variant="outline">
								Change Picture
							</Button>
						</div>
					</div>

					<div>
						<h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90">
							Social Links
						</h5>
						<div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
							<div>
								<Label>Facebook</Label>
								<Input type="text" value={userInfo.facebook} />
							</div>

							<div>
								<Label>X.com</Label>
								<Input type="text" value={userInfo.twitter} />
							</div>

							<div>
								<Label>Linkedin</Label>
								<Input type="text" value={userInfo.linkedin} />
							</div>

							<div>
								<Label>Instagram</Label>
								<Input type="text" value={userInfo.instagram} />
							</div>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
					<Button size="sm" variant="outline" onClick={onClose}>
						Close
					</Button>
					<Button size="sm" onClick={onSave}>
						Save Changes
					</Button>
				</div>
			</form>
		</div>
	);
}
