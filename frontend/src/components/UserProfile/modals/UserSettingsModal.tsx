import { useState, FormEvent, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/AuthContext";
import { updateUserSettings } from "../../../api/profile";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import { timezones } from "../../../utils/timezones";
import { languages } from "../../../utils/languages";
import { ComponentCardProps } from "../../../types/user";

export default function UserSettingsModal({
	userSettings,
	onSave,
	onClose,
}: ComponentCardProps) {
	const { accessToken, setProfile, profile } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		language: userSettings?.language || "en",
		timezone: userSettings?.timezone || "UTC",
		notification_email: userSettings?.notification_email || false,
		notification_sms: userSettings?.notification_sms || false,
		notification_push: userSettings?.notification_push || false,
		marketing_emails: userSettings?.marketing_emails || false,
	});

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!accessToken || !profile) {
			toast.error("Authentication required");
			return;
		}

		setLoading(true);
		try {
			// Prepare settings data
			const settingsData = {
				language: formData.language,
				timezone: formData.timezone,
				notification_email: formData.notification_email,
				notification_sms: formData.notification_sms,
				notification_push: formData.notification_push,
				marketing_emails: formData.marketing_emails,
			};

			// Send update request directly to settings API
			const updatedSettingsData = await updateUserSettings(
				accessToken,
				settingsData
			);

			// Update the global profile state
			setProfile({
				...profile,
				...updatedSettingsData,
			});

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
		<div className="relative w-full p-4 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
			<div className="px-2 pr-14">
				<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
					Edit Settings
				</h4>
				<p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
					Update your language, timezone, and notification preferences.
				</p>
			</div>
			<form className="flex flex-col" onSubmit={handleSubmit}>
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					<div>
						<Label>Language</Label>
						<select
							className="w-full rounded-lg border border-gray-300 p-2"
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
							className="w-full rounded-lg border border-gray-300 p-2"
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
					<div className="col-span-2">
						<Label>Notifications</Label>
						<div className="space-y-2">
							<label className="flex items-center space-x-2">
								<input
									type="checkbox"
									checked={formData.notification_email}
									onChange={(e) =>
										setFormData({
											...formData,
											notification_email: e.target.checked,
										})
									}
									className="rounded border-gray-300"
								/>
								<span>Email Notifications</span>
							</label>
							<label className="flex items-center space-x-2">
								<input
									type="checkbox"
									checked={formData.notification_sms}
									onChange={(e) =>
										setFormData({
											...formData,
											notification_sms: e.target.checked,
										})
									}
									className="rounded border-gray-300"
								/>
								<span>SMS Notifications</span>
							</label>
							<label className="flex items-center space-x-2">
								<input
									type="checkbox"
									checked={formData.notification_push}
									onChange={(e) =>
										setFormData({
											...formData,
											notification_push: e.target.checked,
										})
									}
									className="rounded border-gray-300"
								/>
								<span>Push Notifications</span>
							</label>
							<label className="flex items-center space-x-2">
								<input
									type="checkbox"
									checked={formData.marketing_emails}
									onChange={(e) =>
										setFormData({
											...formData,
											marketing_emails: e.target.checked,
										})
									}
									className="rounded border-gray-300"
								/>
								<span>Marketing Emails</span>
							</label>
						</div>
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
