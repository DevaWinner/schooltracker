import { UserInfo, UserProfile, UserSettings } from "./user";

// UserInfoCard interfaces
export interface UserInfoCardProps {
	userInfo: UserInfo | null;
}

// UserProfileCard interfaces
export interface UserProfileCardProps {
	userProfile: UserProfile | null;
}

// UserSettingsCard interfaces
export interface UserSettingsCardProps {
	userSettings: UserSettings | null;
}

// Modal interfaces
export interface UserInfoModalProps {
	userInfo: UserInfo;
	onSave: () => void;
	onClose: () => void;
}

export interface UserProfileModalProps {
	userProfile: UserProfile;
	onSave: () => void;
	onClose: () => void;
}

export interface UserSettingsModalProps {
	userSettings: UserSettings;
	onSave: () => void;
	onClose: () => void;
}
