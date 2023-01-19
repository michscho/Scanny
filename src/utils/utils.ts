import { Action } from "../actions/data/types-data";

export function containsOnlyWhitespace(str: string) {
	return /^\s*$/.test(str);
}

export function filterDuplicates<Type>(arr: Array<Type>) {
	return [...new Set(arr)];
}

export function filterSearchAndGoItems(actions: Action[]) {
	return actions.filter(
		(x: Action) => x.action !== "search" && x.action !== "goto"
	);
}

export function filterSearchItems(actions: Action[]) {
	return actions.filter((x: Action) => x.action !== "search");
}

export function filterGoItems(actions: Action[]) {
	return actions.filter((x: Action) => x.action !== "goto");
}
