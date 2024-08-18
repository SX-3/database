import { Store } from "./Store";
import { NoStoreProvidedError } from "./utils/errors";
import { createCompositeProxy } from "./utils/proxy";

export interface Transaction extends IDBTransaction {}
export class Transaction {
	protected __trx: IDBTransaction;
	constructor(trx: IDBTransaction) {
		this.__trx = trx;
		return createCompositeProxy(this, trx);
	}

	get stores() {
		return Array.from(this.__trx.objectStoreNames);
	}

	store(name?: string) {
		if (!name && this.stores.length !== 1) {
			throw new NoStoreProvidedError(this.db.name);
		}
		return new Store(this.objectStore(name ?? this.stores[0]));
	}
}
