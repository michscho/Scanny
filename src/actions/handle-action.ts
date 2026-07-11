import { clickElement } from "../interactive/click-element";
import { addhttp } from "../extension/utils";
import { toggleAutoScroll } from "../interactive/auto-scroll";
import { Action } from "./data/types-data";

export function handleActionItem(
	query: string,
	selectedAction: Action,
	event: Pick<
		React.KeyboardEvent<HTMLInputElement>,
		"ctrlKey" | "metaKey" | "currentTarget"
	>
) {
	function copyText(text: string) {
		if (navigator.clipboard?.writeText) {
			navigator.clipboard.writeText(text).catch(() => {});
			return;
		}
		const textarea = document.createElement("textarea");
		textarea.value = text;
		textarea.style.position = "fixed";
		textarea.style.opacity = "0";
		document.body.appendChild(textarea);
		textarea.focus();
		textarea.select();
		document.execCommand("copy");
		document.body.removeChild(textarea);
	}

	if (query.startsWith("/remove")) {
		chrome.runtime.sendMessage({
			request: "remove",
			type: selectedAction.type,
			action: selectedAction,
		});
		return;
	}

	if (query.startsWith("/history")) {
		if (event.ctrlKey || event.metaKey) {
			window.open(selectedAction.url);
			return;
		}
		window.open(selectedAction.url, "_self");
		return;
	}

	if (query.startsWith("/bookmarks")) {
		if (event.ctrlKey || event.metaKey) {
			window.open(selectedAction.url);
			return;
		}
		window.open(selectedAction.url, "_self");
		return;
	}
	if (query.startsWith(">")) {
		clickElement(selectedAction);
		return;
	}

	// Handle interactive (page) elements found in regular search mode
	if (selectedAction.action === "web-element") {
		clickElement(selectedAction);
		return;
	}

	if (selectedAction.action === "open-scanny-settings") {
		chrome.runtime.sendMessage({ request: "open-scanny-settings" });
		return;
	}

	if (selectedAction.action === "copy-ai-answer") {
		copyText(selectedAction.description);
		return;
	}

	if (selectedAction.action === "none") {
		return;
	}

	chrome.runtime.sendMessage({
		request: selectedAction.action,
		tab: selectedAction,
		query: event.currentTarget.value,
	});
	switch (selectedAction.action) {
		case "bookmark":
			if (event.ctrlKey || event.metaKey) {
				window.open(selectedAction.url);
			} else {
				window.open(selectedAction.url, "_self");
			}
			break;
		case "scroll-bottom":
			window.scrollTo(0, document.body.scrollHeight);
			break;
		case "scroll-top":
			window.scrollTo(0, 0);
			break;
		case "auto-scroll":
			toggleAutoScroll();
			break;
		case "navigation":
			if (event.ctrlKey || event.metaKey) {
				window.open(selectedAction.url);
			} else {
				window.open(selectedAction.url, "_self");
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
				window.open(selectedAction.url);
			} else {
				window.open(selectedAction.url, "_self");
			}
			break;
		case "goto":
			const query = event.currentTarget.value.trim();
			if (!query) {
				break;
			}
			if (event.ctrlKey || event.metaKey) {
				window.open(addhttp(query));
			} else {
				window.open(addhttp(query), "_self");
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
