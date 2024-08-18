export function printVersion(name: string, version: number) {
	console.info(
		`%c[DATABASE: ${name}]: Version ${version}`,
		"font-weight: bold; padding: 7px; background-color: rgba(0,90,255, 0.2); border-radius: 7px;"
	);
}
