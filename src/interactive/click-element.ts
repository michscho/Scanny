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

	var el = $element[0];

	// Scroll element into view first
	el.scrollIntoView({ block: "center", behavior: "smooth" });

	// Focus the element if possible
	if (typeof el.focus === "function") {
		el.focus();
	}

	// Dispatch full mouse event sequence for better reliability
	var mouseDownEvent = new MouseEvent("mousedown", {
		view: window,
		bubbles: true,
		cancelable: true,
	});
	el.dispatchEvent(mouseDownEvent);

	var mouseUpEvent = new MouseEvent("mouseup", {
		view: window,
		bubbles: true,
		cancelable: true,
	});
	el.dispatchEvent(mouseUpEvent);

	var clickEvent = new MouseEvent("click", {
		view: window,
		bubbles: true,
		cancelable: true,
	});
	el.dispatchEvent(clickEvent);

	// Fallback: use native click for frameworks that intercept it differently
	if (typeof el.click === "function") {
		el.click();
	}
}
