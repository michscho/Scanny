import { clickElement } from "../interactive/interactive";
import { closeOmni, populateOmni } from "../omni/omni";
import { addhttp, showToast } from "../omni/utils";
import { Action } from "./actions-data";
import $ from "jquery";

export function handleAction(e, actions: Action[], isOpen: boolean) {
	var action = actions[$(".omni-item-active").attr("data-index")];
	isOpen = closeOmni(isOpen);

	handleActionItems(action, e);
	// Fetch actions again
	chrome.runtime.sendMessage({ request: "get-actions" }, (response) => {
		actions = response.actions;
		populateOmni(actions);
	});

	return isOpen;
}

function handleActionItems(action: Action, e) {
	if (inputStartsWith("/remove")) {
		chrome.runtime.sendMessage({
			request: "remove",
			type: action.type,
			action: action,
		});
		return;
	}

	if (inputStartsWith("/history")) {
		if (e.ctrlKey || e.metaKey) {
			window.open($(".omni-item-active").attr("data-url"));
			return;
		}
		window.open($(".omni-item-active").attr("data-url"), "_self");
		return;
	}

	if (inputStartsWith("/bookmarks")) {
		if (e.ctrlKey || e.metaKey) {
			window.open($(".omni-item-active").attr("data-url"));
		}
		window.open($(".omni-item-active").attr("data-url"), "_self");
		return;
	}

	if (inputStartsWith("/interactive")) {
		const query = $(".omni-item-active .omni-item-name").text();
		const action = $(".omni-item-active .omni-item-desc").text();
		console.log(query, "QUERY");
		clickElement(query, action);
		return;
	}

	chrome.runtime.sendMessage({
		request: action.action,
		tab: action,
		query: $(".omni-extension input").val(),
	});
	switch (action.action) {
		case "bookmark":
			if (e.ctrlKey || e.metaKey) {
				window.open(action.url);
			} else {
				window.open(action.url, "_self");
			}
			break;
		case "scroll-bottom":
			window.scrollTo(0, document.body.scrollHeight);
			showToast(action);
			break;
		case "scroll-top":
			window.scrollTo(0, 0);
			break;
		case "scroll-by":
			const query = $(".omni-item-active .omni-item-name")
				.val()
				.toString()
				.replace("scroll by", "");
			if (typeof query === "number") {
				window.scrollBy(0, query);
			}
			break;
		case "navigation":
			if (e.ctrlKey || e.metaKey) {
				window.open(action.url);
			} else {
				window.open(action.url, "_self");
			}
			break;
		case "fullscreen":
			var elem = document.documentElement;
			elem.requestFullscreen();
			break;
		case "new-tab":
			window.open("");
			break;
		case "email":
			window.open("mailto:");
			break;
		case "url":
			if (e.ctrlKey || e.metaKey) {
				window.open(action.url);
			} else {
				window.open(action.url, "_self");
			}
			break;
		case "goto":
			if (e.ctrlKey || e.metaKey) {
				window.open(addhttp($(".omni-extension input").val().toString()));
			} else {
				window.open(
					addhttp($(".omni-extension input").val().toString()),
					"_self"
				);
			}
			break;
		case "print":
			window.print();
			break;
		case "remove-all":
		case "remove-history":
		case "remove-cookies":
		case "remove-cache":
		case "remove-local-storage":
		case "remove-passwords":
			showToast(action);
			break;
	}
}

function inputStartsWith(startingValue: string) {
	return $(".omni-extension input")
		.val()
		.toString()
		.toLowerCase()
		.startsWith(startingValue);
}
