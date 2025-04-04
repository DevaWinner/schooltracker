import { UserData } from "../interfaces/auth";
import { UserInfo } from "../types/user";

/**
 * Converts UserData from auth API response to UserInfo for profile context
 */
export function adaptUserDataToUserInfo(userData: UserData): UserInfo {
	// Create a new object with UserInfo shape
	const userInfo: UserInfo = {
		id: userData.id,
		first_name: userData.first_name,
		last_name: userData.last_name,
		email: userData.email,
		country: userData.country,
		// Safely handle gender conversion
		gender: userData.gender as "Male" | "Female" | "Other" | undefined,
		// Copy other properties
		phone: userData.phone,
		date_of_birth: userData.date_of_birth,
		// Default values for other properties not in UserData
	};

	return userInfo;
}
