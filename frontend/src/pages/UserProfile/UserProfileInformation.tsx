import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getProfile, getUserProfile, getUserSettings } from "../../api/profile";
import { getAccessToken } from "../../api/auth";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import UserInfoCard from "../../components/UserProfile/UserInfoCard";
import UserSettingsCard from "../../components/UserProfile/UserSettingsCard";
import UserProfileCard from "../../components/UserProfile/UserProfileCard";
import PageMeta from "../../components/common/PageMeta";
import { toast } from "react-toastify";
import { UserInfo, UserProfile, UserSettings } from "../../types/user";

export default function UserProfiles() {
	const { profile, accessToken, setProfile, isFirstLogin } =
		useContext(AuthContext);
	const [loading, setLoading] = useState(true);
	const [userProfileData, setUserProfileData] = useState<UserProfile | null>(
		null
	);
	const [userSettingsData, setUserSettingsData] = useState<UserSettings | null>(
		null
	);
	const [userInfoData, setUserInfoData] = useState<UserInfo | null>(null);
	// Add a refresh trigger state
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	// Function to force refresh of profile data
	const refreshProfileData = useCallback(() => {
		setRefreshTrigger((prev) => prev + 1);
	}, []);

	// Main data fetching logic
	const fetchAllUserData = useCallback(async () => {
		// Get token from storage if not in context
		const token = accessToken || getAccessToken();

		if (!token) {
			setLoading(false);
			return;
		}

		setLoading(true);
		try {
			// Fetch all data in parallel
			const [basicInfoResponse, profileResponse, settingsResponse] =
				await Promise.all([
					getProfile(token),
					getUserProfile(token).catch(() => null),
					getUserSettings(token).catch(() => null),
				]);

			// Update state with fetched data
			setUserInfoData(basicInfoResponse);
			if (profileResponse) {
				setUserProfileData(profileResponse);
			} else {
				// Create default profile from basic info
				setUserProfileData({
					id: basicInfoResponse.id,
					user_id: basicInfoResponse.id,
					bio: basicInfoResponse.bio || "",
					profile_picture: basicInfoResponse.profile_picture || "",
					facebook: basicInfoResponse.facebook || "",
					twitter: basicInfoResponse.twitter || "",
					linkedin: basicInfoResponse.linkedin || "",
					instagram: basicInfoResponse.instagram || "",
				});
			}

			if (settingsResponse) {
				setUserSettingsData(settingsResponse);
			} else {
				// Create default settings from basic info
				setUserSettingsData({
					id: basicInfoResponse.id,
					user_id: basicInfoResponse.id,
					language: basicInfoResponse.language || "en",
					timezone: basicInfoResponse.timezone || "UTC",
					notification_email: basicInfoResponse.notification_email || false,
					notification_sms: basicInfoResponse.notification_sms || false,
					notification_push: basicInfoResponse.notification_push || false,
					marketing_emails: basicInfoResponse.marketing_emails || false,
				});
			}

			// Update global profile
			setProfile(basicInfoResponse);
		} catch (error: any) {
			// Error handling
			let errorMessage = "Failed to load profile. Please try again.";

			if (error.response?.data) {
				if (typeof error.response.data === "string") {
					errorMessage = error.response.data;
				} else if (error.response.data.message) {
					errorMessage = error.response.data.message;
				} else if (error.response.data.detail) {
					errorMessage = error.response.data.detail;
				} else if (error.response.data.error) {
					errorMessage = error.response.data.error;
				}
			} else if (error.message) {
				errorMessage = error.message;
			}

			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	}, [accessToken, setProfile]);

	// Fetch data on mount and when refreshTrigger changes
	useEffect(() => {
		fetchAllUserData();
	}, [fetchAllUserData, refreshTrigger]); // Add refreshTrigger as dependency

	// Display a welcome message for first-time users
	useEffect(() => {
		if (isFirstLogin && userInfoData) {
			toast.info(
				`Welcome, ${userInfoData.first_name}! Please complete your profile information.`
			);
		}
	}, [isFirstLogin, userInfoData]);

	// Prepare data for rendering, using local state instead of extracting from profile
	const displayProfile = userInfoData || profile;
	const displayProfileData =
		userProfileData ||
		(profile
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
			: null);
	const displaySettingsData =
		userSettingsData ||
		(profile
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
			: null);

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
							<UserProfileCard
								userProfile={displayProfileData}
								userInfo={displayProfile}
								refreshData={refreshProfileData}
							/>
							<UserInfoCard
								userInfo={displayProfile}
								refreshData={refreshProfileData}
							/>
							<UserSettingsCard
								userSettings={displaySettingsData}
								refreshData={refreshProfileData}
							/>
						</>
					)}
				</div>
			</div>
		</>
	);
}
