# Ошибки

Within this library, 3 new errors have been introduced:

- NotOpenedError - Database is not open
- BlockedError - Database is locked
- NoStoreProvidedError - No store provided for transaction

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
		// Do something
	}
}
```
