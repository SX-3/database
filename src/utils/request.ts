/** Wrap IDBRequest to Promise */
export function toPromise<T>(request: IDBRequest<T>): Promise<T> {
	return new Promise((resolve, reject) => {
		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);
	});
}

/** Wrap IDBRequest method to Promise */
export const wrapWithPromise = <T extends Array<any>, U>(
	fn: (...args: T) => IDBRequest<U>
) => {
	return (...args: T): Promise<U> => toPromise(fn(...args));
};
