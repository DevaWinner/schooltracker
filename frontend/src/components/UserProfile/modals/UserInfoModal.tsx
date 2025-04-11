import {
	useState,
	ChangeEvent,
	FormEvent,
	useContext,
	forwardRef,
} from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/AuthContext";
import { updateBasicInfo, UserInfoUpdateRequest } from "../../../api/profile";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import { ComponentCardProps } from "../../../types/user";
import { countries } from "../../../utils/countries";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Define the props interface for the DatePickerInput component
interface DatePickerInputProps {
	value?: string;
	onClick?: () => void;
	placeholder?: string;
	className?: string;
}

// Create a forwardRef component to wrap the input with proper typing
const DatePickerInput = forwardRef<HTMLInputElement, DatePickerInputProps>(
	({ value, onClick, placeholder, className }) => (
		<Input
			type="text"
			value={value || ""}
			onClick={onClick}
			placeholder={placeholder}
			className={className}
			readOnly
		/>
	)
);

// Add display name to avoid dev warnings
DatePickerInput.displayName = "DatePickerInput";

export default function UserInfoModal({
	userInfo,
	onSave,
	onClose,
}: ComponentCardProps) {
	const { refreshProfileData } = useContext(AuthContext);
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

	const handleDateChange = (date: Date | null) => {
		setFormData((prev) => ({
			...prev,
			date_of_birth: date ? date.toISOString().split("T")[0] : "",
		}));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
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

			// Send update request to API without passing token
			await updateBasicInfo(updateData);

			// Refresh global profile state
			await refreshProfileData();

			toast.success("User information updated successfully");
			if (onSave) onSave();
		} catch (error: any) {
			// Improved error handling
			let errorMessage = "Failed to update user information";

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
						<div className="w-full">
							<DatePicker
								selected={
									formData.date_of_birth
										? new Date(formData.date_of_birth)
										: null
								}
								onChange={handleDateChange}
								className="w-full rounded-lg border border-gray-300 p-2 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white/90"
								wrapperClassName="w-full"
								dateFormat="yyyy-MM-dd"
								placeholderText="Select date"
								showMonthDropdown
								showYearDropdown
								dropdownMode="select"
								yearDropdownItemNumber={100}
								scrollableYearDropdown
								customInput={
									<DatePickerInput
										placeholder="Select date"
										className="w-full"
									/>
								}
							/>
						</div>
					</div>
					<div>
						<Label>Gender</Label>
						<select
							name="gender"
							value={formData.gender}
							onChange={handleChange}
							className="w-full rounded-lg border border-gray-300 p-2 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white/90"
						>
							<option value="">Select gender</option>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
							<option value="Other">Other</option>
						</select>
					</div>
					<div className="lg:col-span-2">
						<Label>Country</Label>
						<select
							name="country"
							value={formData.country}
							onChange={handleChange}
							className="w-full rounded-lg border border-gray-300 p-2 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white/90"
						>
							<option value="">Select country</option>
							{countries.map((country) => (
								<option key={country.code} value={country.name}>
									{country.name}
								</option>
							))}
						</select>
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
