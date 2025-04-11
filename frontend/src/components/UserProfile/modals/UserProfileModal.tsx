import { useState, ChangeEvent, FormEvent, useContext, useRef } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/AuthContext";
import { updateUserProfile, uploadProfilePicture } from "../../../api/profile";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import { ComponentCardProps } from "../../../types/user";

export default function UserProfileModal({
	userProfile,
	onSave,
	onClose,
}: ComponentCardProps) {
	const { refreshProfileData } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const [imagePreview, setImagePreview] = useState<string | null>(
		userProfile?.profile_picture || null
	);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [imageFile, setImageFile] = useState<File | null>(null);

	const [formData, setFormData] = useState({
		bio: userProfile?.bio || "",
		profile_picture: userProfile?.profile_picture || "",
		facebook: userProfile?.facebook || "",
		twitter: userProfile?.twitter || "",
		linkedin: userProfile?.linkedin || "",
		instagram: userProfile?.instagram || "",
	});

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Create temporary preview only - don't upload yet
		const tempPreviewUrl = URL.createObjectURL(file);
		setImagePreview(tempPreviewUrl);
		setImageFile(file);
	};

	const handleImageClick = () => {
		fileInputRef.current?.click();
	};

	const handleRemoveImage = () => {
		setImagePreview(null);
		setFormData((prev) => ({ ...prev, profile_picture: "" }));
		setImageFile(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		setLoading(true);
		try {
			// Create update payload
			let updateData = {
				bio: formData.bio,
				profile_picture: formData.profile_picture,
				facebook: formData.facebook,
				twitter: formData.twitter,
				linkedin: formData.linkedin,
				instagram: formData.instagram,
			};

			// If there's a new image file, upload it first
			if (imageFile) {
				try {
					const uploadResult = await uploadProfilePicture(imageFile);
					// Update the profile_picture field with the URL from the upload
					updateData = {
						...updateData,
						profile_picture: uploadResult.profile_picture,
					};
					toast.success("Profile picture uploaded successfully");
				} catch (error: any) {
					toast.error(error.message || "Failed to upload profile picture");
					// Continue with the rest of the update even if image upload fails
				}
			}

			// Send update request without passing token
			await updateUserProfile(updateData);

			// Refresh global profile state
			await refreshProfileData();

			toast.success("Profile updated successfully");
			if (onSave) onSave();
		} catch (error: any) {
			// Improved error handling
			let errorMessage = "Failed to update profile";

			if (error.response?.data) {
				if (typeof error.response.data === "string") {
					errorMessage = error.response.data;
				} else if (error.response.data.message) {
					errorMessage = error.response.data.message;
				} else if (error.response.data.detail) {
					errorMessage = error.response.data.detail;
				} else if (error.response.data.error) {
					errorMessage = error.response.data.error;
				} else if (Object.keys(error.response.data).length > 0) {
					// Handle field-specific errors
					const fieldErrors = Object.entries(error.response.data)
						.map(([field, msgs]) => {
							const messages = Array.isArray(msgs) ? msgs.join(", ") : msgs;
							return `${field}: ${messages}`;
						})
						.join("; ");
					if (fieldErrors) errorMessage = fieldErrors;
				}
			} else if (error.message) {
				errorMessage = error.message;
			}

			toast.error(errorMessage);
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
					Update your bio, profile picture and social links.
				</p>
			</div>

			<form className="flex flex-col" onSubmit={handleSubmit}>
				<div className="mb-6 flex flex-col items-center">
					<Label className="self-start mb-2">Profile Picture</Label>
					<div
						className="relative w-24 h-24 mb-2 overflow-hidden rounded-full border-2 border-gray-200 cursor-pointer"
						onClick={handleImageClick}
					>
						{imagePreview ? (
							<img
								src={imagePreview}
								alt="Profile Preview"
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
								<svg
									className="w-10 h-10 text-gray-400"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
										clipRule="evenodd"
									></path>
								</svg>
							</div>
						)}

						<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
							<span className="text-white text-sm font-medium">Change</span>
						</div>
					</div>

					<input
						type="file"
						accept="image/jpeg,image/png,image/gif"
						ref={fileInputRef}
						onChange={handleImageChange}
						className="hidden"
					/>

					{imagePreview && (
						<button
							type="button"
							onClick={handleRemoveImage}
							className="text-sm text-red-500 hover:text-red-700 mt-1"
						>
							Remove photo
						</button>
					)}
					<p className="text-xs text-gray-500 mt-1">
						Supported formats: JPEG, PNG, GIF (max 50MB)
					</p>
					{imageFile && (
						<p className="text-xs text-blue-500 mt-1">
							New image selected - will be uploaded when you save changes
						</p>
					)}
				</div>

				<div className="mb-4">
					<Label>Bio</Label>
					<textarea
						name="bio"
						value={formData.bio}
						onChange={handleChange}
						className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
						rows={3}
					/>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<Label>Facebook</Label>
						<div className="flex items-center">
							<span className="text-gray-500 dark:text-gray-400 mr-2">
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path d="M11.6666 11.2503H13.7499L14.5833 7.91699H11.6666V6.25033C11.6666 5.39251 11.6666 4.58366 13.3333 4.58366H14.5833V1.78374C14.3118 1.7477 13.2858 1.66699 12.2023 1.66699C9.94025 1.66699 8.33325 3.04771 8.33325 5.58342V7.91699H5.83325V11.2503H8.33325V18.3337H11.6666V11.2503Z" />
								</svg>
							</span>
							<Input
								type="text"
								name="facebook"
								value={formData.facebook}
								onChange={handleChange}
								placeholder="https://facebook.com/username"
								className="dark:bg-gray-800 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-gray-500"
							/>
						</div>
					</div>
					<div>
						<Label>Twitter</Label>
						<div className="flex items-center">
							<span className="text-gray-500 dark:text-gray-400 mr-2">
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path d="M15.1708 1.875H17.9274L11.9049 8.75833L18.9899 18.125H13.4424L9.09742 12.4442L4.12578 18.125H1.36745L7.80912 10.7625L1.01245 1.875H6.70078L10.6283 7.0675L15.1708 1.875ZM14.2033 16.475H15.7308L5.87078 3.43833H4.23162L14.2033 16.475Z" />
								</svg>
							</span>
							<Input
								type="text"
								name="twitter"
								value={formData.twitter}
								onChange={handleChange}
								placeholder="https://twitter.com/username"
								className="dark:bg-gray-800 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-gray-500"
							/>
						</div>
					</div>
					<div>
						<Label>LinkedIn</Label>
						<div className="flex items-center">
							<span className="text-gray-500 dark:text-gray-400 mr-2">
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path d="M5.78381 4.16645C5.78351 4.84504 5.37181 5.45569 4.74286 5.71045C4.11391 5.96521 3.39331 5.81321 2.92083 5.32613C2.44836 4.83904 2.31837 4.11413 2.59216 3.49323C2.86596 2.87233 3.48886 2.47942 4.16715 2.49978C5.06804 2.52682 5.78422 3.26515 5.78381 4.16645ZM5.83381 7.06645H2.50048V17.4998H5.83381V7.06645ZM11.1005 7.06645H7.78381V17.4998H11.0672V12.0248C11.0672 8.97475 15.0422 8.69142 15.0422 12.0248V17.4998H18.3338V10.8914C18.3338 5.74978 12.4505 5.94145 11.0672 8.46642L11.1005 7.06645Z" />
								</svg>
							</span>
							<Input
								type="text"
								name="linkedin"
								value={formData.linkedin}
								onChange={handleChange}
								placeholder="https://linkedin.com/in/username"
								className="dark:bg-gray-800 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-gray-500"
							/>
						</div>
					</div>
					<div>
						<Label>Instagram</Label>
						<div className="flex items-center">
							<span className="text-gray-500 dark:text-gray-400 mr-2">
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path d="M10.8567 1.66699C11.7946 1.66854 12.2698 1.67351 12.6805 1.68573L12.8422 1.69102C13.0291 1.69766 13.2134 1.70599 13.4357 1.71641C14.3224 1.75738 14.9273 1.89766 15.4586 2.10391C16.0078 2.31572 16.4717 2.60183 16.9349 3.06503C17.3974 3.52822 17.6836 3.99349 17.8961 4.54141C18.1016 5.07197 18.2419 5.67753 18.2836 6.56433C18.2935 6.78655 18.3015 6.97088 18.3081 7.15775L18.3133 7.31949C18.3255 7.73011 18.3311 8.20543 18.3328 9.1433L18.3335 9.76463C18.3336 9.84055 18.3336 9.91888 18.3336 9.99972L18.3335 10.2348L18.333 10.8562C18.3314 11.794 18.3265 12.2694 18.3142 12.68L18.3089 12.8417C18.3023 13.0286 18.294 13.213 18.2836 13.4351C18.2426 14.322 18.1016 14.9268 17.8961 15.458C17.6842 16.0074 17.3974 16.4713 16.9349 16.9345C16.4717 17.397 16.0057 17.6831 15.4586 17.8955C14.9273 18.1011 14.3224 18.2414 13.4357 18.2831C13.2134 18.293 13.0291 18.3011 12.8422 18.3076L12.6805 18.3128C12.2698 18.3251 11.7946 18.3306 10.8567 18.3324L10.2353 18.333C10.1594 18.333 10.0811 18.333 10.0002 18.333H9.76516L9.14375 18.3325C8.20591 18.331 7.7306 18.326 7.31997 18.3137L7.15824 18.3085C6.97136 18.3018 6.78703 18.2935 6.56481 18.2831C5.67801 18.2421 5.07384 18.1011 4.5419 17.8955C3.99328 17.6838 3.5287 17.397 3.06551 16.9345C2.60231 16.4713 2.3169 16.0053 2.1044 15.458C1.89815 14.9268 1.75856 14.322 1.7169 13.4351C1.707 13.213 1.69892 13.0286 1.69238 12.8417L1.68714 12.68C1.67495 12.2694 1.66939 11.794 1.66759 10.8562L1.66748 9.1433C1.66903 8.20543 1.67399 7.73011 1.68621 7.31949L1.69151 7.15775C1.69815 6.97088 1.70648 6.78655 1.7169 6.56433C1.75786 5.67683 1.89815 5.07266 2.1044 4.54141C2.3162 3.9928 2.60231 3.52822 3.06551 3.06503C3.5287 2.60183 3.99398 2.31641 4.5419 2.10391C5.07315 1.89766 5.67731 1.75808 6.56481 1.71641C6.78703 1.70652 6.97136 1.69844 7.15824 1.6919L7.31997 1.68666C7.7306 1.67446 8.20591 1.6689 9.14375 1.6671L10.8567 1.66699ZM10.0002 5.83308C7.69781 5.83308 5.83356 7.69935 5.83356 9.99972C5.83356 12.3021 7.69984 14.1664 10.0002 14.1664C12.3027 14.1664 14.1669 12.3001 14.1669 9.99972C14.1669 7.69732 12.3006 5.83308 10.0002 5.83308ZM10.0002 7.49974C11.381 7.49974 12.5002 8.61863 12.5002 9.99972C12.5002 11.3805 11.3813 12.4997 10.0002 12.4997C8.6195 12.4997 7.50023 11.3809 7.50023 9.99972C7.50023 8.61897 8.61908 7.49974 10.0002 7.49974ZM14.3752 4.58308C13.8008 4.58308 13.3336 5.04967 13.3336 5.62403C13.3336 6.19841 13.8002 6.66572 14.3752 6.66572C14.9496 6.66572 15.4169 6.19913 15.4169 5.62403C15.4169 5.04967 14.9488 4.58236 14.3752 4.58308Z" />
								</svg>
							</span>
							<Input
								type="text"
								name="instagram"
								value={formData.instagram}
								onChange={handleChange}
								placeholder="https://instagram.com/username"
								className="dark:bg-gray-800 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-gray-500"
							/>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-3 mt-6 lg:justify-end">
					<Button size="sm" variant="outline" onClick={onClose} type="button">
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
