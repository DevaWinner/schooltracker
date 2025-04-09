import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		svgr({
			svgrOptions: {
				icon: true,
				// This will transform your SVG to a React component
				exportType: "named",
				namedExport: "ReactComponent",
			},
		}),
	],
	server: {
		port: 3001,
		proxy: {
			"/api": {
				target: "https://schooltracker-backend-b2gt.onrender.com",
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
