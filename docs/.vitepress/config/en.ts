import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
const en = defineConfig({
	lang: "en-US",
	description: "A VitePress Site",

	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [{ text: "Documentation", link: "/guide/introduction" }],

		sidebar: [
			{
				text: "To begin",
				items: [
					{ text: "Introduction", link: "/guide/introduction" },
					{ text: "Quick start", link: "/guide/quickstart" },
				],
			},
			{
				text: "Working with the database",
				items: [
					{ text: "Migrations", link: "/guide/migrations" },
					{ text: "Cursors", link: "/guide/cursors" },
					{ text: "Error handling", link: "/guide/errors" },
				],
			},
		],

		editLink: {
			pattern: "https://github.com/SX-3/database/edit/main/docs/:path",
		},

		footer: {
			copyright: "© 2024 – present, SX3",
		},
	},
});

export { en };
