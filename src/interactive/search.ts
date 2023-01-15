import { createAction } from "../actions/action-utils";
import { Action } from "../actions/actions-data";

export function findClickableElements(query: string): Action[] {
	const aActions = findClickableLinks(query);
	const buttonActions = findClickableButtons(query);
	return [...aActions, ...buttonActions];
}

function findClickableLinks(query: string): Action[] {
	var aElements = [];
	$("a")
		.filter(":contains(" + query + ")")
		.each(function () {
			if (containsOnlyWhitespace($(this).text())) {
				return;
			}
			aElements.push($(this).text());
		});
	const aActions: Action[] = filterDuplicates(aElements).map((el) => {
		return createAction(el, "Clickable link", "🔗");
	});
	return aActions;
}

function findClickableButtons(query: string): Action[] {
	var buttonElements = [];
	$("button")
		.filter(":contains(" + query + ")")
		.each(function () {
			if (containsOnlyWhitespace($(this).text())) {
				return;
			}
			buttonElements.push($(this).text());
		});
	const buttonActions: Action[] = filterDuplicates(buttonElements).map((el) => {
		return createAction(el, "Clickable button", "🔘");
	});
	return buttonActions;
}
