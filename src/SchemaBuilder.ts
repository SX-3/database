import { Store } from "./Store";

export class SchemaBuilder {
	readonly #db: IDBDatabase;
	#store!: IDBObjectStore;

	constructor(db: IDBDatabase) {
		this.#db = db;
	}

	create(
		name: string,
		options: IDBObjectStoreParameters = { keyPath: "id", autoIncrement: true }
	) {
		this.#store = this.#db.createObjectStore(name, options);
		return this;
	}

	index(
		name: string,
		keyPath: string | string[] = name,
		options?: IDBIndexParameters
	) {
		this.#store.createIndex(name, keyPath, options);
		return this;
	}

	drop(name: string) {
		this.#db.deleteObjectStore(name);
		return this;
	}

	store(callback: (store: Store) => any) {
		this.#store.transaction.addEventListener("complete", () => {
			const trx = this.#db.transaction(this.#store.name, "readwrite");
			callback(new Store(trx.objectStore(this.#store.name)));
			trx.commit();
		});
		return this;
	}

	fill(data: any[]) {
		this.store(store => data.forEach(d => store.add(d)));
		return this;
	}
}
