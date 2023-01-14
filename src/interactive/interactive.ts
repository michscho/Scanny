import $ from "jquery";
import { createAction } from "../actions/action-utils";
import { Action } from "../actions/actions-data";

export function findClickableElementsText(query: string): Action[] {
	var aElements = [];
	var buttonElements = [];
	$("a")
		.filter(":contains(" + query + ")")
		.each(function () {
			if (containsOnlyWhitespace($(this).text())) {
				return;
			}
			aElements.push($(this).text());
		});
	$("button")
		.filter(":contains(" + query + ")")
		.each(function () {
			if (containsOnlyWhitespace($(this).text())) {
				return;
			}
			buttonElements.push($(this).text());
		});
	const aActions: Action[] = filterDuplicates(aElements).map((el) => {
		return createAction(el, "Clickable link", "🔗");
	});
	const buttonActions: Action[] = filterDuplicates(buttonElements).map((el) => {
		return createAction(el, "Clickable button", "🔘");
	});
	return [...aActions, ...buttonActions];
}

export function clickElement(query: string) {
	var $element = $("a")
		.filter(":contains(" + query + ")")
		.first();
	var clickEvent = new MouseEvent("click", {
		view: window,
		bubbles: true,
		cancelable: true,
	});
	$element[0].dispatchEvent(clickEvent);
}

function containsOnlyWhitespace(str: string) {
	return /^\s*$/.test(str);
}

function filterDuplicates<Type>(arr: Array<Type>) {
	return [...new Set(arr)];
}
