# Что это?

Это обёртка над стандартными API IndexedDB. Вот пример обычного кода с использованием Indexed DB:

```ts twoslash
// Версию придётся проставлять вручную
const request = indexedDB.open("app", 1);

request.onsuccess = () => {
	const db = request.result;
	// Работа с базой
	const usersStore = db.transaction("users").objectStore("users");
	const usersRequest = usersStore.getAll();

	usersRequest.onsuccess = () => console.log(usersRequest.result);
};

request.onupgradeneeded = event => {
	const db = request.result;
	switch (event.oldVersion) {
		case 0: {
			const usersStore = db.createObjectStore("users");
			usersStore.createIndex("id", "id");
			break;
		}
		case 1: {
			const postsStore = db.createObjectStore("posts");
			postsStore.createIndex("id", "id");
			const unusedStore = db.createObjectStore("unused_store");
			break;
		}
		case 2: {
			db.deleteObjectStore("unused_store");
			break;
		}
		// и т.д..
	}
};
```

А так ваш код может выглядеть с обёрткой:

```ts twoslash
import { Database, Migrations } from "@sx3/database";

const migrations: Migrations = [
	{
		1: builder =>
			builder
				.create("users")
				.index("id")
				.create("posts")
				.index("id")
				.create("unused_store"),
		2: builder => builder.drop("unused_store"),
	},
];

// Версия рассчитывается исходя из миграций
const db = new Database("mydb", { migrations });
await db.open();

const usersStore = db.transaction("users").store();
console.log(await usersStore.getAll());
```

## Нативные API доступны

```ts twoslash
import { Database } from "@sx3/database";
const db = new Database("mydb");
await db.open();

db.addEventListener("abort", () => {});
db.deleteObjectStore("users");
db.close();
// и т.д..

const trx = db.transaction("users");
trx.objectStore("users");
trx.addEventListener("complete", () => {});
// и т.д..
```
