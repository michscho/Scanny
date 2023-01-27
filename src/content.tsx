import $ from "jquery";
import jQuery from "jquery";
import { keyMapings } from "./utils/key-mappings";
import { openExtension } from "./extension/extension";
import { Action } from "./actions/data/types-data";

document.onkeyup = (e: KeyboardEvent) => {
	if (e.key == "Escape") {
		chrome.runtime.sendMessage({ request: "close-scanny" });
	}
};

export function closeExtension() {
	$("#scanny-extension").addClass("scanny-closing");
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
		console.log(message);
		if (message.request === "open-scanny") {
			const extensionRoot = document.createElement("div");
			document.body.appendChild(extensionRoot);
			openExtension(extensionRoot, actions);
		}
	});

	$(document).on("click", ".scanny-extension #scanny-overlay", () =>
		closeExtension()
	);
});
