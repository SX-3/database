# Быстрый старт

## Установка

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

## Использование

```ts twoslash
import { Database, Migrations } from "@sx3/database";

// Создаём миграции, массив схем
const migrations: Migrations = [
	{
		// Версия миграции, в каждой схеме может быть любое количество версий
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

// Создаём базу
const db = new Database("mydb", { migrations });

// Открываем соединение
await db.open();

// Создаём транзакцию и берём хранилище
const usersStore = db.transaction("users", "readwrite").store();

// Добавляем пользователя
const userId = await usersStore.add({
	name: "SX3",
	skills: ["JavaScript", "TypeScript"],
});

// Получаем всех пользователей
const users = await usersStore.getAll();

// Удаляем пользователя
await usersStore.delete(userId);
```
