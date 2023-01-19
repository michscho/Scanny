import $ from "jquery";
import jQuery from "jquery";
import { keyMapings } from "./utils/key-mappings";
import { Action } from "./actions/actions-data";
import { closeExtension, openExtension } from "./extension/extension";

document.onkeyup = (e) => {
	if (e.key == "Escape") {
		chrome.runtime.sendMessage({ request: "close-omni" });
	}
};

jQuery(function () {
	var actions: Action[] = [];
	var currentKeysDown = [];

	chrome.runtime.sendMessage({ request: "get-actions" }, (response) => {
		actions = response.actions;
	});

	$(document).on("keydown", (e) => {
		currentKeysDown[e.keyCode] = true;
		if (currentKeysDown[keyMapings.enter]) {
			// handleAction(e, actions);
			return;
		}
		if (currentKeysDown[keyMapings.esc]) {
			closeExtension();
			return;
		}
	});

	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		if (message.request === "open-omni") {
			const extensionRoot = document.createElement("div");
			extensionRoot.id = "omni-extension";
			extensionRoot.className = "omni-extension";
			document.body.appendChild(extensionRoot);
			openExtension(extensionRoot, actions);
		}
	});

	$(document).on("click", ".omni-extension #omni-overlay", () =>
		closeExtension()
	);
});
