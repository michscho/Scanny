import { Action } from "../actions/data/types-data";
import $ from "jquery";
import { mapDescriptionToScanny } from "./elements-actions";

var focusedElement: JQuery<HTMLElement> | null = null;
const TARGET_ATTRIBUTE = "data-scanny-target-id";

function escapeAttributeValue(value: string): string {
	return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function findElementForAction(action: Action): JQuery<HTMLElement> | null {
	// Primary: use data-scanny-target-id (works for all element types)
	if (action.id) {
		const selector = `[${TARGET_ATTRIBUTE}="${escapeAttributeValue(action.id)}"]`;
		const byId = $(selector).first();
		if (byId.length > 0) return byId;
	}
	// Fallback: description-based lookup
	const elementAction = mapDescriptionToScanny(action.description);
	if (!elementAction) return null;
	const $el = $(elementAction.selector)
		.filter(elementAction.filter(action.title))
		.first();
	return $el.length > 0 ? $el : null;
}

export function focusOnElement(action?: Action) {
	// Remove previous highlight
	focusedElement?.css({
		outline: "",
		"outline-offset": "",
		"box-shadow": "",
	});
	if (!action) return;

	// Only focus interactive (page) elements
	if (action.type !== "interactive") return;

	const newFocusElement = findElementForAction(action);
	if (!newFocusElement || newFocusElement.length === 0) return;

	newFocusElement.css({
		outline: "2px solid #3ba6ff",
		"outline-offset": "2px",
		"box-shadow": "0 0 0 4px rgba(59, 166, 255, 0.25)",
	});
	focusedElement = newFocusElement;
	scrollToInvisibleItem(newFocusElement);
}

function scrollToInvisibleItem(element: JQuery<HTMLElement>) {
	const elementTop = element.offset()?.top;
	const elementHeight = element.outerHeight();
	const viewportTop = $(window).scrollTop();
	const viewportHeight = $(window).height();
	if (
		elementTop === undefined ||
		elementHeight === undefined ||
		viewportTop === undefined ||
		viewportHeight === undefined
	) {
		return;
	}
	const elementBottom = elementTop + elementHeight;
	const viewportBottom = viewportTop + viewportHeight;
	if (elementBottom > viewportBottom || elementTop < viewportTop) {
		const target = element.get(0);
		if (target) {
			target.scrollIntoView({ block: "center" });
		}
	}
}
