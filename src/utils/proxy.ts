import { Requests, requests } from "../static/constants";
import { wrapWithPromise } from "./request";

export type PromisifiedIDBObject<T extends Record<string, any>> = {
	[K in keyof T]: T[K] extends (...args: any[]) => IDBRequest
		? (
				...args: Parameters<T[K]>
		  ) => Promise<ReturnType<T[K]> extends IDBRequest<infer R> ? R : never>
		: T[K];
};

/** Redirects the call to another object if the property is not defined  */
export function createCompositeProxy<F extends Object, S extends Object>(
	first: F,
	second: S | (() => S | void)
) {
	return new Proxy(first, {
		get(target, key, receiver) {
			if (Reflect.has(target, key)) return Reflect.get(target, key, receiver);
			const source = typeof second === "function" ? second() : second;
			if (source && Reflect.has(source, key)) {
				let value = Reflect.get(source, key, source);
				if (typeof value === "function") return value.bind(source);
				return value;
			}
		},
		set(target, key, value, receiver) {
			if (Reflect.has(target, key)) {
				return Reflect.set(target, key, value, receiver);
			}
			const source = typeof second === "function" ? second() : second;
			if (source && Reflect.has(source, key)) {
				return Reflect.set(source, key, value, receiver);
			}
			return false;
		},
	});
}

/** Wrap all IDBRequests in object to Promise */
export function wrapRequests<T extends Record<string, any>>(
	target: T
): PromisifiedIDBObject<T> {
	return new Proxy(target, {
		get(target, key, receiver) {
			let value = Reflect.get(target, key, receiver);

			if (typeof value === "function" && requests.includes(key as Requests)) {
				//@ts-ignore
				value = value.bind(target);
				return wrapWithPromise(value);
			}

			return value;
		},
	});
}
