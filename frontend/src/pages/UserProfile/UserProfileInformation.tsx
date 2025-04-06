import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import UserInfoCard from "../../components/UserProfile/UserInfoCard";
import UserSettingsCard from "../../components/UserProfile/UserSettingsCard";
import UserProfileCard from "../../components/UserProfile/UserProfileCard";
import PageMeta from "../../components/common/PageMeta";
import { toast } from "react-toastify";

export default function UserProfiles() {
	const {
		profile,
		userProfile,
		userSettings,
		isFirstLogin,
		refreshProfileData,
	} = useContext(AuthContext);
	const [loading] = useState(false);

	// Display a welcome message for first-time users
	useEffect(() => {
		if (isFirstLogin && profile) {
			toast.info(
				`Welcome, ${profile.first_name}! Please complete your profile information.`
			);
		}
	}, [isFirstLogin, profile]);

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
								userProfile={userProfile}
								userInfo={profile}
								refreshData={refreshProfileData}
							/>
							<UserInfoCard
								userInfo={profile}
								refreshData={refreshProfileData}
							/>
							<UserSettingsCard
								userSettings={userSettings}
								refreshData={refreshProfileData}
							/>
						</>
					)}
				</div>
			</div>
		</>
	);
}
