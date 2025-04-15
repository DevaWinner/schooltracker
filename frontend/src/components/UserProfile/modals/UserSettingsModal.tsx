import { useState, FormEvent, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/AuthContext";
import { updateUserSettings } from "../../../api/profile";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Switch from "../../form/input/Switch";
import { timezones } from "../../../utils/timezones";
import { languages } from "../../../utils/languages";
import { ComponentCardProps } from "../../../interfaces/user";
import { Modal } from "../../ui/modal";

interface UserSettingsModalProps extends ComponentCardProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function UserSettingsModal({
	userSettings,
	onSave,
	onClose,
	isOpen,
}: UserSettingsModalProps) {
	const { refreshProfileData } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		language: userSettings?.language || "en",
		timezone: userSettings?.timezone || "UTC",
		notification_email: userSettings?.notification_email || false,
	});

	const handleNotificationChange = (checked: boolean) => {
		setFormData((prev) => ({
			...prev,
			notification_email: checked,
		}));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		setLoading(true);
		try {
			// Prepare settings data
			const settingsData = {
				language: formData.language,
				timezone: formData.timezone,
				notification_email: formData.notification_email,
			};

			// Send update request directly to settings API without passing token
			await updateUserSettings(settingsData);

			// Refresh global profile state
			await refreshProfileData();

			toast.success("Settings updated successfully");
			if (onSave) onSave();
		} catch (error: any) {
			// Improved error handling
			let errorMessage = "Failed to update settings";

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
		<Modal isOpen={isOpen} onClose={onClose} className="w-[1000px]">
			<div className="flex flex-col h-[85vh]">
				{/* Fixed Header */}
				<div className="flex-shrink-0 border-b border-gray-200 px-8 pt-6 pb-4 dark:border-gray-700">
					<h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
						Edit Settings
					</h4>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Update your language, timezone, and notification preferences.
					</p>
				</div>

				{/* Scrollable Content */}
				<form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
					<div className="flex-1 px-8 py-6 overflow-y-auto">
						<div className="space-y-8">
							<div>
								<Label>Language</Label>
								<select
									className="w-full rounded-lg border border-gray-300 p-2 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white/90"
									value={formData.language}
									onChange={(e) =>
										setFormData({ ...formData, language: e.target.value })
									}
								>
									{languages.map((lang) => (
										<option key={lang.code} value={lang.code}>
											{lang.name}
										</option>
									))}
								</select>
							</div>
							<div>
								<Label>Timezone</Label>
								<select
									className="w-full rounded-lg border border-gray-300 p-2 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white/90"
									value={formData.timezone}
									onChange={(e) =>
										setFormData({ ...formData, timezone: e.target.value })
									}
								>
									{timezones.map((tz) => (
										<option key={tz.value} value={tz.value}>
											{tz.label} ({tz.offset})
										</option>
									))}
								</select>
							</div>
							<div>
								<Label>Notifications</Label>
								<div className="mt-2">
									<Switch
										label="Email Notifications"
										defaultChecked={formData.notification_email}
										onChange={handleNotificationChange}
										color="blue"
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Fixed Footer */}
					<div className="flex-shrink-0 border-t border-gray-200 px-8 py-4 dark:border-gray-700 flex justify-end gap-3">
						<Button size="sm" variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button size="sm" type="submit" disabled={loading}>
							{loading ? "Saving..." : "Save Changes"}
						</Button>
					</div>
				</form>
			</div>
		</Modal>
	);
}
