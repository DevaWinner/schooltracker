import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getProfile } from "../../api/profile";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import UserInfoCard from "../../components/UserProfile/UserInfoCard";
import UserSettingsCard from "../../components/UserProfile/UserSettingsCard";
import UserProfileCard from "../../components/UserProfile/UserProfileCard";
import PageMeta from "../../components/common/PageMeta";
import { toast } from "react-toastify";
import { UserProfile, UserSettings } from "../../types/user";

export default function UserProfiles() {
	const { profile, accessToken, setProfile, isFirstLogin } =
		useContext(AuthContext);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProfile = async () => {
			if (accessToken) {
				try {
					const data = await getProfile(accessToken);
					setProfile(data);
				} catch (error) {
					console.error("Error fetching profile:", error);
					toast.error("Failed to load profile. Please try again.");
				} finally {
					setLoading(false);
				}
			} else {
				setLoading(false);
			}
		};

		if (!profile && accessToken) {
			fetchProfile();
		} else {
			setLoading(false);
		}
	}, [accessToken, profile, setProfile]);

	// Display a welcome message for first-time users
	useEffect(() => {
		if (isFirstLogin && profile) {
			toast.info(
				`Welcome, ${profile.first_name}! Please complete your profile information.`
			);
		}
	}, [isFirstLogin, profile]);

	// Extract profile data from combined API response
	const userProfile: UserProfile | null = profile
		? {
				id: profile.id,
				user_id: profile.id,
				bio: profile.bio || "",
				profile_picture: profile.profile_picture || "",
				facebook: profile.facebook || "",
				twitter: profile.twitter || "",
				linkedin: profile.linkedin || "",
				instagram: profile.instagram || "",
		  }
		: null;

	// Extract settings from profile
	const userSettings: UserSettings | null = profile
		? {
				id: profile.id,
				user_id: profile.id,
				language: profile.language || "en",
				timezone: profile.timezone || "UTC",
				notification_email: profile.notification_email || false,
				notification_sms: profile.notification_sms || false,
				notification_push: profile.notification_push || false,
				marketing_emails: profile.marketing_emails || false,
		  }
		: null;

	return (
		<>
			<PageMeta
				title="Profile | School Tracker"
				description="User Profile page for School Tracker application. Manage your profile information, settings, and preferences."
			/>
			<PageBreadcrumb pageTitle="Profile Information" />
			<div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
				<div className="space-y-6">
					{loading ? (
						<div className="flex items-center justify-center min-h-[400px]">
							<div className="w-10 h-10 border-4 border-gray-200 rounded-full border-t-blue-600 animate-spin"></div>
						</div>
					) : (
						<>
							<UserProfileCard userProfile={userProfile} userInfo={profile} />
							<UserInfoCard userInfo={profile} />
							<UserSettingsCard userSettings={userSettings} />
						</>
					)}
				</div>
			</div>
		</>
	);
}
