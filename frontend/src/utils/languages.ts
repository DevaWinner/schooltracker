export interface language {
	code: string;
	name: string;
}

export const languages: language[] = [
	{ code: "en", name: "English" },
	{ code: "es", name: "Spanish" },
	{ code: "fr", name: "French" },
];

export const getLanguageByCode = (code: string): language | undefined => {
	return languages.find((lang) => lang.code === code);
};
