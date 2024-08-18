import { defineConfig, defaultExclude } from "vitest/config";

export default defineConfig({
	test: {
		watch: false,
		browser: {
			provider: "playwright", // or 'webdriverio'
			enabled: true,
			name: "chromium", // browser name is required,
			headless: true,
			screenshotFailures: false,
		},
	},
});
