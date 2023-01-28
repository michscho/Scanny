import $ from "jquery";
import jQuery from "jquery";
import { keyMapings } from "./utils/key-mappings";
import { openExtension } from "./extension/extension";
import { Action } from "./actions/data/types-data";

jQuery(function () {
	var actions: Action[] = [];
	var currentKeysDown = [];

	chrome.runtime.sendMessage({ request: "get-actions" }, (response) => {
		actions = response.actions;
	});

	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		console.log(message);
		if (message.request === "open-scanny") {
			const extensionRoot = document.createElement("div");
			document.body.appendChild(extensionRoot);
			openExtension(extensionRoot, actions);
		}
	});

	$(document).on("click", ".scanny-extension #scanny-overlay", () =>
		// TODO: Close
		{}
	);
});
