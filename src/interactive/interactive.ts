import $ from "jquery";

export function clickLinkElement(query: string) {
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

export function clickButtonElement(query: string) {
	var $element = $("button")
		.filter(":contains(" + query + ")")
		.first();
	var clickEvent = new MouseEvent("click", {
		view: window,
		bubbles: true,
		cancelable: true,
	});
	$element[0].dispatchEvent(clickEvent);
}
