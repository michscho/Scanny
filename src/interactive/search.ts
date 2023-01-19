import { createInteractiveAction } from "../actions/create-action";
import $ from "jQuery";
import { containsOnlyWhitespace, filterDuplicates } from "../utils/utils";
import { Action } from "../actions/data/types-data";

export function findClickableElements(query: string): Action[] {
	const aActions = findClickableLinks(query);
	const buttonActions = findClickableButtons(query);
	const placeholderActions = findPlaceholderElements(query);
	return [...aActions, ...buttonActions, ...placeholderActions];
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
		return createInteractiveAction(el, "Clickable link", "🔗");
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
		return createInteractiveAction(el, "Clickable button", "🔘");
	});
	return buttonActions;
}

function findPlaceholderElements(query: string): Action[] {
	var placeholderElements = [];
	$(`[placeholder]:contains('${query}')`).each(function () {
		if (containsOnlyWhitespace($(this).attr("placeholder"))) {
			return;
		}
		placeholderElements.push($(this).attr("placeholder"));
	});
	const placeholderActions: Action[] = filterDuplicates(
		placeholderElements
	).map((el) => {
		return createInteractiveAction(el, "Placeholder", "🔖");
	});
	return placeholderActions;
}
