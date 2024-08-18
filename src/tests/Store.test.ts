import { test, describe, expect } from "vitest";
import { Database } from "../Database";
import { createdPosts, defaultMigrations } from "./data";
import { Store } from "../Store";
import { Index } from "../Index";

describe("", async () => {
	const db = new Database("app", { migrations: defaultMigrations });
	await db.open();

	test("create", async () => {
		const store = db.transaction("posts").store();
		expect(store.name).toBe("posts");
		expect(store).instanceOf(Store);
	});

	describe("iterators", () => {
		test("async iterator", async () => {
			const store = db.transaction("posts").store();
			const values: any[] = [];
			for await (const cursor of store) {
				values.push(cursor.value);
			}
			expect(values).toStrictEqual(createdPosts);
		});

		test("interate all", async () => {
			const store = db.transaction("posts").store();
			const values: any[] = [];
			for await (const cursor of store.iterate()) {
				values.push(cursor.value);
			}
			expect(values).toStrictEqual(createdPosts);
		});

		test("iterate with range", async () => {
			const store = db.transaction("posts").store();
			const values: any[] = [];
			for await (const cursor of store.iterate(IDBKeyRange.bound(20, 30))) {
				values.push(cursor.value);
			}
			expect(values).toStrictEqual(createdPosts.slice(19, 30));
		});
	});

	describe("indexes", () => {
		test("create", () => {
			const index = db.transaction("posts").store().index("title");
			expect(index).instanceOf(Index);
		});

		test("promises", async () => {
			const index = db.transaction("posts").store().index("title");
			expect(index.count()).instanceOf(Promise);
			expect(index.getAll()).instanceOf(Promise);
			expect(index.getAllKeys()).instanceOf(Promise);
			expect(index.get(1)).instanceOf(Promise);
			expect(index.getKey(1)).instanceOf(Promise);
		});

		test("async iterator", async () => {
			const index = db.transaction("posts").store().index("title");
			const values: any[] = [];
			for await (const cursor of index) {
				values.push(cursor.value);
			}
			expect(values.sort((a, b) => a.id - b.id)).toStrictEqual(createdPosts);
		});

		test("iterate all", async () => {
			const index = db.transaction("posts").store().index("title");
			const values: any[] = [];
			for await (const cursor of index.iterate()) {
				values.push(cursor.value);
			}
			expect(values.sort((a, b) => a.id - b.id)).toStrictEqual(createdPosts);
		});

		test("iterate with range", async () => {
			const index = db.transaction("posts").store().index("id");
			const values: any[] = [];
			for await (const cursor of index.iterate(IDBKeyRange.bound(20, 30))) {
				values.push(cursor.value);
			}
			expect(values.sort((a, b) => a.id - b.id)).toStrictEqual(
				createdPosts.slice(19, 30)
			);
		});
	});

	test("wrapped promises", () => {
		const store = db.transaction("posts", "readwrite").store();

		expect(store.getAll()).instanceOf(Promise);
		expect(store.get(1)).instanceOf(Promise);
		expect(store.add({})).instanceOf(Promise);
		expect(store.put({})).instanceOf(Promise);
		expect(store.delete(1)).instanceOf(Promise);
	});
});
