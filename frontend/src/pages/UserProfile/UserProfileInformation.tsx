import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getProfile } from "../../api/profile";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import UserMetaCard from "../../components/UserProfile/UserMetaCard";
import UserInfoCard from "../../components/UserProfile/UserInfoCard";
import UserAddressCard from "../../components/UserProfile/UserAddressCard";
import UserSettingsCard from "../../components/UserProfile/UserSettingsCard";
import PageMeta from "../../components/common/PageMeta";

export default function UserProfiles() {
	const { profile, accessToken, setProfile } = useContext(AuthContext);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProfile = async () => {
			if (accessToken) {
				try {
					const data = await getProfile(accessToken);
					setProfile(data);
				} catch (error) {
					console.error("Error fetching profile:", error);
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

	return (
		<>
			<PageMeta
				title="Profile | School Tracker"
				description="User Profile page for School Tracker application. Manage your profile information, settings, and preferences."
			/>
			<PageBreadcrumb pageTitle="Profile Information" />
			<div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
				<h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
					Profile Information
				</h3>
				<div className="space-y-6">
					{loading ? (
						<div className="flex items-center justify-center min-h-[400px]">
							<div className="w-10 h-10 border-4 border-gray-200 rounded-full border-t-blue-600 animate-spin"></div>
						</div>
					) : (
						<>
							<UserMetaCard userInfo={profile} />
							<UserInfoCard userInfo={profile} />
							<UserAddressCard userInfo={profile} />
							<UserSettingsCard userInfo={profile} />
						</>
					)}
				</div>
			</div>
		</>
	);
}
