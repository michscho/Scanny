import $ from "jquery";
import jQuery from "jquery";
import { keyMapings } from "./utils/key-mappings";
import { openExtension } from "./extension/extension";
import { Action } from "./actions/data/types-data";

document.onkeyup = (e: KeyboardEvent) => {
	if (e.key == "Escape") {
		chrome.runtime.sendMessage({ request: "close-omni" });
	}
};

export function closeExtension() {
	$("#omni-extension").addClass("omni-closing");
}

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
			document.body.appendChild(extensionRoot);
			openExtension(extensionRoot, actions);
		}
	});

	$(document).on("click", ".omni-extension #omni-overlay", () =>
		closeExtension()
	);
});
