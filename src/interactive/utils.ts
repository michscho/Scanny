function containsOnlyWhitespace(str: string) {
	return /^\s*$/.test(str);
}

function filterDuplicates<Type>(arr: Array<Type>) {
	return [...new Set(arr)];
}

