import { useState } from "react";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import { UserInfoModalProps } from "../../../types/user";

export default function UserInfoModal({
	userInfo,
	onSave,
	onClose,
}: UserInfoModalProps) {
	const [formData, setFormData] = useState({
		first_name: userInfo.first_name,
		last_name: userInfo.last_name,
		email: userInfo.email,
		phone: userInfo.phone,
		date_of_birth: userInfo.date_of_birth,
		gender: userInfo.gender,
		bio: userInfo.bio,
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave();
	};

	return (
		<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
			<div className="px-2 pr-14">
				<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
					Edit Personal Information
				</h4>
				<p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
					Update your details to keep your profile up-to-date.
				</p>
			</div>
			<form className="flex flex-col" onSubmit={handleSubmit}>
				<div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
					<div className="mt-7">
						<h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
							Personal Information
						</h5>

						<div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
							<div className="col-span-2 lg:col-span-1">
								<Label>First Name</Label>
								<Input
									type="text"
									name="first_name"
									value={formData.first_name}
									onChange={handleChange}
								/>
							</div>

							<div className="col-span-2 lg:col-span-1">
								<Label>Last Name</Label>
								<Input
									type="text"
									name="last_name"
									value={formData.last_name}
									onChange={handleChange}
								/>
							</div>

							<div className="col-span-2 lg:col-span-1">
								<Label>Email Address</Label>
								<Input
									type="text"
									name="email"
									value={formData.email}
									onChange={handleChange}
								/>
							</div>

							<div className="col-span-2 lg:col-span-1">
								<Label>Phone</Label>
								<Input
									type="text"
									name="phone"
									value={formData.phone}
									onChange={handleChange}
								/>
							</div>

							<div className="col-span-2 lg:col-span-1">
								<Label>Date of Birth</Label>
								<Input
									type="date"
									name="date_of_birth"
									value={formData.date_of_birth}
									onChange={handleChange}
								/>
							</div>

							<div className="col-span-2 lg:col-span-1">
								<Label>Gender</Label>
								<select
									name="gender"
									value={formData.gender}
									onChange={handleChange}
									className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-600 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/80 dark:focus:border-brand-800"
								>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
									<option value="Other">Other</option>
								</select>
							</div>

							<div className="col-span-2">
								<Label>Bio</Label>
								<Input
									type="text"
									name="bio"
									value={formData.bio}
									onChange={handleChange}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
					<Button size="sm" variant="outline" onClick={onClose}>
						Close
					</Button>
					<Button size="sm" type="submit">
						Save Changes
					</Button>
				</div>
			</form>
		</div>
	);
}
