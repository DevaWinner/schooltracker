import { useState, ChangeEvent, FormEvent, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/AuthContext";
import { updatePartialProfile } from "../../../api/profile";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import { ComponentCardProps } from "../../../types/user";

export default function UserProfileModal({
	userProfile,
	onSave,
	onClose,
}: ComponentCardProps) {
	const { accessToken } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		bio: userProfile?.bio || "",
		profile_picture: userProfile?.profile_picture || "",
		facebook: userProfile?.facebook || "",
		twitter: userProfile?.twitter || "",
		linkedin: userProfile?.linkedin || "",
		instagram: userProfile?.instagram || "",
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!accessToken) return;
		setLoading(true);
		try {
			const { bio, profile_picture, facebook, twitter, linkedin, instagram } =
				formData;
			await updatePartialProfile(accessToken, {
				bio,
				profile_picture,
				social_links: { facebook, twitter, linkedin, instagram },
			});
			toast.success("User profile updated successfully");
			if (onSave) onSave(); // Add null check here
		} catch (error) {
			toast.error("Failed to update user profile");
			console.error("Update error:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="relative w-full p-4 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
			<div className="px-2 pr-14">
				<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
					Edit Profile Details
				</h4>
				<p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
					Update your bio and social links.
				</p>
			</div>
			<form className="flex flex-col" onSubmit={handleSubmit}>
				<div className="mb-4">
					<Label>Bio</Label>
					<Input
						type="text"
						name="bio"
						value={formData.bio}
						onChange={handleChange}
					/>
				</div>
				<div className="mb-4">
					<Label>Profile Picture URL</Label>
					<Input
						type="text"
						name="profile_picture"
						value={formData.profile_picture}
						onChange={handleChange}
					/>
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<Label>Facebook</Label>
						<Input
							type="text"
							name="facebook"
							value={formData.facebook}
							onChange={handleChange}
						/>
					</div>
					<div>
						<Label>Twitter</Label>
						<Input
							type="text"
							name="twitter"
							value={formData.twitter}
							onChange={handleChange}
						/>
					</div>
					<div>
						<Label>LinkedIn</Label>
						<Input
							type="text"
							name="linkedin"
							value={formData.linkedin}
							onChange={handleChange}
						/>
					</div>
					<div>
						<Label>Instagram</Label>
						<Input
							type="text"
							name="instagram"
							value={formData.instagram}
							onChange={handleChange}
						/>
					</div>
				</div>
				<div className="flex items-center gap-3 mt-6 lg:justify-end">
					<Button size="sm" variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button size="sm" type="submit" disabled={loading}>
						{loading ? "Saving..." : "Save Changes"}
					</Button>
				</div>
			</form>
		</div>
	);
}
