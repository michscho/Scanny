export function containsOnlyWhitespace(str: string) {
	return /^\s*$/.test(str);
}

export function filterDuplicates<Type>(arr: Array<Type>) {
	return [...new Set(arr)];
}