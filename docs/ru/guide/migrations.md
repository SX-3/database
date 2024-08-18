# Миграции

## Схема миграции

Схема миграции это объект который состоит из ключа `number` - номера версии БД, и функции которая вносит изменения:

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

## Миграции базы данных

Миграции БД это массив схем:

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

## Асинхронные миграции

Асинхронные миграции позволяют делать ленивую загрузку во время открытия соединения с БД:

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

Так же вы можете загружать миграции из других файлов, например ваша структура проекта может выглядеть так:

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

Этот код импортирует схемы миграций из всех сторов ваших модулей:

```ts
import { MigrationSchema, Database } from "@sx3/database";

const schemas = import.meta.glob<MigrationSchema>("./modules/**/store/*.ts", {
	import: "migrations",
});

const db = new Database("mydb", {
	migrations: Object.values(schemas),
});
```
