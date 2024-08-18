import { test, describe, expect } from "vitest";
import { Database } from "../Database";
import { defaultMigrations } from "./data";
import { Store } from "../Store";
import { NoStoreProvidedError } from "../utils/errors";

describe("store", async () => {
	const db = new Database("app", { migrations: defaultMigrations });
	await db.open();

	test("stores getter", () => {
		const trx = db.transaction(["users", "posts"]);
		expect(trx.stores).toStrictEqual(["posts", "users"]);
	});

	test("store method", () => {
		const trx = db.transaction("users");
		expect(trx.store()).instanceOf(Store);
		const trx2 = db.transaction(["users", "posts"]);
		expect(() => trx2.store()).toThrow(NoStoreProvidedError);
	});
});
