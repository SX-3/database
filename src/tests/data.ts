import { Migrations } from "../Database";

export function makePost(id: number) {
	return {
		title: `Post ${id}`,
		body: `<h1>Post ${id}</h1>`,
	};
}

export const posts = Array.from({ length: 100 }, (_, i) => makePost(i + 1));

export const defaultMigrations: Migrations = [
	{
		1: builder => {
			builder
				.create("posts")
				.index("title")
				.index("id_title", ["id", "title"])
				.index("id")
				.fill(posts);
		},
	},
	{
		2: builder => builder.create("users").create("drop"),
	},
	{ 3: builder => builder.drop("drop") },
];

export const createdPosts = posts.map((p, i) => ({ id: i + 1, ...p }));
