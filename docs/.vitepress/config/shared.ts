import { defineConfig } from "vitepress";
import { transformerTwoslash } from "@shikijs/vitepress-twoslash";

const shared = defineConfig({
	title: "SX3 Database",
	rewrites: {
		"en/:rest*": ":rest*",
	},
	themeConfig: {
		socialLinks: [{ icon: "github", link: "https://github.com/SX-3/database" }],
	},
	markdown: {
		codeTransformers: [transformerTwoslash()],
	},
	lastUpdated: true,
});

export { shared };
