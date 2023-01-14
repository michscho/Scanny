import $ from "jquery";

export function createAction(title, desc, emojiChar) {
	return {
		title: title,
		desc: desc,
		type: "interactive",
		action: "web-element",
		emoji: true,
		emojiChar: emojiChar,
		url: desc,
	};
}

export function findClickableElementsText(query) {
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
	const aActions = filterDuplicates(aElements).map((el) => {
		return createAction(el, "Clickable link", "🔗");
	});
	const buttonActions = filterDuplicates(buttonElements).map((el) => {
		return createAction(el, "Clickable button", "🔘");
	});
	return aActions.concat(buttonActions);
}

export function clickElement(query) {
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

function containsOnlyWhitespace(str) {
	return /^\s*$/.test(str);
}

function filterDuplicates(arr) {
	return [...new Set(arr)];
}
