import { Action } from "../actions/actions-data";

export function containsOnlyWhitespace(str: string) {
	return /^\s*$/.test(str);
}

export function filterDuplicates<Type>(arr: Array<Type>) {
	return [...new Set(arr)];
}

export function hideSearchAndGoToActions(actions: Action[]) {
	const searchIndex = actions.findIndex((x: Action) => x.action === "search");
	const gotoIndex = actions.findIndex((x: Action) => x.action === "goto");
	const searchElement: HTMLElement = document.querySelector(
		`.omni-item[data-index='${searchIndex}']`
	);
	const gotoElement: HTMLElement = document.querySelector(
		`.omni-item[data-index='${gotoIndex}']`
	);
	if (searchElement) {
		searchElement.style.display = "none";
	}
	if (gotoElement) {
		gotoElement.style.display = "none";
	}
}
