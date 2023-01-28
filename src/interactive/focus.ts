import { Action } from "../actions/data/types-data";
import $ from "jQuery";
import { mapDescriptionToScanny } from "./elements-actions";

var focusedElement: JQuery<HTMLElement> | null = null;

export function focusOnElement(action: Action) {
	focusedElement?.css("outline", "none");
	if (!action) {
		return;
	}
	const elementAction = mapDescriptionToScanny(action.description);
	if (!elementAction) {
		return;
	}
	var newFocusElement = $(elementAction.selector)
		.filter(elementAction.filter(action.title))
		.first();
	newFocusElement.css("outline", "1px solid red");
	scrollToInvisibleItem();
	focusedElement = newFocusElement;
}

function scrollToInvisibleItem() {
	if (focusedElement) {
		var elementTop = focusedElement.offset()?.top;
		var elementBottom = elementTop + focusedElement.outerHeight();
		var viewportTop = $(window).scrollTop();
		var viewportBottom = viewportTop + $(window).height();
		if (elementBottom > viewportBottom || elementTop < viewportTop) {
			focusedElement[0].scrollIntoView({ block: "center" });
		}
	}
}
