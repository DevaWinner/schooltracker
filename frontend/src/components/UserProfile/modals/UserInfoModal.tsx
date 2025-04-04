import { useState, ChangeEvent, FormEvent, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/AuthContext";
import { updateBasicInfo, UserInfoUpdateRequest } from "../../../api/profile";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import { ComponentCardProps } from "../../../types/user";

export default function UserInfoModal({
	userInfo,
	onSave,
	onClose,
}: ComponentCardProps) {
	const { accessToken, setProfile } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		first_name: userInfo?.first_name || "",
		last_name: userInfo?.last_name || "",
		email: userInfo?.email || "",
		phone: userInfo?.phone || "",
		date_of_birth: userInfo?.date_of_birth || "",
		gender: userInfo?.gender || "",
		country: userInfo?.country || "",
	});

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!accessToken) {
			toast.error("Authentication required");
			return;
		}
		setLoading(true);
		try {
			// Create properly typed request object
			const updateData: UserInfoUpdateRequest = {
				first_name: formData.first_name,
				last_name: formData.last_name,
				phone: formData.phone,
				date_of_birth: formData.date_of_birth,
				country: formData.country,
				// Convert string gender to the appropriate type
				gender: formData.gender as "Male" | "Female" | "Other" | undefined,
			};

			// Send update request to API using updateBasicInfo for /user/info/ endpoint
			const updatedProfile = await updateBasicInfo(accessToken, updateData);

			// Update the global profile state
			setProfile(updatedProfile);

			toast.success("User information updated successfully");
			if (onSave) onSave();
		} catch (error: any) {
			const errorMessage =
				error.response?.data?.message ||
				error.response?.data?.detail ||
				"Failed to update user information";
			toast.error(errorMessage);
			console.error("Update error:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="relative w-full p-4 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
			<div className="px-2 pr-14">
				<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
					Edit Personal Information
				</h4>
				<p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
					Update your personal details.
				</p>
			</div>
			<form className="flex flex-col" onSubmit={handleSubmit}>
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					<div>
						<Label>First Name</Label>
						<Input
							type="text"
							name="first_name"
							value={formData.first_name}
							onChange={handleChange}
						/>
					</div>
					<div>
						<Label>Last Name</Label>
						<Input
							type="text"
							name="last_name"
							value={formData.last_name}
							onChange={handleChange}
						/>
					</div>
					<div>
						<Label>Email</Label>
						<Input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
						/>
					</div>
					<div>
						<Label>Phone</Label>
						<Input
							type="text"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
						/>
					</div>
					<div>
						<Label>Date of Birth</Label>
						<Input
							type="date"
							name="date_of_birth"
							value={formData.date_of_birth}
							onChange={handleChange}
						/>
					</div>
					<div>
						<Label>Gender</Label>
						<select
							name="gender"
							value={formData.gender}
							onChange={handleChange}
							className="w-full rounded-lg border border-gray-300 p-2"
						>
							<option value="">Select gender</option>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
							<option value="Other">Other</option>
						</select>
					</div>
					<div className="lg:col-span-2">
						<Label>Country</Label>
						<Input
							type="text"
							name="country"
							value={formData.country}
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
