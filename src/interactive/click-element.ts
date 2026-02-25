import $ from "jquery";
import { Scanny, mapDescriptionToScanny } from "./elements-actions";

export function clickElement(query: string, description: string) {
	const elementAction = mapDescriptionToScanny(description);
	if (!elementAction) return;
	clickElements(query, elementAction);
}

function clickElements(query: string, element: Scanny) {
	var $element = $(element.selector).filter(element.filter(query)).first();
	if ($element.length === 0) return;
	var clickEvent = new MouseEvent("click", {
		view: window,
		bubbles: true,
		cancelable: true,
	});
	$element[0].dispatchEvent(clickEvent);
}
