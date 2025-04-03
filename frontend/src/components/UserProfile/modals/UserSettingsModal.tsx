import { useState, FormEvent, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/AuthContext";
import { updatePartialProfile } from "../../../api/profile";
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
	const { accessToken } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		id: userSettings?.id || 0,
		user_id: userSettings?.user_id || 0,
		language: userSettings?.language || "en",
		timezone: userSettings?.timezone || "UTC",
		notification_email: userSettings?.notification_email || false,
		notification_sms: userSettings?.notification_sms || false,
		notification_push: userSettings?.notification_push || false,
		marketing_emails: userSettings?.marketing_emails || false,
	});

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!accessToken) return;
		setLoading(true);
		try {
			await updatePartialProfile(accessToken, { settings: formData });
			toast.success("Settings updated successfully");
			if (onSave) onSave(); // Add null check here
		} catch (error) {
			toast.error("Failed to update settings");
			console.error("Update error:", error);
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
									checked={formData.notification_sms || false}
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
									checked={formData.notification_push || false}
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
									checked={formData.marketing_emails || false}
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
