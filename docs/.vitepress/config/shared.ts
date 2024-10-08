import { defineConfig } from "vitepress";
import { transformerTwoslash } from "@shikijs/vitepress-twoslash";

const shared = defineConfig({
	title: "SX3 Database",
	base: "/database",
	rewrites: {
		"en/:rest*": ":rest*",
	},
	head: [["link", { rel: "icon", href: "/database/favicon.svg" }]],
	themeConfig: {
		socialLinks: [{ icon: "github", link: "https://github.com/SX-3/database" }],
	},
	markdown: {
		codeTransformers: [transformerTwoslash()],
	},
	lastUpdated: true,
});

export { shared };
