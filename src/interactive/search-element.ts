import { createInteractiveAction } from "../actions/create-action";
import { filterDuplicates } from "../utils/utils";
import { Action } from "../actions/data/types-data";
import $ from "jquery";
import { Scanny, ElementsActionRecord } from "./elements-actions";

type TextExtractor = (el: JQueryElement) => string | undefined;
type JQueryElement = JQuery<HTMLElement>;

export function findClickableElements(query: string): Action[] {
	const aActions = findElements(query, ElementsActionRecord.link);
	const buttonActions = findElements(query, ElementsActionRecord.button);
	const placeholderActions = findElements(
		query,
		ElementsActionRecord.placeholder,
		(el: JQueryElement) => el.attr("placeholder")
	);
	const spanActions = findElements(query, ElementsActionRecord.span);
	return [...aActions, ...buttonActions, ...placeholderActions, ...spanActions];
}

function getHTMLElementText(
	htmlElement: JQueryElement,
	textExtractor?: TextExtractor
) {
	const extractedText = textExtractor
		? textExtractor(htmlElement)
		: htmlElement.text();
	return extractedText || "";
}

function findElements(
	query: string,
	element: Scanny,
	textExtractor?: TextExtractor
): Action[] {
	const elements: string[] = [];
	$(element.selector)
		.filter(element.filter(query))
		.each(function () {
			const text = getHTMLElementText($(this), textExtractor);
			text !== "" && elements.push(text);
		});
	return filterDuplicates(elements).map((el) =>
		createInteractiveAction(el, element.description, element.icon)
	);
}
