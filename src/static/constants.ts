/** Shared methods that need to be wrapped */
export const sharedRequests = [
	"get",
	"getAll",
	"count",
	"getKey",
	"getAllKeys",
	"openCursor",
	"openKeyCursor",
] as const;
export type SharedRequests = (typeof sharedRequests)[number];

/** Store specific methods that need to be wrapped */
export const storeRequests = ["add", "delete", "put", "clear"] as const;
export type StoreRequests = (typeof storeRequests)[number];

/** All requests that need to be wrapped */
export const requests = [...sharedRequests, ...storeRequests] as const;
export type Requests = (typeof requests)[number];
