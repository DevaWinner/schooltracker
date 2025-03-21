interface UserInfo {
	name: string;
	email: string;
	imageUrl: string;
}

export const mockFetchUserInfo = (): Promise<UserInfo> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				name: "Test User",
				email: "testuser@example.com",
				imageUrl:
					"https://ui-avatars.com/api/?name=Test+User&background=random",
			});
		}, 500);
	});
};
