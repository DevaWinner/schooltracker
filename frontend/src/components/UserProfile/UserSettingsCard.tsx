import { useModal } from "../../hooks/useModal";
import UserSettingsModal from "./modals/UserSettingsModal";
import { ComponentCardProps } from "../../interfaces/user";
import { timezones } from "../../utils/timezones";
import { getLanguageByCode } from "../../utils/languages";

interface ExtendedCardProps extends ComponentCardProps {
  refreshData?: () => void;
}

export default function UserSettingsCard({
  userSettings,
  refreshData,
}: ExtendedCardProps) {
  const { isOpen, openModal, closeModal } = useModal();

  // Closes modal view and refreshes data
  const handleSave = () => {
    if (refreshData) {
      refreshData();
    }
    closeModal();
  };

  if (!userSettings) return null;

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Settings
            </h4>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Language
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {getLanguageByCode(userSettings.language)?.name ||
                    userSettings.language}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Timezone
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {timezones.find((tz) => tz.value === userSettings.timezone)
                    ?.label || userSettings.timezone}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Notifications
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {[
                    userSettings.notification_email && "Email",
                    userSettings.notification_sms && "SMS",
                    userSettings.notification_push && "Push",
                    userSettings.marketing_emails && "Marketing Emails",
                  ]
                    .filter(Boolean)
                    .join(", ") || "None"}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={openModal}
            className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206Z" />
            </svg>
            Edit
          </button>
        </div>
      </div>
      <UserSettingsModal
        isOpen={isOpen}
        userSettings={userSettings}
        onSave={handleSave}
        onClose={closeModal}
      />
    </>
  );
}
