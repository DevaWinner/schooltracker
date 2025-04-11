/**
 * This file contains constants for all of the routes in the app
 */

export const ROUTES = {
	App: {
		main: "/",
	},
	Applications: {
		tracker: "/applications/tracker",
		detail: "/applications/detail/:id",
		documents: "/applications/detail/:id/documents",
	},
	Documents: {
		upload: "/documents/upload",
		library: "/documents/library",
	},
	Directory: {
		search: "/directory/search",
		institution: "/directory/institution/:id",
	},
	Profile: {
		information: "/profile/information",
		background: "/profile/background",
	},
	Auth: {
		signin: "/signin",
		signup: "/signup",
	},
	Other: {
		calendar: "/calendar",
		recommendations: "/recommendations",
	},
};
