import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
const ru = defineConfig({
	description: "A VitePress Site",
	lang: "ru-RU",
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [{ text: "Документация", link: "/guide/introduction" }],

		sidebar: [
			{
				base: "/ru/guide/",
				text: "Для начала",
				items: [
					{ text: "Введение", link: "introduction" },
					{ text: "Быстрый старт", link: "quickstart" },
				],
			},
			{
				base: "/ru/guide/",
				text: "Работа с базой данных",
				items: [
					{ text: "Миграции", link: "migrations" },
					{ text: "Курсоры", link: "cursors" },
					{ text: "Обработка ошибок", link: "errors" },
				],
			},
		],

		editLink: {
			pattern: "https://github.com/SX-3/database/edit/main/docs/:path",
			text: "Редактировать страницу",
		},

		footer: {
			copyright: "© 2024 – настоящее время, SX3",
		},

		outline: { label: "Содержание страницы" },

		docFooter: {
			prev: "Предыдущая страница",
			next: "Следующая страница",
		},

		lastUpdated: {
			text: "Обновлено",
		},

		darkModeSwitchLabel: "Оформление",
		lightModeSwitchTitle: "Переключить на светлую тему",
		darkModeSwitchTitle: "Переключить на тёмную тему",
		sidebarMenuLabel: "Меню",
		returnToTopLabel: "Вернуться к началу",
		langMenuLabel: "Изменить язык",
	},
});

export { ru };
