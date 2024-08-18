# Migrations

## Migration scheme

The migration scheme is an object that consists of the key `number` - the database version number, and a function that makes changes:

```ts twoslash
// usersStore.ts
import { MigrationSchema } from "@sx3/database";

const defaultSettings = [
	{ user_id: 1, name: "theme", value: "system" },
	{ user_id: 1, name: "language", value: "en" },
];

const migrations: MigrationSchema = {
	1: builder => builder.create("users").index("id"),
	7: builder =>
		builder.create("user_settings").index("user_id").fill(defaultSettings),
};
```

## Database migrations

DB migrations are an array of schemas:

```ts twoslash
import { MigrationSchema, Database } from "@sx3/database";

const postsSchema: MigrationSchema = {
	1: builder => builder.create("posts").index("id"),
};

const commentsSchema: MigrationSchema = {
	2: builder =>
		builder.create("comments").index("entity", ["entity_name", "entity_id"]),
};

const db = new Database("mydb", { migrations: [postsSchema, commentsSchema] });
```

## Async migrations

Async migrations allow lazy loading while opening a connection to the database:

```ts twoslash
import { MigrationSchema, Database } from "@sx3/database";

const asyncSchema = () =>
	new Promise<MigrationSchema>(resolve => {
		resolve({
			1: builder => builder.create("users").index("id"),
		});
	});

const db = new Database("mydb", { migrations: [asyncSchema] });
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
