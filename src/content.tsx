import $ from "jquery";
import { openExtension } from "./extension/extension";
import { Action } from "./actions/data/types-data";

$(function () {
	var actions: Action[] = [];

	chrome.runtime.sendMessage({ request: "get-actions" }, (response) => {
		actions = response.actions;
	});

	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		if (message.request === "open-scanny") {
			const extensionRoot = document.createElement("div");
			document.body.appendChild(extensionRoot);
			openExtension(extensionRoot, actions);
		}
	});
});
