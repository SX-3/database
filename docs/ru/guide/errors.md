# Ошибки

В рамках этой библиотеки введены 3 новые ошибки:

- NotOpenedError - База данных не открыта
- BlockedError - База данных заблокирована
- NoStoreProvidedError - Не указано хранилище для транзакции

```ts twoslash
import {
	Database,
	NotOpenedError,
	BlockedError,
	NoStoreProvidedError,
} from "@sx3/database";

const db = new Database("mydb");

try {
	await db.open();
} catch (error: unknown) {
	if (error instanceof BlockedError) {
		// Обработать блокировку
	}
}
```
