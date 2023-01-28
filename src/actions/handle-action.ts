import { clickElement } from "../interactive/interactive";
import { addhttp } from "../extension/utils";
import { Action } from "./data/types-data";

export function handleActionItem(
	query: string,
	action: Action,
	event: React.KeyboardEvent<HTMLInputElement>
) {
	console.log(query, action, event);
	if (query.startsWith("/remove")) {
		chrome.runtime.sendMessage({
			request: "remove",
			type: action.type,
			action: action,
		});
		return;
	}

	if (query.startsWith("/history")) {
		if (event.ctrlKey || event.metaKey) {
			window.open(action.url);
			return;
		}
		window.open(action.url, "_self");
		return;
	}

	if (query.startsWith("/bookmarks")) {
		if (event.ctrlKey || event.metaKey) {
			window.open(action.url);
		}
		window.open(action.url, "_self");
		return;
	}

	if (query.startsWith(">")) {
		clickElement(query.replace(">", ""), action.description);
		return;
	}

	chrome.runtime.sendMessage({
		request: action.action,
		tab: action,
		query: event.currentTarget.value,
	});
	switch (action.action) {
		case "bookmark":
			if (event.ctrlKey || event.metaKey) {
				window.open(action.url);
			} else {
				window.open(action.url, "_self");
			}
			break;
		case "scroll-bottom":
			window.scrollTo(0, document.body.scrollHeight);
			break;
		case "scroll-top":
			window.scrollTo(0, 0);
			break;
		case "navigation":
			if (event.ctrlKey || event.metaKey) {
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
			if (event.ctrlKey || event.metaKey) {
				window.open(action.url);
			} else {
				window.open(action.url, "_self");
			}
			break;
		case "goto":
			const query = event.currentTarget.value 
			if (event.ctrlKey || event.metaKey) {
				window.open(addhttp(query));
			} else {
				window.open(
					addhttp(query),
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
			// TODO: add toaster again
			break;
	}
}
