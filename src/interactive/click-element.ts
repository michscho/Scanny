import $ from "jquery";
import { Scanny, mapDescriptionToScanny } from "./elements-actions";
import { Action } from "../actions/data/types-data";

const TARGET_ATTRIBUTE = "data-scanny-target-id";

function escapeAttributeValue(value: string): string {
	return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function findElementByTargetId(action: Action): HTMLElement | null {
	if (!action.id) return null;
	const selector = `[${TARGET_ATTRIBUTE}="${escapeAttributeValue(action.id)}"]`;
	const el = document.querySelector<HTMLElement>(selector);
	return el || null;
}

function findElementForAction(action: Action): HTMLElement | null {
	// Primary: use data-scanny-target-id (works for all element types)
	const byId = findElementByTargetId(action);
	if (byId) return byId;

	// Fallback: use description-based selector lookup
	const elementAction = mapDescriptionToScanny(action.description);
	if (!elementAction) return null;
	const $el = $(elementAction.selector)
		.filter(elementAction.filter(action.title))
		.first();
	return $el.length > 0 ? $el[0] : null;
}

export function clickElement(action: Action) {
	const el = findElementForAction(action);
	if (!el) return;
	clickHTMLElement(el);
}

function clickHTMLElement(el: HTMLElement) {
	// Scroll element into view first
	el.scrollIntoView({ block: "center", behavior: "smooth" });

	// Focus the element if possible
	if (typeof el.focus === "function") {
		el.focus();
	}

	// Dispatch full mouse event sequence for better reliability
	el.dispatchEvent(
		new MouseEvent("mousedown", {
			view: window,
			bubbles: true,
			cancelable: true,
		})
	);
	el.dispatchEvent(
		new MouseEvent("mouseup", {
			view: window,
			bubbles: true,
			cancelable: true,
		})
	);
	el.dispatchEvent(
		new MouseEvent("click", {
			view: window,
			bubbles: true,
			cancelable: true,
		})
	);

	// Fallback: use native click for frameworks that intercept it differently
	if (typeof el.click === "function") {
		el.click();
	}
}
