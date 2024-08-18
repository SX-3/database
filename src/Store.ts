import { Index } from "./Index";
import {
	createCompositeProxy,
	PromisifiedIDBObject,
	wrapRequests,
} from "./utils/proxy";
import { toPromise } from "./utils/request";

export interface Store
	extends PromisifiedIDBObject<Omit<IDBObjectStore, "index">> {}

export class Store {
	protected __store: IDBObjectStore;
	constructor(store: IDBObjectStore) {
		this.__store = store;
		return wrapRequests(createCompositeProxy(this, store)) as Store;
	}

	index(name: string) {
		return new Index(this.__store.index(name));
	}

	async *iterate(
		...args: Parameters<IDBObjectStore["openCursor"]>
	): AsyncIterableIterator<IDBCursorWithValue> {
		const request = this.__store.openCursor(...args);
		while (true) {
			const cursor: IDBCursorWithValue | null = await toPromise(request);
			if (!cursor) break;
			yield cursor;
			cursor.continue();
		}
	}

	[Symbol.asyncIterator]() {
		const request = this.__store.openCursor();
		return {
			async next(): Promise<IteratorResult<IDBCursorWithValue>> {
				const cursor: IDBCursorWithValue | null = await toPromise(request);
				if (!cursor) return { value: null, done: true };
				cursor.continue();
				return { value: cursor, done: false };
			},
		};
	}
}
