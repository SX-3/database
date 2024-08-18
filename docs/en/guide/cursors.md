# Cursors

Cursors use async iterators

## Iterate over the entire store

```ts{6-9} twoslash
import { Database } from "@sx3/database";

const db = new Database("mydb");
await db.open();

const usersStore = db.transaction("users").store();
for await (const cursor of usersStore) {
	console.log(cursor.value);
}
```

## Iterate over with query

```ts{6-10} twoslash
import { Database } from "@sx3/database";

const db = new Database("mydb");
await db.open();

const usersStore = db.transaction("users").store();
const range = IDBKeyRange.bound(20, 30)
for await (const cursor of usersStore.iterate(range)) {
	console.log(cursor.value);
}
```

## Iterate over index

Iterating over an index is similar to iterating over a store

```ts{6-10} twoslash
import { Database } from "@sx3/database";

const db = new Database("mydb");
await db.open();

const usersStore = db.transaction("users").store();
const index = usersStore.index("age");
for await (const cursor of index) {
	console.log(cursor.value);
}
```
