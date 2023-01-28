import $ from "jquery";

export function clickElement(query: string, description: string) {
	switch (description) {
		case "Clickable button":
			clickButtonElement(query);
			break;
		case "Clickable link":
			console.log("Inside");
			clickLinkElement(query);
			break;
		case "Placeholder":
			clickPlaceholderElement(query);
			break;
		default:
			console.error("Invalid action type");
			break;
	}
}

function clickLinkElement(query: string) {
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

function clickButtonElement(query: string) {
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

function clickPlaceholderElement(query: string) {
	var $element = $("[placeholder='" + query + "']").focus();
	var clickEvent = new MouseEvent("focus", {
		view: window,
		bubbles: true,
		cancelable: true,
	});
	$element[0].dispatchEvent(clickEvent);
}
