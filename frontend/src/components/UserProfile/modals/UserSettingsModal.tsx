import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import { timezones } from "../../../utils/timezones";
import { languages } from "../../../utils/languages";
import { UserSettingsModalProps } from "../../../types/user";

export default function UserSettingsModal({
	settings,
	onSave,
	onClose,
}: UserSettingsModalProps) {
	return (
		<div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
			<div className="px-2 pr-14">
				<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
					Edit Settings
				</h4>
				<p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
					Update your preferences and notification settings.
				</p>
			</div>

			<form className="flex flex-col">
				<div className="px-2 overflow-y-auto custom-scrollbar">
					<div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
						<div>
							<Label>Language</Label>
							<select
								className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-600"
								defaultValue={settings.language}
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
								className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-600"
								defaultValue={settings.timezone}
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
										defaultChecked={settings.notification_email}
										className="rounded border-gray-300"
									/>
									<span>Email Notifications</span>
								</label>
								<label className="flex items-center space-x-2">
									<input
										type="checkbox"
										defaultChecked={settings.notification_sms}
										className="rounded border-gray-300"
									/>
									<span>SMS Notifications</span>
								</label>
								<label className="flex items-center space-x-2">
									<input
										type="checkbox"
										defaultChecked={settings.notification_push}
										className="rounded border-gray-300"
									/>
									<span>Push Notifications</span>
								</label>
								<label className="flex items-center space-x-2">
									<input
										type="checkbox"
										defaultChecked={settings.marketing_emails}
										className="rounded border-gray-300"
									/>
									<span>Marketing Emails</span>
								</label>
							</div>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
					<Button size="sm" variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button size="sm" onClick={onSave}>
						Save Changes
					</Button>
				</div>
			</form>
		</div>
	);
}
