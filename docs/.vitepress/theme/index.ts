import Theme from "vitepress/theme";
import TwoslashFloatingVue from "@shikijs/vitepress-twoslash/client";
import "@shikijs/vitepress-twoslash/style.css";
import type { EnhanceAppContext } from "vitepress";
import { yandexMetrika } from "@hywax/vitepress-yandex-metrika";

export default {
	extends: Theme,
	enhanceApp(ctx: EnhanceAppContext) {
		ctx.app.use(TwoslashFloatingVue);
		yandexMetrika(ctx, { counter: { id: 98190729 } });
	},
};
