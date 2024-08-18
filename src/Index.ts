import {
	createCompositeProxy,
	PromisifiedIDBObject,
	wrapRequests,
} from "./utils/proxy";
import { toPromise } from "./utils/request";

export interface Index extends PromisifiedIDBObject<IDBIndex> {}
export class Index {
	protected __index: IDBIndex;
	constructor(index: IDBIndex) {
		this.__index = index;
		return wrapRequests(createCompositeProxy(this, index)) as Index;
	}

	async *iterate(
		...args: Parameters<IDBObjectStore["openCursor"]>
	): AsyncIterableIterator<IDBCursorWithValue> {
		const request = this.__index.openCursor(...args);
		while (true) {
			const cursor: IDBCursorWithValue | null = await toPromise(request);
			if (!cursor) break;
			yield cursor;
			cursor.continue();
		}
	}

	[Symbol.asyncIterator]() {
		const request = this.__index.openCursor();
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
