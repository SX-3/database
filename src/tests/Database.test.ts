import { Database, MigrationSchema } from "../Database";
import { test, describe, expect } from "vitest";
import { defaultMigrations } from "./data";
import { Transaction } from "../Transaction";
import { BlockedError } from "../utils/errors";

describe("", async () => {
	test("create", async () => {
		const db = new Database("app", { migrations: defaultMigrations });
		expect(await db.open()).instanceOf(Database);
		expect(db.transaction("users")).instanceOf(Transaction);
		await db.delete();
		expect(() => db.transaction("users")).toThrow();
	});

	test("run without migrations", async () => {
		const db = new Database("app");
		expect(await db.open()).instanceOf(Database);
		await db.delete();
	});

	test("blocked error", async () => {
		const first = new Database("app", { migrations: defaultMigrations });
		await first.open();

		const migration: MigrationSchema = {
			4: builder => builder.create("users"),
		};

		const second = new Database("app", {
			migrations: [...defaultMigrations, migration],
		});

		await expect(() => second.open()).rejects.toThrow(BlockedError);
		await first.close();
		expect(() => second.open()).not.toThrow();
	});
});
