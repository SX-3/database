import { printVersion } from "./utils/log";
import { NotOpenedError, BlockedError } from "./utils/errors";
import { Transaction } from "./Transaction";
import { toPromise } from "./utils/request";
import { createCompositeProxy } from "./utils/proxy";
import { SchemaBuilder } from "./SchemaBuilder";

export type Migration = (builder: SchemaBuilder) => unknown;
export type MigrationSchema = Record<number, Migration>;
export type Migrations = Array<
	(() => Promise<MigrationSchema>) | MigrationSchema
>;
export interface DatabaseOptions {
	migrations?: Migrations;
	printVersion?: boolean;
}

export interface Database extends IDBDatabase {}
export class Database {
	readonly name: string;
	protected readonly __options?: DatabaseOptions;
	protected __database?: IDBDatabase;
	protected __migrations?: Record<number, Migration[]>;
	constructor(name: string, options?: DatabaseOptions) {
		this.name = name;
		this.__options = options;
		return createCompositeProxy(this, () => this.__database);
	}

	get version() {
		if (!this.__migrations) throw new NotOpenedError(this.name);
		return Math.max(...Object.keys(this.__migrations).map(Number), 1);
	}

	async open() {
		this.__migrations = await this.__collectMigrations();
		this.__database = await this.__connect();
		if (this.__options?.printVersion) printVersion(this.name, this.version);
		return this;
	}

	async delete() {
		this.close();
		return toPromise(indexedDB.deleteDatabase(this.name));
	}

	transaction(...args: Parameters<IDBDatabase["transaction"]>) {
		if (!this.__database) throw new NotOpenedError(this.name);
		return new Transaction(this.__database.transaction(...args));
	}

	protected async __collectMigrations() {
		if (!this.__options?.migrations) return {};
		// Load migrations
		const migrations = await Promise.all(
			this.__options.migrations.map(migration =>
				typeof migration === "function" ? migration() : migration
			)
		);

		// Combine migrations
		return migrations.reduce((all, migration) => {
			for (const version in migration) {
				if (!all[version]) all[version] = [];
				all[version].push(migration[version]);
			}
			return all;
		}, {} as Record<number, Migration[]>);
	}

	protected __connect(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.name, this.version);
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
			request.onblocked = () => reject(new BlockedError(this.name));
			request.onupgradeneeded = event => {
				if (!this.__migrations) throw new NotOpenedError(this.name);
				Object.keys(this.__migrations)
					.map(Number)
					.filter(version => version > event.oldVersion)
					.sort((a, b) => a - b)
					.forEach(version =>
						this.__migrations![version].forEach(migration =>
							migration(new SchemaBuilder(request.result))
						)
					);
			};
		});
	}
}
