import $ from "jquery";
import { Scanny, mapDescriptionToScanny } from "./elements-actions";
import { Action } from "../actions/data/types-data";

const TARGET_ATTRIBUTE = "data-scanny-target-id";

function escapeAttributeValue(value: string): string {
	return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function findElementForAction(action: Action, elementAction: Scanny) {
	if (action.id) {
		const selector = `[${TARGET_ATTRIBUTE}="${escapeAttributeValue(action.id)}"]`;
		const byId = $(selector).first();
		if (byId.length > 0) {
			return byId;
		}
	}
	return $(elementAction.selector).filter(elementAction.filter(action.title)).first();
}

export function clickElement(action: Action) {
	const elementAction = mapDescriptionToScanny(action.description);
	if (!elementAction) return;
	clickElements(action, elementAction);
}

function clickElements(action: Action, element: Scanny) {
	var $element = findElementForAction(action, element);
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
