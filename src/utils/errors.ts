/** Throws when database is not opened */
export class NotOpenedError extends Error {
	name = "NotOpenedError";
	constructor(dbName: string) {
		super(`[DATABASE: ${dbName}]: "Database not opened"`);
	}
}

/** Throws when store for transaction is not provided */
export class NoStoreProvidedError extends Error {
	name = "NoStoreProvidedError";
	constructor(dbName: string) {
		super(`[DATABASE: ${dbName}]: "No store provided"`);
	}
}

/** Throws when database is blocked */
export class BlockedError extends Error {
	name = "BlockedError";
	constructor(dbName: string) {
		super(`[DATABASE: ${dbName}]: "Database blocked"`);
	}
}
