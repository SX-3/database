[![npm](https://img.shields.io/npm/v/@sx3/database)](https://www.npmjs.com/package/@sx3/database)

# SX3 Database

This is a migration based wrapper around the IndexedDB API. [Documentation](https://sx-3.github.io/database/)

- [Installation](#installation)
- [Usage](#usage)
  - [Readwrite](#readwrite)
  - [Multiple storages](#multiple-storages)
  - [Native APIs are available](#native-apis-are-available)
  - [Delete database](#delete-database)
  - [Cursors](#cursors)
    - [Iterate over the entire store](#iterate-over-the-entire-store)
    - [Iterate over with query](#iterate-over-with-query)
    - [Iterate over index](#iterate-over-index)
  - [Migrations](#database-migrations)
    - [Async migrations](#async-migrations)

## Installation

```bash [npm]
npm install @sx3/database
```

## Usage

### Readwrite

Read:

```ts
import { Database } from "@sx3/database";

const db = await new Database("mydb").open();

const users = await db.transaction("users").store().getAll();
```

Write:

```ts
const db = await new Database("mydb").open();

const userStore = db.transaction("users", "readwrite").store();

const id = await userStore.add({ name: "SX3", age: 99 });
```

Delete:

```ts
const db = await new Database("mydb").open();

const userStore = db.transaction("users", "readwrite").store();

await userStore.delete(1);
```

### Multiple storages

```ts
const db = await new Database("mydb").open();
const trx = db.transaction(["users", "posts"], "readwrite");

const usersStore = trx.store("users");
const postsStore = trx.store("posts");

// Some actions ...

trx.commit(); // not necessarily
```

### Native APIs are available

```ts
const db = new Database("mydb");
await db.open();

db.addEventListener("abort", () => {});
db.deleteObjectStore("users");
db.close();
// etc..

const trx = db.transaction("users");
trx.objectStore("users");
trx.addEventListener("complete", () => {});
// etc..
```

### Delete database

```ts
new Database("mydb").delete();
```

### Cursors

#### Iterate over the entire store

```ts
import { Database } from "@sx3/database";

const db = new Database("mydb");
await db.open();

const usersStore = db.transaction("users").store();
for await (const cursor of usersStore) {
  console.log(cursor.value);
}
```

#### Iterate over with query

```ts
const db = new Database("mydb");
await db.open();

const usersStore = db.transaction("users").store();
const range = IDBKeyRange.bound(20, 30);
for await (const cursor of usersStore.iterate(range)) {
  console.log(cursor.value);
}
```

#### Iterate over index.

Iterating over an index is similar to iterating over a store

```ts
const db = new Database("mydb");
await db.open();

const usersStore = db.transaction("users").store();
const index = usersStore.index("age");
for await (const cursor of index) {
  console.log(cursor.value);
}
```

### Database migrations

DB migrations are an array of schemas:

```ts
import { MigrationSchema, Database } from "@sx3/database";

const postsSchema: MigrationSchema = {
  1: builder => builder.create("posts").index("id"),
};

const commentsSchema: MigrationSchema = {
  2: builder =>
    builder.create("comments").index("entity", ["entity_name", "entity_id"]),
};

// Version calculated from migrations
const db = new Database("mydb", { migrations: [postsSchema, commentsSchema] });
```

#### Async migrations

Async migrations allow lazy loading while opening a connection to the database:

```ts twoslash
import { MigrationSchema, Database } from "@sx3/database";

const asyncSchema = () =>
  new Promise<MigrationSchema>(resolve => {
    resolve({
      1: builder => builder.create("users").index("id"),
    });
  });

const db = await new Database("mydb", { migrations: [asyncSchema] }).open();
```

You can also load migrations from other files, for example your project structure might look like this:

```
modules
├─ moduleA
│  └─ store
│     ├─ posts.ts
│     └─ comments.ts
└─ moduleB
   └─ store
      ├─ cart.ts
      └─ wishlist.ts
```

This code imports migration schemas from all your module stores:

```ts
import { MigrationSchema, Database } from "@sx3/database";

const schemas = import.meta.glob<MigrationSchema>("./modules/**/store/*.ts", {
  import: "migrations",
});

const db = new Database("mydb", {
  migrations: Object.values(schemas),
});
```
