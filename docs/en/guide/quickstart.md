# Quick start

## Installation

::: code-group

```bash [pnpm]
pnpm add -D @sx3/database
```

```bash [yarn]
yarn add -D @sx3/database
```

```bash [npm]
npm install -D @sx3/database
```

:::

## Usage

```ts twoslash
import { Database, Migrations } from "@sx3/database";

// Create migrations, array of schemes
const migrations: Migrations = [
	{
		// Migration version, each scheme can have any number of versions
		1: builder => {
			builder
				.create("users")
				.index("id")
				.index("id_name", ["id", "name"], { unique: true });

			builder
				.create("posts")
				.index("id")
				.fill([{ title: "My firs post", body: "Hello, World!" }]);
		},
	},
];

// Create a base
const db = new Database("mydb", { migrations });

// Opening a connection
await db.open();

// Create a transaction and take the store
const usersStore = db.transaction("users", "readwrite").store();

// Add a user
const userId = await usersStore.add({
	name: "SX3",
	skills: ["JavaScript", "TypeScript"],
});

// Get all users
const users = await usersStore.getAll();

// Delete user
await usersStore.delete(userId);
```
