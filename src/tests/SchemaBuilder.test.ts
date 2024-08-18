import { Database } from "../Database";
import { test, describe, expect } from "vitest";
import { createdPosts, defaultMigrations } from "./data";

describe("", async () => {
	const db = new Database("app", { migrations: defaultMigrations });
	await db.open();

	test("create", async () => {
		const stores = Array.from(db.objectStoreNames);
		expect(stores).toStrictEqual(["posts", "users"]);
		const posts = await db.transaction("posts").store("posts").getAll();
		expect(posts.length).toBe(createdPosts.length);
		expect(posts).toStrictEqual(createdPosts);
	});

	test("store without name", () => {
		const trx = db.transaction("posts");
		const store = trx.store();
		expect(store.name).toBe("posts");

		const trx2 = db.transaction(["posts", "users"]);
		expect(trx2.store).toThrow();
	});

	test("indexes", () => {
		const trx = db.transaction("posts");
		const store = trx.store();
		expect(Array.from(store.indexNames)).toStrictEqual([
			"id",
			"id_title",
			"title",
		]);
	});
});
